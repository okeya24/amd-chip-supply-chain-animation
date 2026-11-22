import {once} from 'node:events';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const duration = 474;
const playbackRate = 1.05;
const rate = 44100;
const beat = 60 / 84;
const tau = 2 * Math.PI;
const chords = [
 [38, 50, 57, 60, 64],
 [34, 53, 57, 60, 65],
 [41, 53, 55, 57, 64],
 [36, 52, 55, 62, 67],
].map((notes) => notes.map((note) => tau * 440 * 2 ** ((note - 69) / 12)));

const smooth = (x) => {
 const n = Math.max(0, Math.min(1, x));
 return n * n * (3 - 2 * n);
};
const ramp = (t, start, end) => smooth((t - start) / (end - start));
const out = fileURLToPath(new URL('../public/amd-chip-network-score-clear.mp3', import.meta.url));
const ffmpeg = spawn('ffmpeg', [
 '-hide_banner', '-loglevel', 'error', '-y', '-f', 'f32le', '-ar', String(rate),
 '-ac', '2', '-i', 'pipe:0', '-af', 'highpass=f=55', '-c:a', 'libmp3lame', '-b:a', '224k',
 '-metadata', 'title=AMD Chip Network - Original Score', out,
], {stdio: ['pipe', 'ignore', 'inherit']});
const closed = once(ffmpeg, 'close');
const total = Math.round(duration * rate / playbackRate);
const block = Buffer.allocUnsafe(8192 * 8);

for (let start = 0; start < total; start += 8192) {
 const count = Math.min(8192, total - start);
 for (let i = 0; i < count; i++) {
  const outputTime = (start + i) / rate;
  const t = outputTime * playbackRate;
  const bar = t / (beat * 4);
  const index = Math.floor(bar);
  const change = smooth((bar - index) / .24);
  const current = chords[index % chords.length];
  const previous = chords[(index + chords.length - 1) % chords.length];
  const pulse = ramp(t, 34, 68) * (1 - .56 * ramp(t, 250, 270) + .56 * ramp(t, 319, 348));
  const lift = ramp(t, 323, 382) * (1 - .45 * ramp(t, 402, 414)) + .38 * ramp(t, 437, 457);
  const fade = ramp(t, 0, 3) * (1 - ramp(t, 467, duration));
  const beatTime = t % beat;
  const eighth = beat / 2;
  const step = Math.floor(t / eighth);
  const noteTime = t % eighth;
  const pluckNote = 2 * current[[1, 3, 2, 4, 2, 3, 1, 4][step % 8]];
  const pluckPhase = pluckNote * noteTime / playbackRate;
  const pluckEnv = ramp(noteTime, 0, .012) * Math.exp(-noteTime * 12) * (1 - ramp(noteTime, .24, eighth));
  const bassEnv = ramp(beatTime, 0, .035) * Math.exp(-beatTime * 5);
  const bass = .027 * pulse * bassEnv * Math.sin(current[0] * beatTime / playbackRate);
  const keys = (.034 + .046 * pulse + .017 * lift) * pluckEnv *
   (Math.sin(pluckPhase) + .28 * Math.sin(pluckPhase * 2) + .09 * Math.sin(pluckPhase * 3));
  const pad = (notes, side) => (
   Math.sin(outputTime * notes[0]) * .013 +
   Math.sin(outputTime * notes[1] + side * .17) * .020 +
   Math.sin(outputTime * notes[2] + .2 * Math.sin(t * .8 + side)) * .024 +
   Math.sin(outputTime * notes[3] + side * .45) * .024 +
   Math.sin(outputTime * notes[4] + side * .6) * (.022 + .016 * lift)
  );
  for (let channel = 0; channel < 2; channel++) {
   const side = channel === 0 ? -1 : 1;
   const bed = pad(previous, side) * (1 - change) + pad(current, side) * change;
   const tone = bed * (.86 + .15 * Math.sin(t * .53)) + bass + keys * (1 + side * .14 * (step % 2 === 0 ? 1 : -1));
   block.writeFloatLE(tone * fade * 1.9, i * 8 + channel * 4);
  }
 }
 if (!ffmpeg.stdin.write(Buffer.from(block.subarray(0, count * 8)))) await once(ffmpeg.stdin, 'drain');
}
ffmpeg.stdin.end();
const [exitCode] = await closed;
if (exitCode !== 0) process.exitCode = 1;
