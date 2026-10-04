# NEON ASSEMBLY — 机器人乐队

Three.js + Web Audio 驱动的 3D 节奏游戏，无需后端。

## 运行

```sh
python3 -m http.server 4187 --directory dist
```

打开 http://localhost:4187，首次点击启用音频。

## 功能

- D / F / J / K 演奏鼓、贝斯、和弦和旋律，支持触屏。
- 三首合成曲目 × 三档难度，普通音符、长按、双押。
- 每 10 连击提高倍率，最高 4 倍。满能量按空格开启 8 拍双倍得分。
- 自由即兴与无限循环伴奏；暂停、自动后台暂停、三种镜头、全屏。
- 本地最佳成绩、演出评级、20 连击徽章；音量与延迟补偿。

## 检查

```sh
node --experimental-default-type=module tests/game-qa.mjs
```

覆盖九套谱面全曲完美演奏、长音完成与提前释放、尾部容错、能量得分、暂停恢复、无限即兴、配置校验。DOM 和 AudioContext 为测试替身；浏览器另检 3D、启动、结算、暂停恢复和 390 px 布局。WebMCP 未在支持的浏览器环境实测。

Three.js 及许可在 `dist/vendor`；全部图形和音频在客户端生成。
