# sentence-to-game

**一句话，100 个游戏。**

记录用一句话做出 100 个游戏的过程。每个游戏都保留原始提示词、源码和体验地址，让想法可以被试玩、阅读和继续改造。

当前进度：**0 / 100**。

## 游戏列表

尚未收录游戏。

| 编号 | 游戏 | 体验地址 | 源码 |
| --- | --- | --- | --- |

## 目录结构

每个游戏放在 `games/` 下，按三位编号和英文短名命名，例如 `001-game-name`：

```text
games/
└── 001-game-name/
    ├── prompt.txt     # 原始的一句话提示词
    ├── README.md      # 游戏介绍、操作方式和体验地址
    └── src/           # 游戏源码

templates/
└── game/              # 可复制的游戏模板
```

## 添加一个游戏

复制模板并使用下一个编号：

```bash
cp -R templates/game games/001-game-name
```

在 `prompt.txt` 中保存生成游戏时的一句话，将源码放进 `src/`，补充游戏的 `README.md`，再把游戏和体验地址添加到上方列表。

模板：[游戏说明](templates/game/README.md) · [提示词](templates/game/prompt.txt)
