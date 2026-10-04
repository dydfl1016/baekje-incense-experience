# Discovery shelves — Phase 2C

`js/discoveries.js` is the authoring location. There are four Level-1 regions and seventeen Level-2 slots. The approved phoenix prototype now has stable region ID `phoenix`; its position, camera, copy and presentation are unchanged. All other slots are disabled and empty. Internal `label` values organize work and are never shown as substitute content.

| Region | Child IDs (prefix omitted) |
| --- | --- |
| phoenix | form, jewel, wings, tail |
| mountain | figures, musicians, animals, vegetation, peaks, smoke_openings |
| lotus | petals, form, connection |
| dragon | head, body, feet, supporting_posture |

Each entry uses `id`, `parentId`, `level`, `region`, `label`, `enabled`, `status`, `geometryStatus` and `contentStatus`. Parent links are data only: no automatic nesting, menu or progress system is implemented. New slots are `draft`, `needs-coordinates`, `needs-research` and disabled. Only explicitly enabled `prototype` or `ready` entries with valid geometry, framing, visible title/body and presentation are admitted by `js/discovery-schema.js`.

Fields stay compatible with the existing flat engine configuration, grouped by comments:

- Geometry: `anchorPosition`, `anchorNormal`, `activationDistance`, `targetDistance`, `exitMargin`, `cameraOrbit`, `cameraTarget`, `fieldOfView`, `stagingMs`.
- Content: `title`, `eyebrow`, `shortText`, `source`, `contentType`. Allowed future classifications: FACT, INTERPRETATION, QUESTION; empty slots remain null.
- Presentation: `promptText`, `promptOffset`, `callout`, `signal`, `textTiming`. Copy the approved phoenix presentation values when completing a slot; no new UI grammar is needed.

Choose a slot; inspect the real final GLB; enter verified anchor/normal and camera framing; tune proximity; copy the shared presentation values; research and attribute text; enter source and classification; test staging/tracking on Android; mark geometry/content ready and status `ready`; enable only after review. A slot with missing coordinates or empty title/body remains invisible even if accidentally enabled. There is no origin fallback or draft console logging.

BLENDER OWNS THE ARTIFACT. WEB OWNS THE EXPERIENCE. Replace the final export at `assets/model/baekje-incense-burner.glb`, then tune geometry/camera fields in this data file. Preserve origin/scale/orientation where practical. No architecture rebuild or web material substitution is required.

Run schema checks with `node tests/discovery-schema.test.mjs`. No historical research or detail coordinates were added in this phase.
