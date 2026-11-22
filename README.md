# AMD 芯片供应链动画科普 | AMD Chip Supply Chain Explainer

一支使用 **Remotion** 制作的中文动画科普片，沿着 AMD 芯片的设计、EDA 软件、晶圆制造、光刻、Chiplet、先进封装、AI 加速器与软件生态，解释全球半导体供应链如何协作，并延伸到中国 AI 算力产业链案例。

**English:** An animated explainer built with Remotion about the AMD chip supply chain, semiconductor manufacturing, chiplets, AI accelerators, ROCm vs CUDA, and China's AI computing ecosystem.

## 项目内容

- `AmdChipNetwork`：16:9、1080p、30 fps 的长篇动画科普，涵盖 AMD 供应链、Chiplet、Ryzen / EPYC / Instinct、MI300X、ROCm 与 CUDA，以及中国芯片产业链案例。
- `AmdPrototype`：30 秒全球芯片产业网络动态图形原型。
- 画面包含供应链地图、芯片结构、产品卡片、平台对照、章节字幕和原创配乐。

地图上的地点与供应链关系用于动画示意，不能代替具体企业合同、产线分布或实时市场数据。

## 快速预览

需要 Node.js 20.19+、22.13+ 或 24+。

```bash
npm ci
npm run dev
```

在 Remotion Studio 中选择 `AmdChipNetwork` 或 `AmdPrototype`。

## 导出视频

```bash
npx remotion render AmdChipNetwork out/amd-chip-supply-chain.mp4 --codec=h264 --crf=17
```

## 配乐脚本

仓库包含用于本片的生成配乐脚本。重新生成音频需要在系统中安装 FFmpeg：

```bash
node scripts/amd-score.mjs
node scripts/amd-china-lift.mjs
```

## 关键词

AMD 芯片供应链、半导体产业链动画、芯粒 Chiplet、EDA 设计软件、台积电晶圆制造、ASML 光刻、MI300X、ROCm、CUDA、中国 AI 算力、Remotion 动画科普。

AMD、NVIDIA、TSMC、ASML 及其他企业名称和标志属于其各自权利人。本项目用于动画科普与识别；如需再分发媒体素材，请先确认相应使用许可。地图素材的来源与说明请以 `public/amd-map/` 中文件及其元数据为准。
