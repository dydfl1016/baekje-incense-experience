# Baekje Gilt-bronze Incense Burner — Phase 2A

백제금동대향로의 실제 원본을 탐색하는 반응형 기능 검증 프로토타입. LE ENGLISH와 분리된 독립 프로젝트입니다. 9개 장면과 최종 연출은 구현하지 않습니다.

## Implementation

Static HTML/CSS/ES module, with Google `<model-viewer>` 4.1.0 loaded from a pinned unpkg URL. No build or package installation is required. The viewer uses its built-in lighting; no additional media or environmental assets are supplied. Runtime CDN access and WebGL are required.

- Mouse drag / one-finger touch: orbit. Wheel / pinch: zoom. Arrow keys also rotate the focused viewer.
- `↺` (전체 보기): restore the approved full-artifact orbit, target, and field of view. No auto-rotation.
- Entrance tap starts quiet BGM with native audio looping. The accessible `♪ / ♫` sound button pauses/resumes playback.
- Small viewer progress indicator; progress represents loading/preparation, not byte-accurate transfer. Model/CDN failure and audio failure show Korean messages.
- A full-height stage with separate controls keeps phone gestures away from buttons; `touch-action="none"` prevents scrolling within the viewer. `100svh` and safe-area padding account for browser UI.
- Reduced motion skips the cinematic camera movement and clears mist on entry. No particles.

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

Discovery Points and later phases require the owner's review and approval.

## Environment validation

Passed JS syntax and whitespace checks, local HTTP asset/path checks under the repository subpath, and mock-DOM tests for explicit audio activation/toggle, loading/error handling, and reset logic. Original asset SHA-256 hashes remain identical. Browser installation failed in the implementation environment, so rendering, mouse/physical touch, playback seam, and real mobile performance have not been tested.

## Phase 2A — continuous entrance

The same unmodified GLB supplies both the close mountain view and the complete artifact; no video or second scene. Real vertex bounds place the mountain geometry around y=0.15–0.60m. Initial orbit is 0° / 85° / 0.8m, target (0, 0.42, 0.08)m, FOV 30°. This is a geometry-based first composition, requiring visual tuning on Android.

All tunable values are grouped in `ENTRANCE` in `js/main.js`: opening orbit/target/FOV, final framing, 5000ms duration, 0.82 mist opacity, and 4500ms hint timing. The approved 105% full-view radius and auto target are resolved through the viewer after loading, so the end pose adapts to viewport framing.

A single accessible full-stage entry button starts audio immediately in its click handler, then runs a requestAnimationFrame pull-back with quintic easing. Orbit radius, target, angle and FOV interpolate continuously while a static CSS mist layer fades. Camera controls are disabled until completion; afterward orbit, zoom and pan are restored, compact sound/reset controls appear, and the hint fades after its timeout or first user camera change. Reset returns to full view without replaying the entrance. Tap-to-recenter remains disabled; pan works with two fingers or Shift/right-button drag.

The viewer is concealed until its close-up is prepared to avoid flashing the complete artifact before the reveal. Load/CDN failure retains a visible fallback. Reduced-motion entry hands off immediately rather than executing the camera animation.

Validation: JS syntax, mock-DOM state-machine tests (normal/reduced motion, no pre-entry audio, duplicate-entry guard, changing target, camera lock/unlock, reset and sound toggle), and unchanged source-asset hashes passed. These tests do not validate WebGL rendering or actual multitouch. Real Android review must check the landscape illusion, smoothness, final framing, sound policy and manipulation handoff. The existing browser-installation limitation still applies.
