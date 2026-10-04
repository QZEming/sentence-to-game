# 云朵蹦蹦 · Cloud Bunny

原生 JavaScript + Three.js 的 3D 云端音乐游戏。无需构建、无需 API key。

## 运行

```sh
python3 -m http.server 4173 --directory dist
```

打开 http://localhost:4173 。请使用支持 WebGL 的现代浏览器，点击开始后启动音乐。

## 玩法

- ← → 或 A / D 切换三条云路。
- 空格 / W / ↑ 跳跃；空中再次按下可二段跳。
- Shift 触发两秒无敌冲刺、范围吸附，九秒冷却。
- P / Esc 暂停，离开标签页自动暂停。
- 跟节拍跳跃获得 Perfect 连击和最高五倍积分。
- 金音符加分，胡萝卜提供一次护盾，雷云造成伤害。
- 90 秒挑战、无限生命自由漫游、收集与连击任务、S/A/B/C 评级和本机最高纪录。
- 三个曲目使用 Web Audio 实时合成，不使用受版权保护的录音；场景随选曲切换。
- 支持触屏操作。最高纪录存储于本机 localStorage。

Three.js 0.170.0 随游戏一起存放，使用 MIT 许可，见 dist/THREE-LICENSE.txt。
