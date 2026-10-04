# 小小仓鼠，大大厨房 · Hamster Kitchen

一个完整的 Three.js 3D 推箱子游戏。小仓鼠栗栗在巨型厨房台面上，为早餐派对整理木箱。

## 本地运行

```sh
npm install
npm run dev
```

打开终端显示的 Local 地址。构建与验证：

```sh
npm test
npm run build
npm run preview
```

## 玩法

- 六个可自由选择的关卡，包含普通推箱、冰面滑行、压力按钮和栅栏。
- 木箱全部抵达橙色餐垫即可通关，木箱只能推、不能拉。
- 每关三颗葵花籽，全部收集获得额外一星；在目标步数内完成再获一星。
- 关卡与最佳成绩保存在浏览器 localStorage 中。
- 当前局面提示使用 Web Worker 中的 BFS 自动求解，不阻塞画面。
- 场景模型、纹理与音效均由代码生成，无远程美术资源或 API 依赖。

| 操作 | 按键 |
| --- | --- |
| 移动 / 推箱 | WASD 或方向键 |
| 撤销 | Z |
| 重开 | R |
| 求解提示 | H |
| 切换视角 | C |
| 触屏 | 方向按钮或在场景上滑动 |

浏览器需支持 WebGL。静态部署使用 `dist/`，支持桌面与手机屏幕。音效通过 Web Audio 在首次交互后启用。

## 实现结构

- `src/engine.js`：纯状态机、关卡和 BFS 求解器。
- `src/scene.js`：Three.js 场景、仓鼠模型、厨房物件与动画。
- `src/main.js`：输入、界面、存档、音效、通关与提示。
- `src/solver-worker.js`：后台求解。
- `tests/engine.test.js`：全部关卡可解性、冰面、机关与状态一致性验证。
