# 泥间 · Clay & Time

A self-contained Chinese-language 3D pottery game built with vanilla JavaScript and locally bundled Three.js 0.180.0. No backend, account, build step, or runtime CDN is needed for gameplay. Optional Google Fonts fall back to system fonts.

## Run locally

```sh
python3 -m http.server 8000 --directory dist
```

Open http://localhost:8000. WebGL and a modern browser are required.

## Gameplay

- Drag the 3D clay outward/inward to reshape a 72-section lathed mesh.
- Sponge smoothing, engraved rings, adjustable brush size and height, moisture and water.
- Four starting vessels, three clay materials, eight glazes and four surface patterns.
- Right-drag or drag empty space to orbit, scroll to zoom, pause the wheel, undo/redo.
- Four commissions with live shape scoring and optional wireframe reference.
- Adjust kiln temperature and holding time, then watch the 12-second firing cycle.
- Name and collect the result, earn pottery coins and achievements, download a JPEG.
- Draft and up to 16 collected pieces persist in this browser's localStorage.
- Each piece has a stable ID; collection rewards can only be granted once, including across reloads and undo.
- Keyboard: 1/2/3 tool selection, Space wheel pause, Ctrl/Cmd+Z undo, Shift+Ctrl/Cmd+Z redo, H guide. Focus the clay and use Up/Down to select height and Left/Right to shape.

Temperature values are game rules, not instructions for real ceramics.

## Structure

- `dist/index.html`: semantic UI.
- `dist/style.css`: responsive workshop styling.
- `dist/app.js`: Three.js scene, pointer controls, state, local collection, optional WebMCP.
- `dist/game.js`: pure deformation, profiles, score calculation, and draft validation.
- `dist/vendor`: bundled Three.js modules and MIT license.

## Validation

Targeted rule checks cover local deformation, radius bounds, invalid draft rejection, perfect targets for all four orders, and temperature/time scoring. Browser validation covers real mouse sculpting, keyboard sculpting, commission acceptance, glazing, firing, naming, collection rewards and persistence. Optional WebMCP exposes read_pottery_studio and configure_pottery_glaze, feature-detected for supporting browsers.
