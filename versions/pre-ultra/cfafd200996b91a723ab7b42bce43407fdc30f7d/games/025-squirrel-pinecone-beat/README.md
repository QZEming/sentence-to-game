# 松果节拍 · Pinebeat

原生 ES module + 本地 Three.js 的 3D 节奏跑酷游戏。无构建步骤。

运行：`python3 -m http.server 8765 --directory dist`，打开 http://localhost:8765。

- 左右方向键：换道；空格 / 上方向键：节拍跳跃；下方向键：滑行。
- P / Esc：暂停。触屏按钮提供同样操作。
- 三种难度，90 秒旅程，三段森林景色与速度，40 松果目标。
- Perfect / Good 判定、连击倍率、8 连击护盾、磁铁、木桩与低树枝。
- Web Audio 原创循环旋律、合成打击乐；本机最高分；离开页面自动暂停。

静态文件保存在 dist，Three.js 随站点提供。Google 字体不可用时自动回退系统字体。
