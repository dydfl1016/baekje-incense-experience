// CONTENT / POSITION DATA ONLY. All copy is placeholder, not a historical claim.
// Keep the Blender export origin, scale and orientation stable. Tune these values
// after replacing the GLB at the same path; the interaction engine stays reusable.
export const DISCOVERIES = [
  {
    id: 'phoenix-prototype', region: 'phoenix', status: 'prototype',
    anchorPosition: [-0.021, 0.797, 0.029], anchorNormal: [0, 0, 1],
    // Metres: camera-to-anchor AND target-to-anchor gates; hysteresis prevents flicker.
    activationDistance: 2.1, targetDistance: 0.65, exitMargin: 0.15,
    cameraOrbit: { theta: 0, phi: 80, radius: 1.2 },
    cameraTarget: [0, 0.65, 0], fieldOfView: 30, stagingMs: 1600,
    title: '봉황', eyebrow: '발견', shortText: '[설명 내용이 들어갈 자리]',
    contentType: 'PLACEHOLDER', source: '[출처 / 해석 구분 영역]',
    promptText: '여기를 눌러보세요', promptOffset: [17, -8],
    callout: { preferredPlacement: 'bottom-right', offset: [32, 36],
      marginPx: 20, widthPx: 230, bendPx: 22, revealMs: 700,
      hysteresisPx: 60, offscreenPx: 12 },
    signal: { dotPx: 6, hitPx: 44, opacity: 0.7, pulseMs: 3800 },
    textTiming: { eyebrowMs: 0, titleMs: 140, bodyMs: 280, sourceMs: 400 },
  },
];
