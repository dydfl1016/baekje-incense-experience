// Screen-space placement only. Four candidates plus a score threshold prevent jitter.
export function placeCallout(anchor, viewport, box, config, previous = null) {
  const m = config.marginPx;
  const clamp = (v, low, high) => Math.max(low, Math.min(v, Math.max(low, high)));
  const candidates = ['top-left', 'top-right', 'bottom-left', 'bottom-right'].map(side => {
    const right = side.endsWith('right'), bottom = side.startsWith('bottom');
    const x = clamp(anchor.x + (right ? config.offset[0] : -box.width - config.offset[0]), m, viewport.width - box.width - m);
    const y = clamp(anchor.y + (bottom ? config.offset[1] : -box.height - config.offset[1]), m, viewport.height - box.height - m);
    const dx = Math.max(x - anchor.x, 0, anchor.x - x - box.width);
    const dy = Math.max(y - anchor.y, 0, anchor.y - y - box.height);
    const overlap = Math.hypot(dx, dy) < config.bendPx;
    const h = config.hysteresisPx;
    const desiredRight = previous ? anchor.x < viewport.width / 2 + (previous.side.endsWith('right') ? h : -h) : anchor.x < viewport.width / 2;
    const desiredBottom = previous ? anchor.y < viewport.height / 2 + (previous.side.startsWith('bottom') ? h : -h) : anchor.y < viewport.height / 2;
    const score = (overlap ? 1000 : 0) + (right !== desiredRight ? 90 : 0)
      + (bottom !== desiredBottom ? 90 : 0) + (side !== config.preferredPlacement ? 8 : 0);
    return { side, x, y, score };
  });
  const best = candidates.reduce((a, b) => a.score <= b.score ? a : b);
  const current = candidates.find(c => c.side === previous?.side);
  return current && current.score <= best.score + config.hysteresisPx ? current : best;
}
