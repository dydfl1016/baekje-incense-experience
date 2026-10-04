import assert from 'node:assert/strict';
import { DISCOVERIES, CONTENT_TYPES } from '../js/discoveries.js';
import { isRenderableDiscovery } from '../js/discovery-schema.js';
assert.equal(DISCOVERIES.length, 21);
assert.equal(new Set(DISCOVERIES.map(d => d.id)).size, 21);
assert.deepEqual(DISCOVERIES.filter(d => d.level === 1).map(d => d.id), ['phoenix', 'mountain', 'lotus', 'dragon']);
for (const entry of DISCOVERIES.filter(d => d.level === 2)) {
  const parent = DISCOVERIES.find(d => d.id === entry.parentId);
  assert.ok(parent); assert.equal(entry.level, parent.level + 1); assert.equal(entry.region, parent.region);
}
assert.deepEqual(CONTENT_TYPES, ['FACT', 'INTERPRETATION', 'QUESTION']);
assert.deepEqual(DISCOVERIES.filter(isRenderableDiscovery).map(d => d.id), ['phoenix']);
for (const entry of DISCOVERIES.slice(1)) {
  for (const key of ['anchorPosition', 'cameraOrbit', 'cameraTarget', 'title', 'shortText', 'source', 'contentType']) assert.equal(entry[key], null);
  assert.equal(isRenderableDiscovery({ ...entry, enabled: true, status: 'ready' }), false);
}
for (const changes of [{anchorPosition:null}, {cameraTarget:[NaN,0,0]}, {cameraOrbit:null}, {title:null}, {shortText:''}, {callout:null}, {signal:null}, {enabled:false}]) {
  assert.equal(isRenderableDiscovery({...DISCOVERIES[0], ...changes}), false);
}
console.log('PASS hierarchy, empty authoring fields, one live prototype, incomplete geometry/content admission');
