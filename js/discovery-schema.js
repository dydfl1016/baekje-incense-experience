// Runtime admission only. Draft slots never create DOM or enter camera/proximity logic.
const vector = v => Array.isArray(v) && v.length === 3 && v.every(Number.isFinite);
const positive = v => Number.isFinite(v) && v > 0;
const nonnegative = v => Number.isFinite(v) && v >= 0;
const pair = v => Array.isArray(v) && v.length === 2 && v.every(Number.isFinite);
const copy = v => typeof v === 'string' && v.trim().length > 0;
export function isRenderableDiscovery(item) {
  if (!item || item.enabled !== true || !['prototype', 'ready'].includes(item.status)) return false;
  const o = item.cameraOrbit, c = item.callout, s = item.signal, t = item.textTiming;
  return !!(copy(item.id) && vector(item.anchorPosition) && vector(item.anchorNormal)
    && item.anchorNormal.some(v => v !== 0)
    && positive(item.activationDistance) && positive(item.targetDistance) && nonnegative(item.exitMargin)
    && o && Number.isFinite(o.theta) && Number.isFinite(o.phi) && o.phi >= 0 && o.phi <= 180 && positive(o.radius)
    && vector(item.cameraTarget) && positive(item.fieldOfView) && item.fieldOfView < 180 && nonnegative(item.stagingMs)
    && copy(item.title) && copy(item.shortText)
    && ['eyebrow', 'source'].every(key => item[key] == null || typeof item[key] === 'string')
    && pair(item.promptOffset) && (item.promptText == null || typeof item.promptText === 'string')
    && c && ['top-left', 'top-right', 'bottom-left', 'bottom-right'].includes(c.preferredPlacement)
    && pair(c.offset) && ['marginPx', 'bendPx', 'revealMs', 'hysteresisPx', 'offscreenPx'].every(key => nonnegative(c[key])) && positive(c.widthPx)
    && s && positive(s.dotPx) && positive(s.hitPx) && positive(s.pulseMs) && nonnegative(s.opacity) && s.opacity <= 1
    && t && ['eyebrowMs', 'titleMs', 'bodyMs', 'sourceMs'].every(key => nonnegative(t[key])));
}
