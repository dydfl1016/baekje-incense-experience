// CONTENT / POSITION DATA ONLY. All copy is placeholder, not a historical claim.
// Keep the Blender export origin, scale and orientation stable. Tune these values
// after replacing the GLB at the same path; the interaction engine stays reusable.
export const DISCOVERIES = [
  {
    id: 'phoenix', parentId: null, level: 1, region: 'phoenix', label: '봉황',
    status: 'prototype', enabled: true,
    geometryStatus: 'prototype', contentStatus: 'prototype',
    // GEOMETRY: coordinates and camera framing.
    anchorPosition: [-0.021, 0.797, 0.029], anchorNormal: [0, 0, 1],
    // Metres: camera-to-anchor AND target-to-anchor gates; hysteresis prevents flicker.
    activationDistance: 2.1, targetDistance: 0.65, exitMargin: 0.15,
    cameraOrbit: { theta: 0, phi: 80, radius: 1.2 },
    cameraTarget: [0, 0.65, 0], fieldOfView: 30, stagingMs: 1600,
    // CONTENT: explicit prototype placeholders only.
    title: '봉황', eyebrow: '발견', shortText: '[설명 내용이 들어갈 자리]',
    contentType: 'PLACEHOLDER', source: '[출처 / 해석 구분 영역]',
    // PRESENTATION: one shared spatial callout language.
    promptText: '여기를 눌러보세요', promptOffset: [17, -8],
    callout: { preferredPlacement: 'bottom-right', offset: [32, 36],
      marginPx: 20, widthPx: 230, bendPx: 22, revealMs: 700,
      hysteresisPx: 60, offscreenPx: 12 },
    signal: { dotPx: 6, hitPx: 44, opacity: 0.7, pulseMs: 3800 },
    textTiming: { eyebrowMs: 0, titleMs: 140, bodyMs: 280, sourceMs: 400 },
  },
  emptySlot('mountain', null, 'mountain', '산악세계'),
  emptySlot('lotus', null, 'lotus', '연꽃'),
  emptySlot('dragon', null, 'dragon', '용'),
  emptySlot('phoenix.form', 'phoenix', 'phoenix', '형태'),
  emptySlot('phoenix.jewel', 'phoenix', 'phoenix', '장식 요소'),
  emptySlot('phoenix.wings', 'phoenix', 'phoenix', '날개'),
  emptySlot('phoenix.tail', 'phoenix', 'phoenix', '꼬리'),
  emptySlot('mountain.figures', 'mountain', 'mountain', '인물'),
  emptySlot('mountain.musicians', 'mountain', 'mountain', '악기 연주 인물'),
  emptySlot('mountain.animals', 'mountain', 'mountain', '동물'),
  emptySlot('mountain.vegetation', 'mountain', 'mountain', '식물'),
  emptySlot('mountain.peaks', 'mountain', 'mountain', '봉우리'),
  emptySlot('mountain.smoke_openings', 'mountain', 'mountain', '개구부'),
  emptySlot('lotus.petals', 'lotus', 'lotus', '연꽃잎'),
  emptySlot('lotus.form', 'lotus', 'lotus', '형태'),
  emptySlot('lotus.connection', 'lotus', 'lotus', '연결부'),
  emptySlot('dragon.head', 'dragon', 'dragon', '머리'),
  emptySlot('dragon.body', 'dragon', 'dragon', '몸'),
  emptySlot('dragon.feet', 'dragon', 'dragon', '발'),
  emptySlot('dragon.supporting_posture', 'dragon', 'dragon', '받치는 자세'),
];

// Internal labels organize shelves; they are never a fallback for published copy.
// Flat parent links allow deeper levels later without a recursive runtime today.
function emptySlot(id, parentId, region, label) {
  return {
    id, parentId, level: parentId ? 2 : 1, region, label,
    enabled: false, status: 'draft',
    geometryStatus: 'needs-coordinates', contentStatus: 'needs-research',
    // GEOMETRY — deliberately unknown, never defaulted to the origin.
    anchorPosition: null, anchorNormal: null, activationDistance: null,
    targetDistance: null, exitMargin: null, cameraOrbit: null,
    cameraTarget: null, fieldOfView: null, stagingMs: null,
    // CONTENT — no historical claims.
    title: null, eyebrow: null, shortText: null, source: null, contentType: null,
    // PRESENTATION — inherits the approved grammar once authored.
    promptText: null, promptOffset: null, callout: null, signal: null, textTiming: null,
  };
}

// Authoring vocabulary, never displayed by the prototype UI.
export const CONTENT_TYPES = Object.freeze(['FACT', 'INTERPRETATION', 'QUESTION']);

