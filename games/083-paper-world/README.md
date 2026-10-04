# 纸境 · Foldlight

A standalone 3D origami puzzle game built with Three.js. Six progressively more involved chapters contain collectible starlight, station-bound folding controls, mutually exclusive routes, keys and persistent switches.

## Run locally

```sh
python3 -m http.server 4317 --bind 127.0.0.1 --directory dist
```

Open http://127.0.0.1:4317. No build or package installation is required. Three.js r170 is bundled locally; Google Fonts are optional and have system fallbacks. A browser with WebGL support is required.

## Controls

- Click a connected island to walk; intermediate collectibles are gathered automatically.
- Stand on a marked folding station, then click its crease control or press 1 / 2 / 3.
- Z: undo; R: restart; Q / E: orbit; arrow keys: move to a neighboring island in that screen direction.
- Drag the empty world to orbit; wheel to zoom; use the view reset to return.
- The hint button solves the current state and reveals only the next action.
- Sound is opt-in. Completion records are saved to this browser's local storage.

## Source

- `dist/levels.js`: immutable state transitions, conditional graph, six chapters and BFS hints.
- `dist/scene.js`: Three.js geometry, paper islands, animated hinged bridges, spirit, lighting and camera.
- `dist/game.js`: game actions, UI, audio, local records and WebMCP tools.
- `dist/style.css` and `dist/index.html`: responsive game interface.

## Verification

All 301 reachable puzzle states across six chapters were enumerated and confirmed to have a valid completion path. No softlocks. Browser checks covered real pointer movement, station restrictions, collection, folding, undo restoration, chapter selection and victory feedback. The same visible actions back the WebMCP APIs.

Chapter state counts: 24, 22, 48, 21, 59, 127.
Shortest action counts: 6, 7, 11, 7, 15, 17.

Three.js is MIT licensed; its copyright and license notice is preserved in the bundled module header.
