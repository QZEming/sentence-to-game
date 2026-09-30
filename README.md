# sentence-to-game

**一句话，100 个游戏。**

记录用一句话做出 100 个游戏的过程。每个游戏都保留原始提示词、源码和体验地址，让想法可以被试玩、阅读和继续改造。

当前进度：**4 / 100**。

游戏合集：[qzemi.cn/sentence-to-game](https://qzemi.cn/sentence-to-game/)。

## 游戏列表

| 编号 | 游戏 | 体验地址 | 源码 |
| --- | --- | --- | --- |
| 001 | [鹈鹕漫游记 · Pelican Pedal](games/001-pelican-pedal/README.md) | [开始骑行](https://qzemi.cn/sentence-to-game/games/001-pelican-pedal/) | [源码](games/001-pelican-pedal/src/) |
| 002 | [羽境 · Shuttle Arena](games/002-shuttle-arena/README.md) | [开始比赛](https://qzemi.cn/sentence-to-game/games/002-shuttle-arena/) | [源码](games/002-shuttle-arena/src/) |
| 003 | [风原纪 · Wildreach](games/003-wildreach/README.md) | [启程探索](https://qzemi.cn/sentence-to-game/games/003-wildreach/) | [源码](games/003-wildreach/src/) |
| 004 | [裂隙前线 · Riftfront](games/004-riftfront/README.md) | [进入战场](https://qzemi.cn/sentence-to-game/games/004-riftfront/) | [源码](games/004-riftfront/src/) |

## 目录结构

每个游戏放在 `games/` 下，按三位编号和英文短名命名，例如 `001-game-name`：

```text
games/
└── 001-game-name/
    ├── prompt.txt     # 原始的一句话提示词
    ├── README.md      # 游戏介绍、操作方式和体验地址
    └── src/           # 游戏源码，静态网页入口为 index.html

templates/
└── game/              # 可复制的游戏模板

scripts/build-site.py  # 生成游戏合集和发布文件
docs/                  # GitHub Pages 网站
```

## 添加一个游戏

复制模板并使用下一个编号：

```bash
cp -R templates/game games/001-game-name
```

在 `prompt.txt` 中保存生成游戏时的一句话，将源码放进 `src/`，补充游戏的 `README.md`，再把游戏和体验地址添加到上方列表。

## 游戏地址与发布

每个游戏使用固定地址：

```text
https://qzemi.cn/sentence-to-game/games/001-game-name/
```

静态网页游戏从 `src/index.html` 启动，图片、脚本等资源使用相对路径。需要编译的项目保留 `src/` 源码，并先将网页产物生成到该游戏的 `dist/`；存在 `dist/index.html` 时优先发布 `dist/`。

新增或更新游戏后，在仓库根目录生成网站：

```bash
python3 scripts/build-site.py
```

将游戏源码、说明和生成的 `docs/` 一起提交到 `main`，GitHub Pages 会自动发布网站。构建会生成游戏列表，并将各游戏的网页文件放到对应地址。

网站沿用个人域名 `qzemi.cn`，合集位于 `/sentence-to-game/`。

本项目新增或更新游戏时，默认发布到上述域名：保留原始提示词与源码，构建游戏与合集，验证游戏子路径，再将对应的 `docs/` 产物随源码提交到 `main`。发布后应检查线上页面；无法访问线上环境时，明确区分已提交的发布产物和尚未确认的线上状态。

前四作的完整构建命令：

```bash
npm --prefix games/001-pelican-pedal ci
npm --prefix games/001-pelican-pedal run build
npm --prefix games/002-shuttle-arena ci
npm --prefix games/002-shuttle-arena run build
npm --prefix games/003-wildreach ci
npm --prefix games/003-wildreach run build
npm --prefix games/004-riftfront ci
npm --prefix games/004-riftfront run build
python3 scripts/build-site.py
```

模板：[游戏说明](templates/game/README.md) · [提示词](templates/game/prompt.txt)
