// Reusable Discovery UI. No model/material changes and no entrance camera ownership.
export function cameraPosition(orbit, target) {
  const horizontal = orbit.radius * Math.sin(orbit.phi);
  return [target.x + horizontal * Math.sin(orbit.theta),
    target.y + orbit.radius * Math.cos(orbit.phi),
    target.z + horizontal * Math.cos(orbit.theta)];
}
const distance = (a, b) => Math.hypot(...a.map((v, i) => v - b[i]));
export function isNearDiscovery(item, orbit, target, wasAvailable = false) {
  const margin = wasAvailable ? item.exitMargin : 0;
  return distance(cameraPosition(orbit, target), item.anchorPosition) <= item.activationDistance + margin
    && distance([target.x, target.y, target.z], item.anchorPosition) <= item.targetDistance + margin;
}
const positionString = values => values.map(v => `${v}m`).join(' ');

export function createDiscoveryEngine({ viewer, stage, panel, items, isExploring, reducedMotion, onSelect }) {
  let active = null, generation = 0, animationId = null, enabled = false;
  const records = items.map(item => {
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'discovery-signal';
    button.slot = `hotspot-${item.id}`; button.dataset.position = positionString(item.anchorPosition);
    button.dataset.normal = item.anchorNormal.join(' '); button.dataset.visibilityAttribute = 'visible';
    button.setAttribute('aria-label', `${item.title} 살펴보기`);
    button.setAttribute('aria-controls', panel.id);
    button.setAttribute('aria-expanded', 'false');
    button.style.setProperty('--signal-dot', `${item.signal.dotPx}px`);
    button.style.setProperty('--signal-hit', `${item.signal.hitPx}px`);
    button.style.setProperty('--signal-opacity', item.signal.opacity);
    button.style.setProperty('--signal-pulse', `${item.signal.pulseMs}ms`);
    button.disabled = true; button.tabIndex = -1;
    const record = { item, button, state: 'hidden', visited: false, suppressed: false };
    button.dataset.state = record.state;
    // Signal input must never rotate the model or immediately dismiss its own selection.
    button.addEventListener('pointerdown', event => event.stopPropagation());
    button.addEventListener('click', event => { event.stopPropagation(); select(record); });
    button.addEventListener('hotspot-visibility', refresh);
    viewer.append(button); return record;
  });
  function setState(record, state) {
    record.state = state; record.button.dataset.state = state;
    record.button.disabled = state !== 'available';
    record.button.tabIndex = state === 'available' ? 0 : -1;
  }
  function refresh() {
    const ready = enabled && isExploring();
    for (const record of records) {
      if (!ready) { if (record !== active) setState(record, 'hidden'); continue; }
      if (record === active) continue;
      const near = isNearDiscovery(record.item, viewer.getCameraOrbit(), viewer.getCameraTarget(), record.state === 'available');
      if (!near) record.suppressed = false; // Revisit only after leaving the region.
      const spot = viewer.queryHotspot(record.button.slot);
      const size = viewer.getBoundingClientRect();
      const p = spot?.canvasPosition;
      const onscreen = p && p.x >= 22 && p.y >= 22 && p.x <= size.width - 22 && p.y <= size.height - 22;
      const facing = record.button.hasAttribute('data-visible');
      setState(record, near && onscreen && facing && !record.suppressed ? 'available' : 'hidden');
    }
  }
  function readPose() {
    const o = viewer.getCameraOrbit(), t = viewer.getCameraTarget();
    return { theta: o.theta * 180 / Math.PI, phi: o.phi * 180 / Math.PI,
      radius: o.radius, target: [t.x, t.y, t.z], fov: viewer.getFieldOfView() };
  }
  function writePose(pose) {
    viewer.cameraOrbit = `${pose.theta}deg ${pose.phi}deg ${pose.radius}m`;
    viewer.cameraTarget = positionString(pose.target); viewer.fieldOfView = `${pose.fov}deg`;
  }
  function showText(record) {
    record.visited = true; setState(record, 'discovered');
    const item = record.item;
    panel.dataset.placement = item.textPlacement;
    for (const [key, text] of Object.entries({ eyebrow: item.eyebrow, title: item.title, body: item.shortText, source: item.source })) {
      const element = panel.querySelector(`[data-copy="${key}"]`);
      element.textContent = text; element.style.setProperty('--text-delay', `${item.textTiming[`${key}Ms`]}ms`);
    }
    stage.dataset.discovery = 'discovered';
    panel.hidden = false; panel.classList.add('is-visible');
    record.button.setAttribute('aria-expanded', 'true');
    viewer.interpolationDecay = reducedMotion.matches ? 0 : 50;
    // Focus leaves the now-hidden signal; keyboard controls remain immediately usable.
    viewer.focus({ preventScroll: true });
  }
  function select(record) {
    if (!enabled || !isExploring() || record.state !== 'available') return;
    dismiss(); active = record; setState(record, 'focused'); onSelect?.();
    stage.dataset.discovery = 'focused'; stage.dataset.textPlacement = record.item.textPlacement;
    stage.style.setProperty('--discovery-reserve', `${record.item.textReservePx}px`);
    const token = ++generation, from = readPose(), item = record.item;
    const goal = { ...item.cameraOrbit, target: item.cameraTarget, fov: item.fieldOfView };
    // Choose the shortest orbit to the configured angle.
    goal.theta = from.theta + ((goal.theta - from.theta + 540) % 360 + 360) % 360 - 180;
    viewer.interpolationDecay = 0;
    // Leave cameraControls ON. Pointer/wheel/key input cancels the staging before viewer handling.
    if (reducedMotion.matches) {
      writePose(goal); viewer.updateComplete.then(() => {
        if (generation !== token) return;
        viewer.jumpCameraToGoal(); showText(record);
      }); return;
    }
    const began = performance.now();
    async function frame(now) {
      if (generation !== token || !isExploring()) return;
      const t = Math.min(1, (now - began) / item.stagingMs), e = t * t * (3 - 2 * t);
      const mix = (a, b) => a + (b - a) * e;
      writePose({ theta: mix(from.theta, goal.theta), phi: mix(from.phi, goal.phi),
        radius: mix(from.radius, goal.radius), target: from.target.map((v, i) => mix(v, goal.target[i])),
        fov: mix(from.fov, goal.fov) });
      if (t < 1) animationId = requestAnimationFrame(frame);
      else {
        await viewer.updateComplete;
        if (generation !== token) return;
        viewer.jumpCameraToGoal(); showText(record);
      }
    }
    animationId = requestAnimationFrame(frame);
  }
  function dismiss() {
    ++generation; if (animationId !== null) cancelAnimationFrame(animationId); animationId = null;
    panel.classList.remove('is-visible'); panel.hidden = true;
    delete stage.dataset.discovery;
    if (active) {
      // Freeze only a running staging move at the visible pose; never force a return view.
      if (active.state === 'focused') writePose(readPose());
      active.suppressed = true; active.button.setAttribute('aria-expanded', 'false');
      setState(active, 'hidden'); active = null;
      viewer.interpolationDecay = reducedMotion.matches ? 0 : 50;
    }
  }
  function userInput(event) {
    if (event.composedPath().some(node => records.some(record => node === record.button))) return;
    if (event.type === 'keydown' && !['Escape', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', '+', '-', '=', 'PageUp', 'PageDown'].includes(event.key)) return;
    if (active) dismiss(); // No preventDefault / stopPropagation: the gesture goes to the viewer.
  }
  for (const type of ['pointerdown', 'wheel', 'keydown']) viewer.addEventListener(type, userInput, { capture: true, passive: type === 'wheel' });
  viewer.addEventListener('camera-change', event => {
    if (active && event.detail.source === 'user-interaction') dismiss();
    refresh();
  });
  panel.querySelector('button').addEventListener('click', () => { dismiss(); viewer.focus({ preventScroll: true }); });
  panel.addEventListener('keydown', event => {
    if (event.key === 'Escape') { dismiss(); viewer.focus({ preventScroll: true }); }
  });
  // Pan/zoom/viewport changes all reevaluate the same small rules; no continuous polling.
  const observer = new ResizeObserver(refresh); observer.observe(stage);
  return {
    enable() { enabled = true; refresh(); },
    disable() { enabled = false; dismiss(); records.forEach(record => setState(record, 'hidden')); },
    dismiss,
  };
}
