export const ASSET_URLS = Object.freeze({
  model: new URL('../assets/model/baekje-incense-burner.glb', import.meta.url).href,
  audio: new URL('../assets/audio/ambient-loop.mp3', import.meta.url).href,
});
// Tune only these values after Android visual review. Units match the original GLB.
export const ENTRANCE = Object.freeze({
  opening: { theta: 0, phi: 85, radius: 0.8, target: [0, 0.42, 0.08], fov: 30 },
  final: { orbit: '0deg 75deg 105%', target: 'auto auto auto', fov: '30deg' },
  durationMs: 5000,
  mistOpacity: 0.82,
  hintMs: 4500,
});
const $ = (selector) => document.querySelector(selector);
const viewer = $('#artifact'), experience = $('.experience'), stage = $('.stage');
const loading = $('#loading'), progress = $('#load-progress'), loadingText = $('#loading-text');
const enter = $('#enter'), reset = $('#reset-view'), controls = $('#controls');
const audio = $('#ambient'), sound = $('#sound-toggle'), audioStatus = $('#audio-status');
const hint = $('#explore-hint');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let phase = 'loading', hintTimer, finalPose;
const startedAt = performance.now();
function setPhase(value) { phase = value; experience.dataset.phase = value; }
function setMist(value) { experience.style.setProperty('--mist-opacity', String(value)); }
function fullView() {
  viewer.cameraOrbit = ENTRANCE.final.orbit;
  viewer.cameraTarget = ENTRANCE.final.target;
  viewer.fieldOfView = ENTRANCE.final.fov;
}
function applyPose(pose) {
  viewer.cameraOrbit = `${pose.theta}deg ${pose.phi}deg ${pose.radius}m`;
  viewer.cameraTarget = pose.target.map(value => `${value}m`).join(' ');
  viewer.fieldOfView = `${pose.fov}deg`;
  viewer.jumpCameraToGoal();
}
function modelFailed() {
  setPhase('error'); loading.hidden = true; enter.hidden = true;
  $('#model-error').hidden = false; stage.setAttribute('aria-busy', 'false');
  reset.disabled = true; controls.inert = true; viewer.cameraControls = false;
}
viewer.addEventListener('progress', ({ detail }) => {
  progress.value = detail.totalProgress;
  loadingText.textContent = detail.totalProgress >= 1
    ? '향로를 화면에 준비하고 있습니다.' : '향로를 불러오는 중입니다.';
});
const nextFrame = () => new Promise(resolve => requestAnimationFrame(resolve));
viewer.addEventListener('load', async () => {
  try {
    // Resolve the approved percentage-based full framing before the first visible frame.
    fullView(); await viewer.updateComplete;
    viewer.jumpCameraToGoal(); await nextFrame(); await nextFrame();
    const orbit = viewer.getCameraOrbit(), target = viewer.getCameraTarget();
    finalPose = { theta: orbit.theta * 180 / Math.PI, phi: orbit.phi * 180 / Math.PI,
      radius: orbit.radius, target: [target.x, target.y, target.z], fov: viewer.getFieldOfView() };
    viewer.interpolationDecay = 0;
    applyPose(ENTRANCE.opening); await viewer.updateComplete; await nextFrame();
    if (phase === 'error') return;
    setMist(ENTRANCE.mistOpacity); loading.hidden = true; enter.hidden = false;
    stage.setAttribute('aria-busy', 'false'); setPhase('dawn');
    console.info(`Original GLB ready: ${((performance.now() - startedAt) / 1000).toFixed(2)}s`);
  } catch { modelFailed(); }
});
viewer.addEventListener('error', modelFailed);
function hideHint() { hint.classList.remove('is-visible'); clearTimeout(hintTimer); }
function handoff() {
  if (phase !== 'revealing') return;
  fullView(); viewer.jumpCameraToGoal();
  viewer.interpolationDecay = reducedMotion.matches ? 0 : 50;
  viewer.setAttribute('min-camera-orbit', 'auto 0deg 25%');
  viewer.cameraControls = true; viewer.removeAttribute('tabindex');
  controls.inert = false; reset.disabled = false; setMist(0); setPhase('exploring');
  hint.classList.add('is-visible'); hintTimer = setTimeout(hideHint, ENTRANCE.hintMs);
  // Keyboard focus follows the removed entrance button without moving the page.
  viewer.focus({ preventScroll: true });
}
function reveal() {
  if (phase !== 'dawn') return;
  setPhase('revealing'); enter.hidden = true;
  // Call play synchronously in the entrance click: no awaited camera work first.
  startAudio();
  if (reducedMotion.matches) { handoff(); return; }
  const began = performance.now();
  function frame(now) {
    if (phase !== 'revealing') return;
    const t = Math.min(1, (now - began) / ENTRANCE.durationMs);
    // Quintic smoothstep: slow start, acceleration, then a gentle settle.
    const e = t * t * t * (t * (t * 6 - 15) + 10);
    const lerp = (a, b) => a + (b - a) * e;
    applyPose({ theta: lerp(ENTRANCE.opening.theta, finalPose.theta),
      phi: lerp(ENTRANCE.opening.phi, finalPose.phi),
      radius: lerp(ENTRANCE.opening.radius, finalPose.radius),
      target: ENTRANCE.opening.target.map((v, i) => lerp(v, finalPose.target[i])),
      fov: lerp(ENTRANCE.opening.fov, finalPose.fov) });
    setMist(ENTRANCE.mistOpacity * (1 - e));
    if (t < 1) requestAnimationFrame(frame); else handoff();
  }
  requestAnimationFrame(frame);
}
enter.addEventListener('click', reveal);
viewer.addEventListener('camera-change', ({ detail }) => {
  if (phase === 'exploring' && detail.source === 'user-interaction') hideHint();
});
reset.addEventListener('click', () => {
  if (phase !== 'exploring') return;
  fullView(); hideHint();
  if (reducedMotion.matches) viewer.jumpCameraToGoal();
});
audio.src = ASSET_URLS.audio; audio.volume = 0.25;
function reflectSound() {
  const playing = !audio.paused;
  sound.setAttribute('aria-pressed', String(playing));
  sound.setAttribute('aria-label', playing ? '배경음악 끄기' : '배경음악 켜기');
  sound.title = playing ? '배경음악 끄기' : '배경음악 켜기';
  sound.textContent = playing ? '♫' : '♪';
  audioStatus.textContent = playing ? '배경음악 재생 중' : '배경음악 꺼짐';
}
async function startAudio() {
  sound.disabled = true;
  try { await audio.play(); }
  catch { audioStatus.textContent = '음악을 시작하지 못했습니다. 소리 버튼으로 다시 시도해 주세요.'; }
  finally { sound.disabled = false; }
}
audio.addEventListener('play', reflectSound); audio.addEventListener('pause', reflectSound);
audio.addEventListener('error', () => {
  audio.pause(); audioStatus.textContent = '음악을 불러오지 못했습니다. 연결을 확인해 주세요.';
});
sound.addEventListener('click', () => {
  if (phase !== 'exploring') return;
  if (audio.paused) startAudio(); else audio.pause();
});
try {
  await import('https://unpkg.com/@google/model-viewer@4.1.0/dist/model-viewer.min.js');
  viewer.cameraControls = false; viewer.interpolationDecay = 0; viewer.src = ASSET_URLS.model;
} catch { modelFailed(); }
