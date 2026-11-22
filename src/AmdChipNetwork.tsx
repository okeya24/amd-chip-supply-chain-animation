import {AbsoluteFill, Audio, Img, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

const amdSourceDuration = 509;
const amdPlaybackRate = 1.05;
const chinaMusicStart = 391;
const finaleStart = 452;
export const amdFps = 30;
export const amdDurationInFrames = Math.ceil(amdSourceDuration * amdFps / amdPlaybackRate);

type Beat = {at: number; caption: string};
type Chapter = {name: string; beats: Beat[]};

const chapters: Chapter[] = [
 {name: '一颗芯片的背后', beats: [
  {at: 0, caption: '一颗 AMD 芯片，到底是谁造出来的？'},
  {at: 7, caption: '名字写在芯片上，设计也出自 AMD。'},
  {at: 14, caption: '设计图要变成实物，得先交给晶圆厂。'},
  {at: 22, caption: 'AMD 的先进 CPU 和 GPU 晶圆，主要看台积电。'},
  {at: 31, caption: '再沿着这条线往上追，答案还会变。'},
 ]},
 {name: '谁提供了什么', beats: [
  {at: 40, caption: '画芯片也需要工具，这类设计软件叫 EDA。'},
  {at: 49, caption: '新思和楷登，是这个行业的代表厂商。'},
  {at: 59, caption: '晶圆厂还需要设备，把电路图案印到硅片上。'},
  {at: 69, caption: '荷兰 ASML 提供光刻设备。它在晶圆厂的上游。'},
  {at: 80, caption: '晶圆做完，切出的小芯片还要封装。'},
  {at: 90, caption: '有些 AI 加速器，会把计算芯片和高速内存封装在一起。'},
 ]},
 {name: '把小芯片组装起来', beats: [
  {at: 100, caption: '接下来，看 AMD 自己做的选择。'},
  {at: 109, caption: '一块硅片，可以同时承担计算和连接。'},
  {at: 119, caption: '也可以把功能拆成独立的小芯片，再封装在一起。'},
  {at: 130, caption: '有的小芯片负责算，有的负责和外部交换数据。'},
  {at: 141, caption: '不同模块，可以选用适合自己的制造工艺。'},
  {at: 152, caption: '这种设计叫 Chiplet，也就是芯粒。'},
  {at: 163, caption: '拆开容易看懂。难的是让它们重新连成一个整体。'},
 ]},
 {name: '从电脑到 AI 机房', beats: [
  {at: 175, caption: '这种模块化思路，去了几个不同的市场。'},
  {at: 184, caption: 'Ryzen 是个人电脑处理器。'},
  {at: 195, caption: 'EPYC 面向服务器。它与 Ryzen 都有 Zen 系列 CPU 核心。'},
  {at: 207, caption: 'Instinct 面向 AI 和高性能计算，采用自己的 GPU 架构。'},
  {at: 219, caption: '拿 MI300X 举例，一块加速器配有 192 GB 高带宽内存。'},
  {at: 231, caption: '把内存放近，是为了让计算单元更快拿到数据。'},
  {at: 242, caption: '进入机房，这些加速器还要和服务器、网络一起工作。'},
 ]},
 {name: '真正的对手', beats: [
  {at: 253, caption: '如果换一套芯片，原来的模型还能跑吗？'},
  {at: 263, caption: 'AMD 用 ROCm，把开发框架和自己的 GPU 接起来。'},
  {at: 275, caption: '英伟达对应的是 CUDA。大量现成工具围着它开发。'},
  {at: 287, caption: '客户换平台时，还要考虑适配、调试和稳定运行。'},
  {at: 299, caption: '从单卡到集群，软件和交付都会拉开差距。'},
  {at: 311, caption: '把芯片和软件放在一起看，才知道追赶要跨过哪些门槛。'},
 ]},
 {name: '什么时候能追上', beats: [
  {at: 323, caption: '要回答什么时候追上，得先说清楚比什么。'},
  {at: 333, caption: '先看部分 AI 推理：换一套硬件，同一个模型还能稳跑吗？'},
  {at: 343, caption: '先在一些场景跑稳，就有机会率先对标 AMD。'},
  {at: 355, caption: '要接近英伟达的平台，还得看集群交付和软件迁移。'},
  {at: 366, caption: '这些环节能在更多场景一起跑通，平台差距才会缩小。'},
  {at: 377, caption: '进度看两件事：有多少应用能迁过去，又能稳定跑多久。'},
  {at: 386, caption: '沿着这些门槛往回看，中国已经接起了哪些环节？'},
 ]},
 {name: '中国正在接起自己的网络', beats: [
  {at: 393, caption: '从设计、制造到封测和软件，国内已经有能指到地图上的例子。'},
  {at: 402, caption: '先看设计。北京的寒武纪，有自己的 AI 芯片产品。'},
  {at: 412, caption: '往下看，中芯国际在上海设有晶圆厂。'},
  {at: 422, caption: '到封装与测试，长电科技在江苏江阴有生产基地。'},
  {at: 432, caption: '软件这一侧，华为昇腾用 CANN 接起工具和应用。'},
  {at: 441, caption: '华为年报披露，搭载 384 颗加速芯片的超节点已经在多个行业部署。'},
  {at: 448, caption: '从设计到软件，从单颗芯片到一整套系统，进步已经看得见。'},
 ]},
 {name: '从可用到好用', beats: [
  {at: finaleStart, caption: '从一颗芯片，到一套真正能部署的系统。这一步，已经迈出去了。'},
  {at: 459, caption: '英伟达靠高端 AI GPU 和 CUDA 生态领跑，AMD 用 CPU 和 GPU 双线追赶。'},
  {at: 467, caption: '先进制程、高速内存和软件栈还有差距。国内需求给了工程团队持续迭代的机会。'},
  {at: 475, caption: '先把成熟工艺做深，让国产算力在推理和行业场景跑稳，接上主流框架。'},
  {at: 484, caption: '再用芯粒和先进封装把系统做强，继续攻关自研高带宽内存。'},
  {at: 493, caption: '往前走，还得突破先进制程，把自研工具做得好用，也让更多伙伴用得上。'},
  {at: 501, caption: '从跑得起来，到跑得稳、用得顺。有些领域，已经有机会率先跑到前面。'},
 ]},
];

const ink = '#f3f5f5';
const muted = '#a7b4c0';
const amber = '#ffb370';
const cyan = '#76d6dd';
const jade = '#beec82';
const rice = '#ffe1ba';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const rise = (t: number, at: number, duration = .8) => interpolate(t, [at, at + duration], [0, 1], clamp);

function SupplyLine({t, at, d, color}: {t: number; at: number; d: string; color: string}) {
 const progress = rise(t, at, 2);
 const pulse = ((Math.max(0, t - at - 2) % 4) / 4);
 return <g opacity={progress}>
  <path d={d} fill="none" pathLength="1" stroke={color} strokeWidth="3" strokeOpacity=".65" strokeDasharray={`${progress} 1`}/>
  <path d={d} fill="none" pathLength="1" stroke={color} strokeWidth="5" strokeLinecap="round" strokeDasharray=".035 1" strokeDashoffset={-pulse} opacity={rise(t, at + 2)} filter="url(#amd-glow)"/>
 </g>;
}

type SupplyBadgeKind = 'package' | 'eda' | 'lithography';

function SupplyBadge({kind, color}: {kind: SupplyBadgeKind; color: string}) {
 const marks = {
  package: <>
   <path d="M10 30 L31 17 L52 30 L31 43 Z M10 30 V36 L31 49 L52 36 V30 M31 43 V49" fill="#1b3029"/>
   <path d="M10 24 L31 11 L52 24 L31 37 Z" fill="#253c32"/>
   <path d="M22 24 L31 18 L40 24 L31 30 Z" fill={color} fillOpacity=".3"/>
  </>,
  eda: <>
   <rect x="10" y="14" width="42" height="32" rx="4" fill="#26303b"/>
   <path d="M10 22 H52 M17 36 H26 V29 H34 V39 H44 M29 47 V51 M23 51 H39"/>
   <circle cx="18" cy="18" r="1" fill={color} stroke="none"/>
  </>,
  lithography: <>
   <rect x="12" y="14" width="38" height="31" rx="4" fill="#162a35"/>
   <path d="M25 14 V24 H37 V14 M31 25 V33 M22 34 H40 M18 45 V51 M44 45 V51"/>
   <path d="M18 39 H44" opacity=".6"/>
  </>,
 };
 return <g stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" fill="none">
  <rect x="0" y="0" width="62" height="58" rx="11" fill={color} fillOpacity=".07" strokeOpacity=".28"/>
  {marks[kind]}
 </g>;
}

function WorldMap({t}: {t: number}) {
 const sites = [
  {name: 'AMD', detail: '圣克拉拉 · 芯片设计', logo: 'amd', x: 411, y: 445, cardX: 238, cardY: 519, guide: 'M411 445 V485 L385 519', color: amber, at: 11.5},
  {name: '台积电', detail: '新竹 · 晶圆制造', logo: 'tsmc', x: 1505, y: 497, cardX: 1440, cardY: 563, guide: 'M1505 497 V532 L1531 563', color: cyan, at: 22},
  {name: 'ASML · 荷兰', detail: '费尔德霍芬 · 光刻设备', logo: 'asml', x: 984, y: 387, cardX: 888, cardY: 237, guide: 'M984 387 V342 L1005 318', color: jade, at: 69},
 ];
 const stages = [
  {x: 238, y: 660, width: 285, at: 40, title: 'EDA 设计软件', detail: '硅谷 · 新思、楷登', detailAt: 49, color: amber, badge: 'eda'},
  {x: 1432, y: 695, width: 324, at: 80, title: '封装与测试', detail: '基地举例 · 苏州、槟城', detailAt: 80, color: jade, badge: 'package'},
 ] as const;
 return <g>
  <defs>
   <clipPath id="amd-world-extent"><rect x="104" y="190" width="1712" height="658" rx="19"/></clipPath>
   <radialGradient id="amd-world-sea"><stop stopColor="#152830"/><stop offset="1" stopColor="#0a131c"/></radialGradient>
  </defs>
  <rect x="104" y="190" width="1712" height="658" rx="19" fill="url(#amd-world-sea)" stroke="#29424e"/>
  <g clipPath="url(#amd-world-extent)">
   <image href={staticFile('amd-map/world-land.svg')} width="1920" height="1080" opacity=".88"/>
   <rect x="104" y="190" width="1712" height="658" fill="url(#amd-grid)" opacity=".24"/>
  </g>
  <SupplyLine t={t} at={22} d="M411 445 Q930 170 1505 497" color="#9cdde9"/>
  <SupplyLine t={t} at={69.5} d="M984 387 Q1262 329 1505 497" color="#b8e5aa"/>
  <SupplyLine t={t} at={40} d="M368 660 V600" color={amber}/>
  <g opacity={rise(t, 80)}>
   {/* ATMP joint-venture sites, projected in the same coordinates as the land SVG. */}
   <path d="M1502 470 H1746 L1780 504 V731 H1756 M1412 578 V669 L1438 695" fill="none" stroke={jade} strokeWidth="1.5" strokeOpacity=".55" strokeDasharray="4 6"/>
   <circle cx="1502" cy="470" r="5" fill={jade} filter="url(#amd-glow)"/>
   <circle cx="1412" cy="578" r="5" fill={jade} filter="url(#amd-glow)"/>
  </g>
  {sites.map(({name, detail, logo, x, y, cardX, cardY, guide, color, at}) => <g key={logo} opacity={rise(t, at)}>
   <path d={guide} fill="none" stroke={color} strokeWidth="1.4" strokeOpacity=".68"/>
   <circle cx={x} cy={y} r="15" stroke={color} strokeOpacity=".62" fill="#0f1c25"/>
   <circle cx={x} cy={y} r="5" fill={color} filter="url(#amd-glow)"/>
   <g transform={`translate(${cardX} ${cardY})`}>
    <rect width="285" height="81" rx="11" fill="#111c26" stroke={color} strokeOpacity=".45"/>
    <rect x="12" y="13" width="61" height="52" rx="6" fill="#e8eded"/>
    {logo === 'amd' ? <path d="M0 0H100V100L75 75V25H25ZM25 25 0 50V100H50L75 75H25Z" transform="translate(29 25) scale(.27)" fill="#00952d"/> :
     <image href={staticFile(`amd-map/logo-${logo}.png`)} x="17" y="22" width="51" height="34"/>}
    <text x="86" y="35" fill={ink} fontSize="26" fontWeight="750">{name}</text>
    <text x="86" y="61" fill={muted} fontSize="20">{detail}</text>
   </g>
  </g>)}
  {stages.map(({x, y, width, at, title, detail, detailAt, color, badge}) => <g key={badge} transform={`translate(${x} ${y})`} opacity={rise(t, at)}>
   <rect width={width} height="81" rx="11" fill="#111c26" stroke={color} strokeOpacity=".45"/>
   <g transform="translate(10 14) scale(.88)"><SupplyBadge kind={badge} color={color}/></g>
   <text x="74" y="34" fill={ink} fontSize="24" fontWeight="700">{title}</text>
   <text x="74" y="61" fill={muted} fontSize="20" opacity={rise(t, detailAt)}>{detail}</text>
  </g>)}
  <g opacity={rise(t, 59) * (1 - rise(t, 69))}>{/* Introduce the tool before its supplier. */}
   <rect x="888" y="237" width="285" height="81" rx="11" fill="#111c26" stroke={jade} strokeOpacity=".45"/>
   <g transform="translate(898 251) scale(.88)"><SupplyBadge kind="lithography" color={jade}/></g>
   <text x="962" y="285" fill={ink} fontSize="25" fontWeight="700">光刻设备</text>
  </g>
  <text x="1788" y="830" textAnchor="end" fill={muted} fontSize="16">厂商位置与产业关系示意</text>
 </g>;
}

function SupplyChain({t}: {t: number}) {
 const reveal = rise(t, 11.5, 1.2);
 if (reveal === 1) {
  return <WorldMap t={t}/>;
 }

 const chipEntrance = rise(t, 5.8, 1.3);
 return <>
  <g opacity={chipEntrance * (1 - reveal)} transform={`translate(960 ${515 - 18 * reveal}) scale(${1 + .10 * rise(t, 0, 11)})`}>
   <ellipse cy="173" rx="338" ry="50" fill="#04070c" opacity=".6"/>
   <g transform="rotate(-12) scale(1 .76)">
    <rect x="-226" y="-219" width="452" height="452" rx="32" fill="#080d13" stroke="#2e4857" strokeWidth="3"/>
    <rect x="-226" y="-238" width="452" height="452" rx="32" fill="url(#amd-metal)" stroke="#526776" strokeWidth="2"/>
    <rect x="-204" y="-216" width="408" height="408" rx="23" fill="url(#amd-grid)" stroke={amber} strokeOpacity=".42"/>
    {Array.from({length: 13}, (_, i) => <g key={i} stroke="#9c7559" strokeWidth="2" opacity=".62">
     <path d={`M${i * 28 - 168} -207 v40 m0 306 v40 M-194 ${i * 28 - 180} h36 m316 0 h36`}/>
    </g>)}
    <rect x="-132" y="-137" width="264" height="250" rx="20" fill="#0d1720" stroke="#607585"/>
    <path d="M-108 -112 H108 M-108 88 H108" stroke="#395361"/>
    <text y="13" textAnchor="middle" fill={ink} fontSize="68" fontWeight="800" letterSpacing="5">AMD</text>
    <circle cx="-194" cy="-207" r="4" fill={amber}/>
   </g>
  </g>
  {reveal > 0 && <g opacity={reveal}><WorldMap t={t}/></g>}
 </>;
}

function ChinaNetwork({t}: {t: number}) {
 const age = Math.max(0, t - 393);
 const sweepX = 135 + (age * 290) % 1100 - 220;
 const systemLift = rise(t, 448, 1.7);
 const sites = [
  {city: '北京', name: '寒武纪', role: 'AI 芯片设计', image: 'chip-package', x: 699, y: 455, cardY: 245, guide: 'M699 455 L784 285 H1124', at: 402, color: amber},
  {city: '上海', name: '中芯国际', role: '晶圆制造基地', image: 'chip-wafer', x: 777, y: 591, cardY: 358, guide: 'M777 591 L906 398 H1124', at: 412, color: cyan},
  {city: '江阴', name: '长电科技', role: '封装与测试基地', image: 'chip-package', x: 759, y: 577, cardY: 471, guide: 'M759 577 L855 511 H1124', at: 422, color: cyan},
  {city: '深圳', name: '华为昇腾', role: 'CANN 软件与系统方案', image: 'wordmark-ascend', x: 682, y: 740, cardY: 584, guide: 'M682 740 L838 624 H1124', at: 432, color: jade},
 ];
 return <g>
  <defs>
   <filter id="amd-china-blue" colorInterpolationFilters="sRGB">
    <feColorMatrix type="matrix" values="-.11 -.21 -.04 0 .41  -.15 -.29 -.06 0 .61  -.14 -.28 -.06 0 .64  0 0 0 1 0"/>
   </filter>
   <radialGradient id="amd-china-sea"><stop stopColor="#152830"/><stop offset="1" stopColor="#0a131c"/></radialGradient>
   <mask id="amd-china-outline" maskUnits="userSpaceOnUse" x="135" y="203" width="876" height="622" style={{maskType: 'alpha'}}>
    <image href={staticFile('amd-map/china-outline-glow.png')} x="135" y="203" width="876" height="622"/>
   </mask>
   <linearGradient id="amd-china-gold">
    <stop stopColor="#df9f43" stopOpacity="0"/>
    <stop offset=".33" stopColor="#ffbe52" stopOpacity=".75"/>
    <stop offset=".53" stopColor="#fff0b0"/>
    <stop offset=".72" stopColor="#ffbe52" stopOpacity=".60"/>
    <stop offset="1" stopColor="#df9f43" stopOpacity="0"/>
   </linearGradient>
   <linearGradient id="amd-china-card-shine" x1="0%" y1="100%" x2="100%" y2="0%">
    <stop stopColor="#ffe6a6" stopOpacity="0"/>
    <stop offset=".5" stopColor="#ffe6a6" stopOpacity=".36"/>
    <stop offset="1" stopColor="#ffe6a6" stopOpacity="0"/>
   </linearGradient>
  </defs>
  <rect x="104" y="190" width="1712" height="658" rx="19" fill="url(#amd-china-sea)" stroke="#29424e"/>
  <image href={staticFile('amd-map/china-standard-GS2023-2767.jpg')} x="135" y="203" width="876" height="622" filter="url(#amd-china-blue)" opacity=".88"/>
  <g mask="url(#amd-china-outline)">
   <rect x="135" y="203" width="876" height="622" fill="#ddaa55" opacity={.27 + .18 * systemLift}/>
   <rect x={sweepX} y="203" width="220" height="622" fill="url(#amd-china-gold)"/>
  </g>
  <path d="M1094 242 V684" stroke="#334a58" strokeOpacity=".55"/>
  <g opacity={systemLift}>
   <SupplyLine t={t} at={448} d="M1770 289 V717 Q1770 746 1744 746" color="#ffe2a0"/>
   {sites.map(({city, cardY}, index) => <SupplyLine key={city} t={t} at={448 + index * .36} d={`M1744 ${cardY + 44} H1770`} color="#ffe2a0"/>)}
  </g>
  {sites.map(({city, name, role, image, x, y, cardY, guide, at, color}, index) => {
   const active = rise(t, at);
   const elapsed = Math.max(0, t - at);
   const travel = age * .69 + age * age * .006;
   const phase = (travel + index * .22) % 1;
   const ripple = (elapsed * .91 + index * .18) % 1;
   const shine = (travel * .36 + index * .29) % 1;
   const shineClip = `amd-china-card-clip-${index}`;
   return <g key={city}>
    <path d={guide} fill="none" stroke={color} strokeWidth="1.6" strokeDasharray="5 7" opacity={active * .56}/>
    <path d={guide} pathLength="1" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeDasharray=".06 .27" strokeDashoffset={-phase} opacity={active * .84} filter="url(#amd-glow)"/>
    <path d={guide} pathLength="1" fill="none" stroke="#ffe4a7" strokeWidth="2" strokeLinecap="round" strokeDasharray=".025 .475" strokeDashoffset={phase} opacity={active * .8}/>
    <circle cx={x} cy={y} r={10 + 13 * ripple} fill="none" stroke={color} strokeWidth="1.5" opacity={active * (1 - ripple) * .64}/>
    <circle cx={x} cy={y} r="9" fill="#10202b" stroke={color} opacity={active}/>
    <circle cx={x} cy={y} r="4" fill={color} opacity={active} filter="url(#amd-glow)"/>
    <g transform={`translate(1124 ${cardY})`} opacity={.55 + .45 * active}>
     <defs><clipPath id={shineClip}><rect width="620" height="88" rx="12"/></clipPath></defs>
     <rect width="620" height="88" rx="12" fill="#111c26" stroke={color} strokeOpacity={.2 + .35 * active}/>
     <g clipPath={`url(#${shineClip})`} opacity={active * .54}>
      <rect x={-180 + 810 * shine} width="170" height="88" fill="url(#amd-china-card-shine)"/>
     </g>
     <path d="M12 14 Q12 6 22 6 H132" fill="none" stroke="#ffe0a1" strokeWidth="1.3" strokeOpacity={active * (.25 + .30 * (1 - ripple))}/>
     <rect x="14" y="13" width="76" height="62" rx="8" fill="#192935" stroke={color} strokeOpacity=".28"/>
     <image href={staticFile(`amd-map/${image}.png`)} x="20" y="17" width="64" height="54" opacity={active}/>
     <text x="108" y="54" fill={ink} fontSize="28" fontWeight="700">{role}</text>
     <text x="592" y="53" textAnchor="end" fill={color} fontSize="24" opacity={active}>{city} · {name}</text>
    </g>
   </g>;
  })}
  <g opacity={rise(t, 441)}>
   <rect x="1124" y="703" width="620" height="90" rx="12" fill="#17232b" stroke="#ffe2a0" strokeOpacity={.18 + .48 * systemLift}/>
   <image href={staticFile('amd-map/chip-rack.png')} x="1138" y="715" width="66" height="66"/>
   <text x="1220" y="756" fill={jade} fontSize="42" fontWeight="750">384</text>
   <text x="1320" y="752" fill={ink} fontSize="23">颗加速芯片／超节点</text>
   <text x="1725" y="752" textAnchor="end" fill={muted} fontSize="17">华为 2025 年报</text>
  </g>
  <text x="136" y="838" fill={muted} fontSize="14">底图 · 自然资源部标准地图 GS(2023)2767号</text>
  <text x="1744" y="816" textAnchor="end" fill={muted} fontSize="17">境内产业环节与系统协同示意</text>
 </g>;
}

function Finale({t}: {t: number}) {
 const entrance = rise(t, finaleStart, 1.15);
 const impact = rise(t, finaleStart, .12) * (1 - rise(t, finaleStart + .15, .75));
 const comparison = [
  {title: '英伟达', detail: 'AI GPU · CUDA', note: '硬件和生态同时领跑', color: jade, at: 459},
  {title: 'AMD', detail: 'CPU · GPU', note: '两条产品线并行追赶', color: amber, at: 460},
  {title: '国产芯片', detail: '制程 · HBM · 软件栈', note: '差距正在一个个环节补齐', color: cyan, at: 467},
 ];
 const milestones = [
  {title: '把成熟工艺做深', note: '推理落地 · 兼容框架', at: 475, color: amber},
  {title: '把系统做强', note: '芯粒封装 · 高速内存', at: 484, color: cyan},
  {title: '让生态更好用', note: '先进制程 · 自主软件 · 开放合作', at: 493, color: jade},
 ];
 return <g>
  <defs>
   <linearGradient id="amd-finale-bay" x2="1" y2="1"><stop stopColor="#0d1d29"/><stop offset=".67" stopColor="#16242b"/><stop offset="1" stopColor="#463321"/></linearGradient>
   <radialGradient id="amd-finale-light"><stop stopColor="#ffc972" stopOpacity=".44"/><stop offset="1" stopColor="#ffc972" stopOpacity="0"/></radialGradient>
  </defs>
  <rect x="104" y="190" width="1712" height="658" rx="19" fill="url(#amd-finale-bay)" stroke="#594632"/>
  <rect x="104" y="190" width="1712" height="658" rx="19" fill="url(#amd-grid)" opacity=".36"/>
  <ellipse cx="1340" cy="543" rx="430" ry="280" fill="url(#amd-finale-light)" opacity={.58 + .37 * impact}/>
  {t < 459 && <g>
   <text x="183" y="368" fill={amber} fontSize="27" fontWeight="700" letterSpacing="3">从芯片到系统</text>
   <text x="168" y="584" fill="#fff0cc" fontSize={208 + 11 * (1 - entrance)} fontWeight="760" letterSpacing="-12" opacity={.74 + .26 * entrance}>384</text>
   <text x="183" y="650" fill={ink} fontSize="32">颗加速芯片／超节点</text>
   <text x="185" y="696" fill={muted} fontSize="21">已在多个行业部署 · 华为 2025 年报</text>
   <path d="M823 709 H1700 M946 745 H1648 M1020 781 H1570" stroke="#fbb766" strokeWidth="1.5" strokeOpacity=".27"/>
   {Array.from({length: 5}, (_, i) => {
    const x = 871 + i * 156 + 42 * (1 - entrance);
    const y = 321 + Math.abs(i - 2) * 36;
    const ready = rise(t, finaleStart + .08 * i, .6);
    return <g key={i} transform={`translate(${x} ${y})`} opacity={.55 + .45 * ready}>
     <path d="M0 16 L38 0 H145 L110 16 Z M110 16 L145 0 V326 L110 360 Z" fill="#26353e" stroke="#c28c53" strokeWidth="2"/>
     <rect y="16" width="110" height="344" rx="5" fill="#111b23" stroke="#ffd18e" strokeWidth={1.6 + 2 * impact}/>
     {Array.from({length: 9}, (_, row) => <g key={row} opacity={.26 + .74 * rise(t, finaleStart + .08 * i + .045 * row, .29)}>
      <rect x="10" y={31 + 34 * row} width="90" height="23" rx="4" fill="#22323b" stroke="#95724e"/>
      <path d={`M22 ${42 + 34 * row} H69`} stroke="#efc081" strokeOpacity=".5"/>
      <circle cx="85" cy={42 + 34 * row} r="3" fill={row % 3 === 0 ? cyan : '#ffcf8e'}/>
     </g>)}
    </g>;
   })}
   <path d="M780 708 H1749" stroke="#ffd89c" strokeWidth="5" opacity={impact} filter="url(#amd-glow)"/>
   <text x="1740" y="818" textAnchor="end" fill={muted} fontSize="17">机柜示意</text>
  </g>}
  {t >= 459 && t < 475 && comparison.map(({title, detail, note, at, color}, index) => <g key={title} transform={`translate(${152 + index * 555} 330)`} opacity={rise(t, at, .7)}>
   <rect width="494" height="310" rx="16" fill="#101e28" stroke={color} strokeOpacity=".65"/>
   <path d="M26 1 H154" stroke={color} strokeWidth="4"/>
   <text x="35" y="82" fill={color} fontSize="43" fontWeight="750">{title}</text>
   <text x="35" y="158" fill={ink} fontSize="31">{detail}</text>
   <path d="M35 199 H458" stroke="#435560"/>
   <text x="35" y="251" fill={muted} fontSize="26">{note}</text>
  </g>)}
  {t >= 475 && <g>
   <text x="178" y="268" fill={muted} fontSize="25">追赶的下一步</text>
   <SupplyLine t={t} at={484} d="M615 498 H708" color={cyan}/>
   <SupplyLine t={t} at={493} d="M1172 498 H1265" color={jade}/>
   {milestones.map(({title, note, at, color}, index) => <g key={title} transform={`translate(${151 + 557 * index} 386)`} opacity={rise(t, at, .85)}>
    <rect width="464" height="224" rx="15" fill="#111f28" stroke={color} strokeOpacity=".62"/>
    <path d="M28 1 H174" stroke={color} strokeWidth="4"/>
    <text x="33" y="92" fill={ink} fontSize="36" fontWeight="740">{title}</text>
    <text x="33" y="160" fill={color} fontSize="25">{note}</text>
   </g>)}
   <text x="960" y="741" textAnchor="middle" fill="#ffe1a7" fontSize="39" fontWeight="700" opacity={rise(t, 501, 1.3)}>跑起来 · 跑得稳 · 用得顺</text>
  </g>}
 </g>;
}

function Chip({t}: {t: number}) {
 const split = rise(t, 119, 1.8);
 const joined = rise(t, 163, 2.7);
 const gap = split * (1 - joined * .62);
 const roleFocus = rise(t, 130) * (1 - rise(t, 141));
 const processFocus = rise(t, 141) * (1 - rise(t, 152));
 return <g transform="translate(960 500)">
  <rect x="-460" y="-260" width="920" height="520" rx="44" fill="#101921" stroke="#354856" strokeWidth="2"/>
  <rect x="-422" y="-221" width="844" height="442" rx="20" fill="url(#amd-grid)" stroke="#263845"/>
  <rect x="-284" y="-153" width="568" height="306" rx="16" fill="#2b433f" stroke={cyan} strokeWidth="2" opacity={1 - split}/>
  <text textAnchor="middle" y="14" fontSize="41" fill={ink} opacity={1 - split}>单片设计</text>
  {[-1, 0, 1].map((i) => <g key={i} opacity={split} transform={`translate(${i * (174 + 56 * gap)} ${Math.abs(i) * 36 * gap})`}>
   <rect x="-80" y="-122" width="160" height="244" rx="10" fill={i === 0 ? '#49352f' : '#17383b'} stroke={i === 0 ? amber : cyan} strokeWidth={2 + 3 * roleFocus}/>
   <rect x="-60" y="-100" width="120" height="144" fill="url(#amd-grid)"/>
   <text y="96" textAnchor="middle" fill={ink} fontSize="27">{i === 0 ? '连接' : '计算'}</text>
   <text y="-24" textAnchor="middle" fill={ink} fontSize="21" opacity={roleFocus}>{i === 0 ? '交换数据' : '处理数据'}</text>
   <text y="-24" textAnchor="middle" fill={ink} fontSize="20" opacity={processFocus}>{i === 0 ? '连接工艺' : '计算工艺'}</text>
  </g>)}
  <text y="-158" textAnchor="middle" fill={cyan} fontSize="30" fontWeight="700" opacity={rise(t, 152)}>Chiplet · 芯粒</text>
  <path d="M-125 0 H125" stroke={jade} strokeWidth="3" strokeDasharray="8 12" opacity={joined}/>
  <text y="327" textAnchor="middle" fill={muted} fontSize="24">功能关系示意</text>
 </g>;
}

const products = [
 {label: 'Ryzen', detail: '个人电脑', image: 'product-ryzen', at: 184},
 {label: 'EPYC', detail: '服务器', image: 'product-epyc', at: 195},
 {label: 'Instinct', detail: 'AI 加速', image: 'product-mi300x', at: 207},
];

function Products({t}: {t: number}) {
 const focus = products.reduce((active, product, i) => t >= product.at ? i : active, -1);
 const rack = rise(t, 242);
 return <>
  {products.map(({label, detail, image, at}, i) => <g key={label} transform={`translate(${408 + 552 * i} ${472 - 22 * rack})`} opacity={(focus === -1 || focus === i ? 1 : .52) * rise(t, 175 + .24 * i)}>
   <rect x="-207" y="-176" width="414" height="352" rx="22" fill="#101923" stroke={i === 2 ? amber : cyan} strokeOpacity={focus === i ? .9 : .45}/>
   <rect x="-75" y="-124" width="150" height="123" rx="12" fill="url(#amd-grid)" stroke={i === 2 ? amber : cyan}/>
   <image href={staticFile(`amd-map/${image}.png`)} x="-75" y="-124" width="150" height="123" opacity={.4 + .6 * rise(t, at)}/>
   <text textAnchor="middle" y="69" fill={ink} fontSize="49" fontWeight="700">{label}</text>
   <text textAnchor="middle" y="123" fill={muted} fontSize="26">{detail}</text>
  </g>)}
  <g opacity={rise(t, 219) * (1 - rack)}>
   <text x="1512" y="704" textAnchor="middle" fill={rice} fontSize="29">MI300X · 192 GB HBM3</text>
   <SupplyLine t={t} at={231} d="M1468 744 H1556" color={amber}/>
   <text x="1453" y="752" textAnchor="end" fill={muted} fontSize="22" opacity={rise(t, 231)}>计算单元</text>
   <text x="1571" y="752" fill={muted} fontSize="22" opacity={rise(t, 231)}>高带宽内存</text>
  </g>
  <g opacity={rack}>
   <SupplyLine t={t} at={242} d="M960 626 V659 Q960 682 990 682 H1200 M1512 626 V659 Q1512 682 1482 682 H1330" color={cyan}/>
   <image href={staticFile('amd-map/chip-rack.png')} x="1230" y="646" width="68" height="68"/>
   <text x="1264" y="757" textAnchor="middle" fill={ink} fontSize="25">服务器 · 加速卡 · 网络</text>
  </g>
 </>;
}

function Platforms({t}: {t: number}) {
 const platforms = [
  {brand: 'AMD', software: 'ROCm', color: amber, x: -460, at: 263, logo: 'rocm'},
  {brand: 'NVIDIA', software: 'CUDA', color: jade, x: 460, at: 275, logo: 'nvidia'},
 ];
 return <g transform="translate(960 505)">
  <g opacity={rise(t, 253)}>
   <text y="-241" textAnchor="middle" fill={ink} fontSize="32" fontWeight="700">同一个模型</text>
   <path d="M-74 -231 H-142 L-190 -201 M74 -231 H142 L190 -201" fill="none" stroke={cyan} strokeOpacity=".45" strokeWidth="2"/>
  </g>
  {platforms.map(({brand, software, color, x, at, logo}) =>
   <g key={brand} transform={`translate(${x} 0)`} opacity={rise(t, at)}>
    <rect x="-320" y="-203" width="640" height="406" rx="26" fill="#111923" stroke={color} strokeOpacity=".55"/>
    <rect x="181" y="-176" width="110" height="64" rx="9" fill="#edf1f2"/>
    <image href={staticFile(`amd-map/logo-${logo}.png`)} x="193" y="-170" width="86" height="52"/>
    <text textAnchor="middle" y="-110" fill={muted} fontSize="30">{brand}</text>
    <text textAnchor="middle" y="-22" fill={color} fontSize="72" fontWeight="700">{software}</text>
    {software === 'ROCm' ? <g transform="translate(-203 12)">
     <rect width="406" height="114" rx="10" fill="#0c1520" stroke="#425565"/>
     <text x="17" y="29" fill={muted} fontSize="17">AMD SMI · 官方文档示例</text>
     <g fontFamily="Menlo, monospace" fontSize="23">
      <text x="17" y="61" fill={amber}>$ amd-smi list</text>
      <text x="17" y="93" fill={ink}>GPU: 0     GPU: 1</text>
     </g>
    </g> : <g transform="translate(-203 12)">
     <rect width="406" height="114" rx="10" fill="#0c1520" stroke="#425565"/>
     <image href={staticFile('amd-map/logo-cuda.png')} x="140" y="11" width="126" height="92"/>
    </g>}
    <text textAnchor="middle" y="170" fill={ink} fontSize="27" opacity={1 - rise(t, 287)}>框架 · 工具 · 部署</text>
    <text textAnchor="middle" y="170" fill={ink} fontSize="27" opacity={rise(t, 287)}>适配、调试、验证</text>
   </g>)}
  <SupplyLine t={t} at={299} d="M-460 204 V230 Q-460 250 -430 250 H430 Q460 250 460 230 V204" color={cyan}/>
  <text textAnchor="middle" y="302" fill={jade} fontSize="28" opacity={rise(t, 299) * (1 - rise(t, 311))}>从单卡到集群</text>
  <text textAnchor="middle" y="302" fill={jade} fontSize="28" opacity={rise(t, 311)}>下一步 · 看中国的产业网络</text>
 </g>;
}

function Outlook({t}: {t: number}) {
 const comparisons = [
  {x: 163, at: 333, conclusionAt: 343, color: amber, brand: 'AMD', scope: '部分推理场景',
   question: '同一个模型能不能稳跑？', checks: ['模型兼容', '延迟与成本', '稳定运行'], conclusion: '部分场景有望先接近'},
  {x: 990, at: 355, conclusionAt: 366, color: jade, brand: '英伟达', scope: '完整计算平台',
   question: '整套系统能不能交付？', checks: ['集群部署', '软件迁移', '持续运维'], conclusion: '取决于软硬件协同成熟度'},
 ];
 return <>
  <text x="163" y="294" fill={muted} fontSize="26">追赶进度 · 看这两道门槛</text>
  {comparisons.map(({x, at, conclusionAt, color, brand, scope, question, checks, conclusion}) => <g key={brand} transform={`translate(${x} 339)`} opacity={rise(t, at)}>
   <rect width="767" height="397" rx="20" fill="#101a24" stroke={color} strokeOpacity=".44"/>
   <path d="M29 0 H737" stroke={color} strokeOpacity=".65" strokeWidth="3"/>
   <text x="34" y="67" fill={color} fontSize="32" fontWeight="750">{brand}</text>
   <text x="729" y="67" textAnchor="end" fill={muted} fontSize="26">{scope}</text>
   <text x="34" y="149" fill={ink} fontSize="43" fontWeight="680">{question}</text>
   {checks.map((check, i) => <g key={check} transform={`translate(${34 + 237 * i} 191)`} opacity={rise(t, at + .3 + i * .36)}>
    <rect width="224" height="64" rx="10" fill="#172633" stroke="#334856"/>
    <circle cx="20" cy="32" r="4" fill={color}/>
    <text x="38" y="41" fill={ink} fontSize="25">{check}</text>
   </g>)}
   <path d="M34 292 H731" stroke="#334856"/>
   <g opacity={rise(t, conclusionAt)}>
    <text x="34" y="347" fill={muted} fontSize="23">怎么看</text>
    <text x="729" y="351" textAnchor="end" fill={color} fontSize="36" fontWeight="680">{conclusion}</text>
   </g>
  </g>)}
 </>;
}

export function AmdChipNetwork() {
 const frame = useCurrentFrame();
 const {fps} = useVideoConfig();
 const t = frame * amdPlaybackRate / fps;
 const campusOpacity = 1 - rise(t, 5.8, 1.3);
 const chapter = chapters.reduce((active, {beats}, index) => t >= beats[0].at ? index : active, 0);
 const {name, beats} = chapters[chapter];
 const beat = beats.reduce((active, candidate) => t >= candidate.at ? candidate : active, beats[0]);
 const visuals = [
  <SupplyChain t={t}/>,
  <SupplyChain t={t}/>,
  <Chip t={t}/>,
  <Products t={t}/>,
  <Platforms t={t}/>,
  <Outlook t={t}/>,
  <ChinaNetwork t={t}/>,
  <Finale t={t}/>,
 ];
 return <AbsoluteFill style={{backgroundColor: '#090e14'}}>
  <Audio src={staticFile('amd-chip-network-score-clear.mp3')} volume={.9 * (1 - rise(t, chinaMusicStart, 3.2))}/>
  <Sequence from={Math.round(chinaMusicStart * fps / amdPlaybackRate)} layout="none">
   <Audio src={staticFile('amd-china-lift.mp3') + '?v=finale'} volume={.88}/>
  </Sequence>
  {campusOpacity > 0 && <AbsoluteFill style={{opacity: campusOpacity, overflow: 'hidden'}}>
   <Img src={staticFile('amd-campus-opening.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', transformOrigin: '60% 56%', transform: `scale(${1 + .045 * rise(t, 0, 7.1)})`}}/>
   <AbsoluteFill style={{background: 'linear-gradient(90deg, #080e16d9, #080e1655 45%, #080e1600 68%), linear-gradient(180deg, #080e16aa 0%, #080e1600 38%, #080e1620 70%, #080e16e6 100%)'}}/>
  </AbsoluteFill>}
  <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{position: 'absolute', inset: 0}} fontFamily="PingFang SC, Microsoft YaHei, Noto Sans CJK SC, sans-serif">
   <defs>
    <pattern id="amd-grid" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.8" fill="#4b697a" opacity=".55"/></pattern>
    <radialGradient id="amd-background"><stop stopColor="#172936"/><stop offset="1" stopColor="#090e14"/></radialGradient>
    <linearGradient id="amd-metal" x2="1" y2="1"><stop stopColor="#334857"/><stop offset=".5" stopColor="#1c2c35"/><stop offset="1" stopColor="#101a23"/></linearGradient>
    <filter id="amd-glow"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
   </defs>
   <rect width="1920" height="1080" fill="url(#amd-background)" opacity={1 - campusOpacity}/>
   <rect x="104" y="190" width="1712" height="666" fill="url(#amd-grid)" opacity={.30 * (1 - campusOpacity)}/>
   <g opacity={1 - campusOpacity}>
    <path d="M104 173 H1816" stroke="#334752"/>
    <text x="104" y="91" fill={amber} fontSize="25" fontWeight="700">AMD · 全球芯片网络</text>
    <text x="104" y="151" fill={ink} fontSize="48" fontWeight="650">{name}</text>
   </g>
   <g opacity={chapter < 2 ? 1 : rise(t, beats[0].at, .6)}>{visuals[chapter]}</g>
   <g opacity={campusOpacity}>
    <rect x="340" y="257" width="1240" height="470" rx="24" fill="#080f19" fillOpacity=".87" stroke="#475461" strokeOpacity=".65"/>
    <path d="M628 344 H920" stroke={amber} strokeWidth="2" strokeOpacity=".72"/>
    <path d="M1000 344 H1292" stroke={jade} strokeWidth="2" strokeOpacity=".72"/>
    <circle cx="960" cy="344" r="5" fill="#fbd49c"/>
    <text x="960" y="482" textAnchor="middle" fill={ink} fontSize="81" fontWeight="750">AMD 怎么追英伟达？</text>
    <text x="960" y="617" textAnchor="middle" fill="#ffce88" fontSize="88" fontWeight="760">中国芯片又走到了哪一步？</text>
   </g>
   <text x="1816" y="853" textAnchor="end" fill={ink} fontSize="25" opacity={campusOpacity * .85}>半导体研发园区 · 示意画面</text>
   <rect x="0" y="890" width="1920" height="190" fill="#090e14" opacity=".92"/>
   <path d="M104 894 H1816" stroke="#334752"/>
   <text x="960" y="988" textAnchor="middle" fill={ink} fontSize="43" fontWeight="600" opacity={.55 + .45 * rise(t, beat.at, .24)}>{beat.caption}</text>
   <rect x="104" y="1048" width="1712" height="3" fill="#2b3944"/>
   <rect x="104" y="1048" width={1712 * t / amdSourceDuration} height="3" fill={amber}/>
  </svg>
 </AbsoluteFill>;
}
