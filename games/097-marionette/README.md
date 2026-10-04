# MARIONETTE · 午夜木偶剧场

浏览器 3D 提线木偶游戏，使用本地分发的 Three.js 0.170.0。五幕依次引入行走、窄桥、跳台、侧风与摆锤；挑战模式需完成定点平衡表演并收集至少两颗星，才能从金色光环谢幕。自由排练允许直接探索。

## 启动

```sh
python3 -m http.server 4173 --directory dist
```

打开 `http://localhost:4173`。静态文件已经可部署，无需安装或编译。`dist/assets/THREE-LICENSE.txt` 为渲染库许可证。

## 操作

- WASD / 方向键：移动；空格：跳跃。
- Q / E：左右提线；双键或 Shift：稳住身体。空中稳住保留行进速度。
- R：返回检查点；P / Escape：暂停或继续。
- 手机布局提供方向、跳跃与独立双线稳定按钮。

挑战成绩仅保存在本机浏览器，排练不会覆盖纪录。掉落保留星光和已完成的表演；每次跌落在结算时扣 25 分。

## 验证

```sh
node --check dist/game.mjs
node --check dist/physics.mjs
node tests/game-rules.cjs
node tests/level-reachability.cjs
```

`tests/browser-smoke.js.txt` 和 `tests/browser-level.js.txt` 是 Playwright CLI 的 `run-code` 片段；后者将 `ACT_INDEX` 替换为 0–4，可通过真实键盘操作验证对应关卡。浏览器截图保存在本地 `output/playwright/`。

## 恢复记录

2026-10-04，本轮是执行环境离线后的恢复轮次。原始交互原型从已保存的 Page 恢复，原文件完整保留为 `prototype-source.html`，未从头重生成。复用原 Site 身份并补全断线时下载不完整的 3D 引擎。

恢复中修复了无按键时手臂坐标 NaN、暂停期间缓存跳跃、帮助页清空通关结果，以及键盘与指针互相释放输入的问题；调整了灯光和桌面舞台布局。发布版本以 `dist/` 为准。
