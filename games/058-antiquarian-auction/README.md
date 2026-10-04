# 拾珍阁 · The Patina Room

中文 3D 古董鉴宝、拍卖与商行经营游戏。原生 ES Modules + Three.js，所有核心依赖随站点分发，无需构建。

## 本地运行

```sh
python3 -m http.server 4187 --directory dist
```

打开 `http://localhost:4187`。浏览器需支持 WebGL；无 WebGL 时经营界面仍可运行。进度仅保存在当前浏览器的 localStorage，刷新时进行中的竞拍自动暂停。

## 玩法

- 14 天赛季，初始 ¥120,000，每天 3 件拍品、5 点行动。
- 8 种可旋转缩放的 3D 古董，包括瓷瓶、铜香炉、玉瓶、紫砂壶、铜镜、瓷碗与座钟。
- 三种线索可信度为 68%、82%、94%，按每件拍品的存档种子固定，不因刷新改变。
- 3 名预算有限、有不同收藏偏好的 AI 对手，竞价以 ¥500 为阶梯，成交收取 6% 佣金。
- 购后鉴定、修复、出售；4 类行情、7 类每日事件、4 类收藏委托、3 项升级、6 项成就。
- 赛季按现金和藏品真实净值结算，可重新开局。

鼠标/触屏拖动旋转；滚轮或 +/- 按钮缩放；聚焦 3D 展台后方向键控制视角。1/2/3 使用鉴宝工具，空格举牌，? 打开手册。

所有价格、文物身份与鉴定线索均为虚构游戏设定。

## 验证

```sh
node --check dist/app.js
node --check dist/scene.js
node --check dist/engine.mjs
node tests/engine.test.mjs
node tests/random-regression.mjs
```

经济边界和随机回归总计 1,000 个赛季：含佣精确资金、零资金通关、幂等结算、暂停恢复、跨日阻断、假货变现、成就持久性。真实浏览器验证覆盖渲染与主要交互。

## 文件

- `dist/engine.mjs`：可独立测试的经济模型、AI、存档状态与规则。
- `dist/scene.js`：Three.js 场景、程序化模型、材质、缩略图与交互。
- `dist/app.js`：中文 UI、事件、音效、存档与可选 WebMCP 注册。
- `dist/style.css`：桌面、手机与减少动态效果适配。

Three.js r170 依 MIT 许可分发，版权信息保留在源码头部。Google Fonts 为可选增强，网络不可用时使用系统字体。
