import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const fade = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], clamp);
const ease = (f: number, a: number, b: number) => { const x = fade(f, a, b); return x * x * (3 - 2 * x); };

type Node = {label: string; sub: string; x: number; y: number; start: number; color: string};
const nodes: Node[] = [
 {label:'AMD', sub:'设计 · 美国', x:180, y:470, start:0, color:'#83d66b'},
 {label:'Synopsys', sub:'EDA软件 · 美国', x:540, y:220, start:90, color:'#a78bfa'},
 {label:'Cadence', sub:'EDA软件 · 美国', x:540, y:390, start:120, color:'#a78bfa'},
 {label:'TSMC', sub:'制造 · 中国台湾', x:1410, y:650, start:210, color:'#f0a24b'},
 {label:'ASML', sub:'光刻机 · 荷兰', x:1030, y:170, start:270, color:'#e9c46a'},
 {label:'SK hynix', sub:'高速内存 · 韩国', x:1460, y:205, start:360, color:'#e789a6'},
 {label:'封装', sub:'先进封装 · 亚洲', x:1080, y:790, start:450, color:'#56c8c1'},
];

const paths = [
 'M220 470 C360 430 400 260 500 235',
 'M220 470 C360 480 405 400 500 405',
 'M220 470 C600 570 930 610 1370 650',
 'M620 235 C790 180 850 170 990 170',
 'M1370 650 C1180 700 1130 760 1120 790',
 'M1370 650 C1410 480 1430 310 1450 245',
];

function NodeCard({n, f}:{n:Node; f:number}) {
 const p = ease(f, n.start, n.start + 30);
 return <g opacity={p} transform={`translate(${n.x} ${n.y}) scale(${.86 + .14 * p})`}>
  <rect x="-145" y="-52" width="290" height="104" rx="16" fill="#f8f8f6"/>
  <rect x="-145" y="-52" width="8" height="104" rx="4" fill={n.color}/>
  <text textAnchor="middle" y="3" fill="#171b24" fontSize="34" fontFamily="Arial, sans-serif" fontWeight="700">{n.label}</text>
  <text textAnchor="middle" y="82" fill="#ddd8ca" fontSize="24" fontFamily="PingFang SC, sans-serif">{n.sub}</text>
 </g>;
}

export function AmdPrototype() {
 const f = useCurrentFrame();
 useVideoConfig();
 const headline = f < 100 ? 'AMD，一家芯片公司。' : f < 220 ? '但一颗 AMD 芯片，真的全部由 AMD 完成吗？' : f < 500 ? '它背后，是一张全球产业网络。' : '设计、制造、内存与封装，最后汇聚成一颗芯片。';
 const headlineStart = f < 100 ? 0 : f < 220 ? 100 : f < 500 ? 220 : 500;
 const lineOpacity = fade(f, headlineStart, headlineStart + 18) * (1 - fade(f, headlineStart + 70, headlineStart + 90));
 const end = fade(f, 780, 899);
 return <AbsoluteFill style={{background:'#080a0f', color:'white'}}>
  <svg viewBox="0 0 1920 1080" width="100%" height="100%">
   <defs>
    <pattern id="grid" width="34" height="34" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1.2" fill="#3b4350" opacity=".48"/></pattern>
    <filter id="glow"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
   </defs>
   <rect width="1920" height="1080" fill="url(#grid)" opacity=".45"/>
   <text x="110" y="105" fill="#7f8798" fontFamily="Arial, sans-serif" fontSize="25" letterSpacing="7">COMPUTING SUPPLY NETWORK</text>
   {paths.map((d, i) => <path key={d} d={d} fill="none" stroke={i < 2 ? '#a78bfa' : i < 4 ? '#8edc6d' : '#e9b45f'} strokeWidth="5" opacity={fade(f, 60 + i * 45, 110 + i * 45)} strokeDasharray="900" strokeDashoffset={900 * (1 - fade(f, 60 + i * 45, 170 + i * 45))} filter="url(#glow)"/>) }
   {nodes.map(n => <NodeCard key={n.label} n={n} f={f}/>) }
   <g opacity={lineOpacity}>
    <text x="960" y="960" textAnchor="middle" fill="#f5f1e8" fontFamily="PingFang SC, sans-serif" fontSize="46" fontWeight="700">{headline}</text>
   </g>
   <g opacity={end}>
    <path d="M120 930 C500 880 920 920 1270 820 S1640 720 1800 630" fill="none" stroke="#83d66b" strokeWidth="7"/>
    <text x="1450" y="600" fill="#83d66b" fontSize="30" fontFamily="PingFang SC, sans-serif">全球协作网络</text>
   </g>
   <rect x="0" y="0" width="1920" height="1080" fill="#080a0f" opacity={.35 * end}/>
  </svg>
  <div style={{position:'absolute', left:110, bottom:42, color:'#78808f', fontFamily:'Arial, sans-serif', fontSize:18, letterSpacing:3}}>AMD / CHIP DESIGN / GLOBAL SUPPLY CHAIN</div>
 </AbsoluteFill>;
}
