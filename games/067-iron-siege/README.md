# 铁火围城 · IRON SIEGE

可直接部署的 Three.js 3D 弹道攻城游戏。包含五关北境战役、四种弹药、可破坏城墙与支撑坍塌、火药桶连爆、敌军回合反击、三种永久升级、评分与本机存档。

## 本地运行

运行 `npm run dev`，打开 `http://127.0.0.1:4186/`。Python 3 用于静态文件服务，无需安装 npm 依赖。不能以 file:// 直接打开 ES module。

运行 `npm run check` 检查 JavaScript 语法、81 组弹道参数、连续碰撞和五关射程。

## 操作

- A / D：方向角；W / S：抛射角；↑ / ↓：力度；空格：发射。
- 1–4：石弹、爆裂弹、燃烧弹、散射弹。
- 拖动环视，滚轮缩放；C 切换战术视角；可开启弹丸跟随。
- Esc 暂停；手机直接拖动滑块并点击发射。
- 攻克堡垒后购买升级。金币和战役进度使用浏览器 localStorage，单次射击不保存。

## 实现

- `dist/game.js`：场景、破坏、粒子、敌军、战役、UI 与音效。
- `dist/physics.js`：共享弹道公式、线段碰撞、关卡与弹药配置。
- `dist/style.css`、`dist/index.html`：中文响应式控制面板。
- `dist/vendor/three.module.min.js`：本地 Three.js 0.169.0，许可证随附。
- `.openai/hosting.json`：私有 Site 静态发布配置。

浏览器需要 WebGL。字体优先使用 Google Fonts，网络不可达时回退到系统字体；3D 引擎与玩法代码全部随站点提供。坍塌使用支撑检测和碎片运动，而非完整刚体模拟。

## 验证

实际浏览器无控制台错误，检查了 1440×1000 与 390×844 布局。
使用实际游戏模块确定性模拟，五关均能在零升级状态下通关（3、3、4、5、5 发）。四种弹药均完成结算；重复发射不会重复扣弹；最后一发击毁核心优先判胜；最后燃烧弹耗尽后完成结算再判负；连续三次重试恢复完整状态。
`check-gameplay.browser.js` 为浏览器内验证函数；`run-browser-qa.py` 可在名为 iron-siege 的本地 Playwright CLI 会话中运行它。截图与结果位于被 Git 忽略的 `output/playwright/`。
