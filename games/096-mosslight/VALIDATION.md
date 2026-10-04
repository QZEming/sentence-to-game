# Recovery validation

Completed in the 2026-10-04 recovery round, preserving the first round's files and assets.

## Passed

- JavaScript syntax checks for data.js, game.js, scene.js.
- Independent read-only review of progression and reward guards.
- WebGL 3D scene initialized successfully in Chrome with no page exceptions.
- Six consecutive complete cases, covering four species and all three treatment minigames.
- Diagnosis unavailable before sufficient exams; wrong diagnosis and wrong treatment remain retryable.
- Duplicate examination does not duplicate rewards.
- At least two distinct recovery actions required before discharge.
- First case had intentionally incorrect diagnosis/treatment and received one star; the remaining five received three stars.
- Refresh after an exam restored collected evidence; refresh after discharge preserved coins and did not pay twice.
- Advancing through six patients moved the clinic to day 3.
- Buying the blanket deducted 90 coins once; the purchased upgrade increased trust by 16.
- The field guide contains four species and the treatment log retained all six cases.
- 390-pixel phone layout had no horizontal overflow and exposed the compact pet action.

## Repaired during browser verification

- Isolated the WebGL canvas from intrinsic layout sizing to keep the examination tools and page height stable.
- Removed geometric pulsing from clickable purification targets so targets stay in place.
- Made the four field-guide image frames square so the lower atlas quadrants keep heads and antlers in view.

## Evidence

The CLI browser scripts and desktop, mobile, deer, and field-guide screenshots are in `output/playwright/` (excluded from hosted assets). The browser tests use only visible UI actions and read back local game state; no hidden completion helpers were called.

## Final UI checks

PASS: stable WebGL layout; viewports 320, 390, 768, and 1440 pixels; sound toggle; help dialog; Escape closing; all four field-guide image frames. No browser page errors were observed. WebMCP registration is feature-detected; the validation browser did not expose document.modelContext, so direct WebMCP execution validation was unavailable and is not claimed.
