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

## Phase 2B — Discovery Engine v0.1

Only `phoenix-prototype` is implemented. All text is explicitly PLACEHOLDER content; no historical claims or additional points are added.

- `js/discoveries.js`: region, anchor/normal, activation/target distances, camera orbit/target/FOV, staging time, text placement/reserved space/timing, signal appearance, content type, source and status.
- `js/discovery-engine.js`: generic proximity gate, model-viewer slotted signal, camera staging, text and dismissal. Existing entrance/audio logic remains in `js/main.js`.

Prototype anchor: (-0.021, 0.797, 0.029)m, near an actual vertex on the current phoenix geometry. Normal: (0, 0, 1). Tune this after Blender revisions. Preserve export origin/scale/orientation where possible; replacing the GLB does not require changes to the engine.

The camera position is computed from model-viewer orbit + target. The signal requires camera-to-anchor <= 2.1m AND target-to-anchor <= 0.65m, plus front-facing and on-screen tests. A 0.15m hysteresis margin avoids threshold flicker. This is an approximate UX gate, not full mesh occlusion. It is disabled during loading/dawn/reveal and invisible in the approved full view.

A model-viewer hotspot slot anchors a 6px soft point to the model, with an invisible 44px touch target. It fades in and breathes over 3.8s; reduced motion removes both transitions and pulse. On selection it disappears.

Selection stages the camera over 1.6s (smoothstep) to orbit 0deg / 80deg / 1.2m, target (0, 0.65, 0)m and FOV 30deg. Camera controls stay enabled. Pointer, wheel or camera key input cancels staging before model-viewer handles the same input. Generation guards stop any late animation/text completion. Reduced motion skips staging.

A 148px strip below the detail canvas holds the small eyebrow, title, placeholder body and source; the artifact is never covered by text. This reserve exists only in Discovery mode and is removed on dismissal. Placement is a per-item setting, with simple corner options. No modal, opaque card or next button. Text fades/rises 3px with 0/140/280/400ms delays. A small accessible close button and Escape are available.

Touching/manipulating the model hides text without resetting camera target, radius or angle. Reset explicitly dismisses then returns to the approved full view. The signal is suppressed until leaving its proximity region, allowing later revisits without immediate redisplay. Internal hidden/available/focused/discovered states and session visit memory have no visible progress or scores.

Tune on Android: anchor/normal; activation and target distance; signal contrast/size/pulse; detail orbit/target/FOV; staging duration; reserved text strip size/placement; text delays. The neutral unfinished model may make tiny details and the signal less distinct; no material substitution is used.

Validation: JS syntax/whitespace, unchanged asset hashes, pure proximity tests and mock-DOM normal/reduced-motion cycles passed. Tests cover entrance gating, selection, interruption, stale-frame cancellation, placeholder text, dismissal without a return camera move, and suppression/revisit. Phase 2A state-machine regression checks passed. These are not physical Android, WebGL or real multitouch tests.
