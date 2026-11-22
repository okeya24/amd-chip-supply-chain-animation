import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const sampleRate = 44100;
const duration = (509 - 391) / 1.05 + .1;
const finaleTime = (452 - 391) / 1.05;
const beatSeconds = 60 / 108;
const tau = 2 * Math.PI;
const chords = [
 [38, 54, 57, 62, 64],
 [43, 55, 59, 62, 67],
 [47, 54, 59, 62, 66],
 [45, 57, 61, 64, 69],
].map((chord) => chord.map((note) => tau * 440 * 2 ** ((note - 69) / 12)));
const motif = [1, 2, 3, 4, 2, 3, 4, 3];
const smooth = (value) => {
 const x = Math.max(0, Math.min(1, value));
 return x * x * (3 - 2 * x);
};
const ramp = (t, start, end) => smooth((t - start) / (end - start));
const frames = Math.ceil(sampleRate * duration);
const samples = Buffer.allocUnsafe(frames * 8);

for (let frame = 0; frame < frames; frame++) {
 const t = frame / sampleRate;
 const beats = t / beatSeconds;
 const bar = Math.floor(beats / 4);
 const current = chords[bar % chords.length];
 const previous = chords[(bar + chords.length - 1) % chords.length];
 const blend = smooth((beats % 4) / .55);
 const build = .27 + .31 * ramp(t, 10, 31) + .42 * ramp(t, 33, 58);
 const fade = ramp(t, 0, 3.1) * (1 - ramp(t, duration - 5, duration - .1));
 const step = Math.floor(beats * 2);
 const noteTime = t % (beatSeconds / 2);
 const note = current[motif[step % motif.length]] * 2;
 const phase = note * noteTime;
 const pluck = ramp(noteTime, 0, .012) * Math.exp(-8 * noteTime) * (1 - ramp(noteTime, .22, beatSeconds / 2));
 const piano = .12 * build * pluck * (Math.sin(phase) + .24 * Math.sin(phase * 2));
 const beatTime = t % beatSeconds;
 const strike = Math.floor(beats) % 4 === 0 ? 1 : .58;
 const kick = .19 * build * strike * ramp(beatTime, 0, .005) *
  Math.exp(-14 * beatTime) * Math.sin(tau * (48 * beatTime + 2.2 * (1 - Math.exp(-28 * beatTime))));
 const upper = Math.sin(current[4] * t * 2) * .025 * ramp(t, 34, 58) * Math.sin(Math.PI * blend);
 const systemLift = .043 * ramp(t, 57, 61) * Math.sin(current[3] * t * 2) * Math.sin(Math.PI * blend);
 const sinceCut = Math.max(0, t - finaleTime);
 const finale = ramp(t, finaleTime, finaleTime + .65);
 const impact = .48 * ramp(sinceCut, 0, .008) * Math.exp(-3.9 * sinceCut) *
  Math.sin(tau * (49 * sinceCut + 3.2 * (1 - Math.exp(-19 * sinceCut))));
 const march = .14 * finale * ramp(beatTime, 0, .006) * Math.exp(-10 * beatTime) *
  Math.sin(tau * (72 * beatTime + 2.4 * (1 - Math.exp(-24 * beatTime))));
 const leadPhase = current[motif[Math.floor(beats) % motif.length]] * beatTime;
 const lead = .15 * finale * ramp(beatTime, 0, .045) * (1 - ramp(beatTime, .34, beatSeconds)) *
  (Math.sin(leadPhase) + .31 * Math.sin(leadPhase * 2) + .15 * Math.sin(leadPhase * 3));
 for (let channel = 0; channel < 2; channel++) {
  const side = channel === 0 ? -1 : 1;
  const pad = (notes) => (
   .047 * Math.sin(notes[0] * t) +
   .034 * Math.sin(notes[1] * t + .2 * side) +
   .026 * Math.sin(notes[2] * t + .3 * side) +
   .022 * Math.sin(notes[3] * t + .4 * side) +
   .019 * Math.sin(notes[4] * t + .2 * Math.sin(t * 1.3 + side))
  );
  const chord = pad(previous) * (1 - blend) + pad(current) * blend;
  const stereoPiano = piano * (1 + side * .21 * (step % 2 === 0 ? 1 : -1));
  const music = chord * (.48 + .28 * build + .15 * finale) + stereoPiano + kick + upper + systemLift;
  samples.writeFloatLE((music + impact + march + lead) * fade, frame * 8 + channel * 4);
 }
}

execFileSync('ffmpeg', [
 '-v', 'error', '-y', '-f', 'f32le', '-ar', String(sampleRate), '-ac', '2', '-i', 'pipe:0',
 '-af', 'highpass=f=40,acompressor=threshold=0.12:ratio=2.1:attack=18:release=130:makeup=1.65,alimiter=limit=0.82:level=0:latency=1',
 '-c:a', 'libmp3lame', '-b:a', '192k',
 fileURLToPath(new URL('../public/amd-china-lift.mp3', import.meta.url)),
], {input: samples, stdio: ['pipe', 'inherit', 'inherit']});
