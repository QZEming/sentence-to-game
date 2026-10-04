# BOT//BEAT

A 3D robot-band rhythm game built with Three.js and Web Audio.

## Run

```bash
npm install
npm run dev
```

Open the Vite URL in a browser with WebGL and Web Audio support.

## Play

- D / F / J / K: drums, bass, synth, and lead. Tap when notes cross the colored line.
- Space: play or pause. R: restart.
- Three songs and three difficulty levels.
- Perfect/Good timing, combo multipliers, and 8-second double-score Overdrive after a 20-note streak.
- Auto Play performs the chart without updating personal records.
- Per-song, per-difficulty personal bests saved locally.
- Click pads to practice instruments; use the camera control to orbit the stage.

Audio is synthesized locally and starts after an interaction. Switching songs, difficulty, or Auto Play resets the current run.

## Build

```bash
npm run build
npm run preview
```
