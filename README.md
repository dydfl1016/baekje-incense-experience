# Baekje Gilt-bronze Incense Burner

백제금동대향로를 중심으로 하는 몰입형 반응형 웹 경험.
LE ENGLISH와 분리된 독립 프로젝트입니다.

## Phase 0

Project initialization only: minimal HTML/CSS/JS and reserved asset directories.
No viewer, audio playback, effects, or nine-scene storytelling is implemented.

Visual direction: white/off-white, extremely pale turquoise, bronze/gold from the artifact, generous negative space, minimal text and interface.

## Structure

- `index.html`: minimal HTML foundation
- `css/style.css`: responsive off-white foundation
- `js/main.js`: centralized asset URLs
- `assets/model/`, `assets/audio/`: required owner-supplied media
- `assets/video/`, `assets/images/`: reserved directories

## Required assets — not included

Upload the real files at exactly:

- `assets/model/baekje-incense-burner.glb`
- `assets/audio/ambient-loop.mp3`

The empty `.gitkeep` files preserve directories; they are not media substitutes.
Asset URLs resolve relative to the JS module and support GitHub Pages repository subpaths.
Phase 0 does not request the missing media.

## Preview and deployment

No build step or dependencies are required. From the repository root:

```sh
python3 -m http.server 8000
```

Open http://localhost:8000.

GitHub Pages is not configured in Phase 0. The project is compatible with later static deployment from `main`, folder `/ (root)`. No deployment workflow is included.

## Before Phase 1

Review and approve initialization, then upload the real GLB and MP3.
The next prototype will validate loading, mouse/touch rotation, zoom, desktop/mobile composition, user-initiated looping BGM, sound control, and mobile performance.
Evaluate a simple viewer such as `<model-viewer>` before introducing Three.js.
The nine experiential movements remain future creative directions.
