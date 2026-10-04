# ORBITAL · 轨道交会模拟

无需构建的浏览器 3D 航天游戏，使用本地 vendored Three.js r169。

## 本地运行

```sh
python3 -m http.server 4278 --directory dist
```

打开 http://localhost:4278。需要支持 WebGL 的现代浏览器。

## 游戏流程

- 轨道转移 → 交会接近 → 精密对接。
- 调整三轴 Δv 后点火；橙色虚线为同一动力学积分器生成的 480 秒滑行预测。
- 首次体验可打开自动交会并使用 20× 加速，近距离自动降速。
- WASD / R F 控制三轴平移，方向键控制姿态；X 逐步制动、P 精细模式、空格暂停、C 切换视角。
- 三种任务：标准训练、限时低燃料补给、夜侧仪表对接（20 秒辅助额度）。
- 成绩只保存在本机浏览器 localStorage，无账户或服务器存档。

## 物理与范围

站心 LVLH 的 Clohessy–Wiltshire 方程，四阶 Runge–Kutta 积分。实际积分步长最大 0.025 秒。输入推力按向量模长限制并扣除燃料，无被动平移阻尼。近场姿态稳定系统消耗推进剂。近场采用米制局部坐标，轨道远景与模型比例为展示增强比例。

软捕获要求：端口前方距离 < 0.8 m，横向偏差 < 0.6 m，相对速度 < 0.15 m/s，姿态误差 < 5°，角速度 < 1°/s，持续 2 秒。碰撞、离开交会范围和补给超时会结束任务。教学游戏，不能用于真实航天任务。

## 素材

Earth imagery: NASA / Reto Stöckli & Robert Simmon; texture distributed with Three.js examples.
- https://threejs.org/examples/textures/land_ocean_ice_cloud_2048.jpg
- https://science.nasa.gov/earth/earth-observatory/the-blue-marble-true-color-global-imagery-at-1km-resolution/
- https://www.nasa.gov/nasa-brand-center/images-and-media/

Three.js and OrbitControls © three.js authors, MIT license; see dist/vendor/LICENSE.
