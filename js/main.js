// Keep these paths stable when replacing the model in a later phase.
export const ASSET_URLS = Object.freeze({
  model: new URL('../assets/model/baekje-incense-burner.glb', import.meta.url).href,
  audio: new URL('../assets/audio/ambient-loop.mp3', import.meta.url).href,
});
const viewer = document.querySelector('#artifact');
const stage = document.querySelector('.stage');
const loading = document.querySelector('#loading');
const progress = document.querySelector('#load-progress');
const loadingText = document.querySelector('#loading-text');
const reset = document.querySelector('#reset-view');
const audio = document.querySelector('#ambient');
const sound = document.querySelector('#sound-toggle');
const audioStatus = document.querySelector('#audio-status');
const startedAt = performance.now();

function modelFailed() {
  loading.hidden = true;
  document.querySelector('#model-error').hidden = false;
  stage.setAttribute('aria-busy', 'false');
  reset.disabled = true;
}
viewer.addEventListener('progress', ({ detail }) => {
  progress.value = detail.totalProgress;
  // Viewer progress includes preparation as well as transfer, not byte accuracy.
  loadingText.textContent = detail.totalProgress >= 1
    ? '향로를 화면에 준비하고 있습니다.' : '향로를 불러오는 중입니다.';
});
viewer.addEventListener('load', () => {
  loading.hidden = true;
  stage.setAttribute('aria-busy', 'false');
  reset.disabled = false;
  console.info(`Original GLB ready: ${((performance.now() - startedAt) / 1000).toFixed(2)}s (transfer + render preparation)`);
});
viewer.addEventListener('error', modelFailed);
reset.addEventListener('click', () => {
  viewer.cameraOrbit = '0deg 75deg 105%';
  viewer.cameraTarget = 'auto auto auto';
  viewer.fieldOfView = '30deg';
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) viewer.jumpCameraToGoal();
});

// No autoplay and no audio requests before the explicit sound button is pressed.
audio.src = ASSET_URLS.audio;
audio.volume = 0.25;
function reflectSound() {
  const playing = !audio.paused;
  sound.setAttribute('aria-pressed', String(playing));
  sound.textContent = playing ? '소리 끄기' : '소리 켜기';
  audioStatus.textContent = playing ? '배경음악 재생 중' : '소리 켜기를 누르면 배경음악이 시작됩니다.';
}
audio.addEventListener('play', reflectSound);
audio.addEventListener('pause', reflectSound);
audio.addEventListener('error', () => {
  audio.pause();
  audioStatus.textContent = '음악을 불러오지 못했습니다. 연결을 확인해 주세요.';
});
sound.addEventListener('click', async () => {
  if (!audio.paused) { audio.pause(); return; }
  sound.disabled = true;
  try { await audio.play(); }
  catch { audioStatus.textContent = '음악을 시작하지 못했습니다. 소리 켜기를 다시 눌러 주세요.'; }
  finally { sound.disabled = false; }
});

// Pin the only runtime dependency. A failed CDN/WebGL/model load has a visible fallback.
try {
  await import('https://unpkg.com/@google/model-viewer@4.1.0/dist/model-viewer.min.js');
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) viewer.interpolationDecay = 0;
  viewer.src = ASSET_URLS.model;
} catch { modelFailed(); }
