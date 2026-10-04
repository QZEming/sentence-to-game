# 牧野 · Meadowbound

三维牧羊策略游戏。原生 JavaScript + Three.js，无需构建、无服务端依赖。Three.js r170 随项目分发，保留文件中的 MIT 版权声明。

## 本地运行

在项目目录执行 `python3 -m http.server 4173 --directory dist`，打开 `http://localhost:4173`。ES Modules 需要 HTTP 服务，不能直接通过 file:// 打开。

## 操作

- WASD / 方向键：相对当前相机移动；点击草地：前往目标。
- Shift：冲刺；空格：吠叫；Q：安抚；E：在面朝方向放牧草。
- P / Escape：暂停；触屏有方向按钮和技能按钮。
- 三个关卡可自由切换。目标是全员归栏，时间与平均惊慌决定额外星星，超时不失败。
- 最佳星级与对应时间保存在本机 localStorage，切关卡会重置当前进度。

## 结构

- `dist/simulation.js`：固定步长群体行为、性格、碰撞、路径流场、技能和结算。
- `dist/world.js`：Three.js 场景、动物、相机与粒子反馈。
- `dist/main.js`：交互、声音、进度、界面及可选 WebMCP 工具。
- `dist/style.css`：响应式界面。

所有地形、动物和装饰均由 3D 几何体构成，不依赖远程图片。字体不可用时自动回退至系统字体。WebGL 是运行前提。

## 验证

`node tests/verify-completion.mjs` 使用实际站位移动、吠叫与安抚，自动验证三关全员归栏。最终版本三关通关耗时分别为 141.58、264.23、254.60 模拟秒，均为三星。另已验证暂停状态不变、技能资源上下界、围栏碰撞、门口批量归栏与事件不重复，浏览器桌面/390px 布局及 WebMCP 合法/非法输入。
