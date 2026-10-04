// Central asset references for Phase 1. No missing media is requested in Phase 0.
// Resolve from this module so GitHub Pages repository subpaths work correctly.
export const ASSET_URLS = Object.freeze({
  model: new URL("../assets/model/baekje-incense-burner.glb", import.meta.url).href,
  audio: new URL("../assets/audio/ambient-loop.mp3", import.meta.url).href,
});
