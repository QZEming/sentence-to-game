# 环境中断续接与验证记录

## 来源与边界

原始任务：实现“小怪兽伪装成城市物品玩捉迷藏”的 3D 非对称躲藏游戏，并丰富玩法。

2026-10-02 因本地环境连接中断，上轮仅确认四个文件落盘，`src/main.js` 写入结果未返回。2026-10-03 恢复执行后先只读检查，确认主模块缺失，从仍保留在对话中的原工具调用恢复完整代码，没有重新构思或追加玩法要求。

恢复原稿：`output/verification/main.recovered-original.js`。

SHA-256：`2a5fb42556d0af67b406396fd6025fd092f878547a88503c422a6547a57e6295`。

四个原始归档文件未修改，逐一通过归档 manifest 中 SHA-256 对比，详见 `output/verification/archive-integrity.json`。

## 续接后的修复

在恢复原稿上，按构建与验证结果进行小范围修复：

- 标题字号与侧栏布局，避免标题多余换行及伙伴列表与底部 HUD 重叠。
- 返回大厅时清理技能冷却、烟雾、无敌状态和诱饵；重开时重置星糖任务提示。
- 搜捕者显示对应任务与失败文案；倒计时统一采用总秒数向上取整。
- 修正旋转 180 度车辆的碰撞框方向。
- 在变身、诱饵消失与重开时释放已移除模型的几何体；移除一个立即被删除的临时模型。
- 增加内嵌 favicon，消除浏览器请求不存在图标导致的 404。

改动对照在 `output/verification/resume-changes.patch`，恢复原稿与中断归档均保留。

## 构建

- `node --check src/main.js` 通过。
- 恢复原稿的 `npm run build` 通过：`output/verification/build-initial.log`。
- 修复后的 `npm run build` 通过：`output/verification/build-final.log`。
- Vite 提示 Three.js 主 bundle 大于 500 kB（约 546 kB，gzip 约 146 kB），不是构建失败。未为了消除提示改变交付范围。

## 浏览器验证

工具：Playwright CLI，独立会话 `task55-resume`；未操作用户其他浏览器会话。

### 正常 UI 操作

`output/verification/smoke-ui.js` 与 `smoke-ui-final.log` 记录真实按键和点击：

- 开始躲藏回合、WASD 移动、收集星糖、靠近路锥 Q 变身及解除。
- E 烟雾与空格诱饵，界面正确展示冷却。
- Shift 冲刺消耗体力。
- Esc 暂停，计时冻结，继续后恢复。
- 返回大厅，切换搜捕者；准备结束后距离感知、扫描与抓空消耗体力。
- 帮助、难度设置、音效开关和返回大厅。

首次烟雾状态检查未等待 UI 的 80 ms 刷新周期，断言过早；增加等待后通过，首次失败保留在 `smoke-ui-initial.log`。这次失败没有据此修改技能逻辑。

### 确定性集成场景

`output/verification/integration.js` 与 `integration-final.log`：30 项检查通过，浏览器 page error 为 0。

覆盖四种变身及恢复、距离限制、建筑与边界碰撞、静止隐藏与移动暴露、伤害无敌窗口、烟雾与冷却、诱饵吸引和眩晕、大厅清理、扫描半径、捕获与全捕获胜、重开重置、躲藏者失血失败、抓空体力代价、逐个收集八颗星糖、传送门获胜、两阵营超时胜负。

**方法限制：**这些场景通过 Playwright 仅向测试浏览器的模块响应追加临时接口，设置角色位置、计时边界等条件，再执行原游戏逻辑。测试钩子未写入 `src/` 或 `dist/`。此记录不把这部分测试说成人工完整游玩。额外的正常 UI 与生产版验证单独记录。

初次测试超时发生在钩子加载阶段：Vite 为模块 URL 加上 `?t=...`，严格路由未匹配。诊断日志 `integration-diagnostic.log` 明确显示阶段为 `load`。修正测试路由后全部通过，没有因此修改游戏代码。

### 生产版与视口

`output/verification/production-visual.js` 与 `production-visual.log`：通过独立 `vite preview` 加载 `dist/`，确认 WebGL 场景渲染。

- 桌面 1440 × 900。
- 窄屏 390 × 844，无横向溢出，开始按钮、技能卡在视口内；方向按钮可移动角色。
- 生产版测试 page error 为 0。

截图在 `output/playwright/`，包括大厅、窄屏、游戏中与传送门胜利结果。截图由真实浏览器生成。

## 已知边界

这是本地单人对抗 AI 的可玩原型，不含联网匹配、后端或多人同步。只验证了本机 Chromium；未声称已覆盖所有设备、浏览器或长时间压力测试。

## 自然完整回合与最终清理

在未注入测试接口的生产版页面上，正常点击开始、W+A 移动、Q 伪装成路锥后保持静止，经历真实的 6 秒准备期与 120 秒倒计时。结果为「完美藏身！」、HP 100、星糖 1、计时 0。没有修改位置、时间或 AI 状态来完成这一回合。

证据：`output/verification/final-check.log`、`output/playwright/natural-survival-victory.png`。最终还确认生产环境不存在 `window.__verification` 测试接口，1440×900 桌面伙伴列表与底部 HUD 不重叠，1280×720 无横向溢出。

已关闭专用 Playwright 会话 `task55-resume`，并关闭仅属于本任务的 127.0.0.1:4555 开发预览与 127.0.0.1:4556 生产预览。再次检查两端口均无监听。记录见 `output/verification/browser-cleanup.log` 与 `output/verification/cleanup.json`。

完整代码、`dist/`、原稿、修复差异、构建日志、测试脚本、测试结果和截图均保留。交付清单及最终源码/构建产物哈希见 `output/delivery-manifest.json`。
