# 苔光奇兽诊所 · Mosslight

一个浏览器内的 3D 奇幻兽医诊疗模拟游戏。

## 玩法

- 四种可旋转查看的 3D 奇兽：翡翠幼龙、月光狐、金羽凤凰、森灵鹿。
- 六个症状与疗法各不相同的病例，可循环接诊。
- 四项检查工具、线索推理、诊断选择、按顺序治疗。
- 六种疗法，包含调温节奏、配药记忆、点击净化三类小游戏。
- 安抚、喂食、梳理、休息与出院；每日目标、金币、装备升级、成就与诊疗手账。
- 自动保存到当前浏览器，手机布局、声音开关、失败重试与治疗辅助。

## 本地启动

需要 Python 3。运行 `python3 -m http.server 8080 --directory dist`，打开 http://localhost:8080 。所有游戏脚本与 3D 引擎均在 dist 内；中文网络字体加载失败时自动使用系统字体。

浏览器需要支持 WebGL 2；场景不可用时仍保留诊疗工具与游戏流程。该游戏中的疾病和治疗都是幻想设定。

## 文件

- dist/index.html / style.css：原有诊疗室界面。
- dist/scene.js：Three.js 场景、奇兽模型、动画、视角与检查点。
- dist/data.js：病例、动物、疗法、存档结构。
- dist/game.js：诊疗状态、小游戏、奖励、升级、图鉴、无障碍控件。
- dist/creatures.png：原有生成美术，作为候诊缩略图与图鉴插画。
- .openai/hosting.json：原注册 Site 身份与静态发布配置。
- RECOVERY.md：环境离线与断点恢复记录。

Three.js is Copyright 2010–2024 Three.js Authors, MIT licensed. The vendored module retains its license header.
