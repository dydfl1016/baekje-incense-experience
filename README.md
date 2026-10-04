# Baekje Gilt-bronze Incense Burner — Phase 1

백제금동대향로의 실제 원본을 탐색하는 반응형 기능 검증 프로토타입. LE ENGLISH와 분리된 독립 프로젝트입니다. 9개 장면과 최종 연출은 구현하지 않습니다.

## Implementation

Static HTML/CSS/ES module, with Google `<model-viewer>` 4.1.0 loaded from a pinned unpkg URL. No build or package installation is required. The viewer uses its built-in lighting; no additional media or environmental assets are supplied. Runtime CDN access and WebGL are required.

- Mouse drag / one-finger touch: orbit. Wheel / pinch: zoom. Arrow keys also rotate the focused viewer.
- `처음 시점`: restore the initial orbit, target, and field of view. No auto-rotation.
- `소리 켜기`: explicit user-initiated playback, quiet volume, native audio loop. Toggle pauses/resumes without resetting playback.
- Small viewer progress indicator; progress represents loading/preparation, not byte-accurate transfer. Model/CDN failure and audio failure show Korean messages.
- A full-height stage with separate controls keeps phone gestures away from buttons; `touch-action="none"` prevents scrolling within the viewer. `100svh` and safe-area padding account for browser UI.
- Reduced motion removes camera interpolation. No scripted animation or particles.

## Protected source assets

References are centralized in `js/main.js`, relative to that module, including under a GitHub Pages project path. Future Blender exports may replace the model at the same path.

| Asset | Original bytes | SHA-256 |
|---|---:|---|
| `assets/model/baekje-incense-burner.glb` | 38129992 | `0fee3b6a4bb27183e6318443c63ee81a151f097d7bc571372579d5ff740473e5` |
| `assets/audio/ambient-loop.mp3` | 3763947 | `801e903bca3242900ff5ef41e4540cd7a74dc9e53630b0a9ff911cfb69cc4dec` |

Neither asset is modified. Native HTML audio looping cannot guarantee sample-perfect continuity across all browsers; test the supplied MP3 seam on real devices.

## Preview

From the repository root:

```sh
python3 -m http.server 8000
```

Open http://localhost:8000. For a project-subpath check, serve the parent directory and open `/baekje-incense-experience/`.

## GitHub Pages

The root is deployment-ready and `.nojekyll` is included. Enable branch publishing in repository **Settings → Pages → Deploy from a branch → main → / (root) → Save**.

Expected URL after GitHub finishes deployment: https://dydfl1016.github.io/baekje-incense-experience/

## Real-device review

Check desktop and Android: initial framing, drag/pinch, small-screen controls, model load time on Wi-Fi/mobile data, prolonged rotation stability, sound activation/toggling and loop seam. Browser console logs time until the original GLB is ready (transfer + preparation); local/headless measurements are not mobile performance estimates.

Phase 2 requires the owner's review and approval.

## Environment validation

Passed JS syntax and whitespace checks, local HTTP asset/path checks under the repository subpath, and mock-DOM tests for explicit audio activation/toggle, loading/error handling, and reset logic. Original asset SHA-256 hashes remain identical. Browser installation failed in the implementation environment, so rendering, mouse/physical touch, playback seam, and real mobile performance have not been tested.

## Phase 2B.1 — Spatial callout prototype

One phoenix discovery, placeholder content only. Phase 2A entrance, BGM, free exploration, proximity conditions and reset remain unchanged. Source assets are byte-identical.

`js/discoveries.js` holds the anchor/normal, proximity distances, camera orbit/target/FOV and 1600ms staging, prompt/offset, 6px dot / 44px hit area, box width/offset/preferred corner, margin, bend, 700ms reveal, placement hysteresis and off-screen margin. Future Blender replacements primarily require coordinate/camera tuning.

`js/discovery-engine.js` uses model-viewer's `queryHotspot()` canvasPosition and facingCamera. The hotspot itself tracks the model; an SVG three-point polyline and HTML annotation use the projected coordinate translated into stage space. Tracking runs only while an annotation is open, including while temporarily hidden. Closing/disabling stops the loop. Camera controls remain enabled.

`js/callout-layout.js` chooses among four anchor-relative corners, clamps to safe margins, prefers the side opposite the anchor and uses a 60px center deadband plus score hysteresis. CSS eases placement; the leader endpoint follows the rendered box throughout the transition. This is a simple placement heuristic, not silhouette-aware collision avoidance.

Available prompt: 여기를 눌러보세요. Selection stages the existing camera. Input immediately cancels staging at the visible pose and opens the annotation; further orbit/pan/zoom keep it open. Reduced motion skips camera and reveal animations. Close/Escape remove the annotation without moving the camera; full-view closes it and performs the existing reset. Leaving/reentering the proximity region permits revisiting after close.

The SVG line grows first, then placeholder eyebrow/title/body/source fade in within approximately 700ms. The full-size model canvas is preserved; there is no reserved text strip. Off-screen margin, clip-depth and facingCamera tests hide line/box/anchor and remove hidden controls from interaction. They return when visible again. Facing-normal detection is an approximation: other geometry can still occlude the anchor; no mesh raycasting is added.

Validation: JS syntax/whitespace, original asset hashes, mock-DOM normal/reduced-motion proximity, interrupt, persistent exploration, moving projection/line, hide/return, close-pose and idle-loop checks passed. Placement bounds and small-motion stability checks passed. Phase 2A mock regression covers reveal/audio/reset. Real WebGL rendering and physical Android gestures/readability/performance are not tested; review the anchor, card overlap and line geometry on device before approving another phase.
