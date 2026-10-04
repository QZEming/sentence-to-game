# 溪谷建筑师 · Beaver Creek

无需构建的 Three.js 3D 浏览器游戏，所有模型均为程序化几何体。

## 运行

在此目录运行 `python3 -m http.server 4173 --directory dist`，打开 `http://localhost:4173`。

## 玩法

- WASD / 方向键：移动；Shift：冲刺；点击地面：自动前往。
- E：附近互动；1–5：漫游、采集、搭桥、加固、修复。
- B：建最近路线的下一段；R：修复；F：护送下一只动物。
- 滚轮缩放、拖动画面旋转、V 俯视、Esc 暂停、H 手册。
- 手机提供方向键和互动按钮，工具也可直接点选。
- 每条桥有六段，每段消耗 2 木材；加固消耗 1 木材和 1 石材。
- 大型动物需要全桥加固。修复消耗 1 木材，桥断后动物会安全返回。
- 四关包含天气、水流、漂木、可再生资源、三类永久装备、评级和本地存档。
- Web Audio 合成互动音效，默认静音，可点击音符开启。

## 技术

`dist/index.html`、`dist/style.css` 和 `dist/game.js` 即完整应用。Three.js 随包保存于 `dist/vendor`（MIT 许可），不依赖运行时 CDN。Google 字体加载失败时自动回退到系统字体。

完成关卡、星星、橡果币和装备保存在当前浏览器 localStorage；不保存当前未完成关卡的中间状态。

诊断只读接口：`window.beaverGame.getState()`。浏览器支持 WebMCP 时另注册状态读取和工具选择两项能力。
