# Marble House

A playable Three.js marble adventure inside a handcrafted 3D toy house.

## Run

```sh
npm install
npm run dev -- --port 5184
```

Production: `npm run build`, then `npm run preview`.

## Play

Click **Let's roll**. Collect all 12 golden stars, then enter the golden garden portal.

- WASD / arrows: camera-relative movement with inertia
- Space: jump
- Shift: brake
- C: return to last checkpoint
- R: restart
- Esc: pause / resume
- Touch arrows and Hop button on mobile

Features: four furnished room/garden zones, rotating obstacles, boost strip, checkpoint flags, collectible stars with particles, victory and timeout screens, free roam / 90-second time trial, three color themes with different obstacle speeds, camera rotation, fullscreen, optional synthesized sound and per-world/mode local best times.

All scene geometry is generated locally. No model/image downloads or external font services are required. Browser WebGL support is required.

## Verification

Production build passed. Browser checks confirmed canvas rendering, start and initial star collection, timer progression, pause and world selector. Full route completion and mobile touch hardware have not been manually verified.
