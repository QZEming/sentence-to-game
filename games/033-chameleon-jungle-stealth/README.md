# 隐鳞 CHROMA

完整的 Three.js 3D 丛林潜行小游戏，无构建步骤。Three.js 已随游戏本地打包。

## 运行

在本目录运行 `npm start`，浏览器打开 http://127.0.0.1:4391 。

WASD / 方向键移动，Shift 疾行，C 蹲伏，1/2/3 选择颜色，Q 匹配环境，F 投出诱饵，E 收集情报/关闭雷达/舌击，Esc 暂停，滚轮缩放。手机提供方向键和动作按钮。

收集三处情报，再返回溪流南侧绿色撤离圈按 E。关闭东北雷达是可选目标。视线、遮挡、距离、地表匹配和疾行噪音共同决定守卫警戒；生命归零失败。支持重开、评级和声音开关。

## 文件

- dist/index.html — 游戏界面
- dist/style.css — 响应式战术 HUD
- dist/game.js — 3D 场景、AI、碰撞、任务与操作
- dist/vendor/three.module.js — Three.js 0.170.0 (MIT)

`npm run check` 检查语法。UI 字体使用 Google Fonts，加载失败时自动使用系统字体；游戏核心运行不依赖外部 CDN。
