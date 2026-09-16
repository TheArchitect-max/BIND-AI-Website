'use strict';
// Presentation-only illustration: deterministic geometry, not simulator output.
const ns = 'http://www.w3.org/2000/svg';
const points = Array.from({length: 100}, (_, i) => {
  const z = 1 - 2 * (i + 0.5) / 100;
  const a = i * 2.399963229728653;
  const r = Math.sqrt(1 - z * z);
  const x = r * Math.cos(a), y = r * Math.sin(a);
  return {x: 300 + 222 * x, y: 265 + 205 * z + 25 * y, depth: y};
});
const lines = document.getElementById('network-lines');
const nodes = document.getElementById('network-nodes');
points.forEach((p, i) => {
  points.slice(i + 1).forEach(q => {
    const distance = Math.hypot(p.x - q.x, p.y - q.y);
    if (distance < 82 && Math.abs(p.depth - q.depth) < 0.65) {
      const line = document.createElementNS(ns, 'line');
      Object.entries({x1:p.x,y1:p.y,x2:q.x,y2:q.y,stroke:'#92e5bd','stroke-opacity':0.12 + (p.depth + 1) * 0.1,'stroke-width':0.7}).forEach(([k,v]) => line.setAttribute(k,v));
      lines.appendChild(line);
    }
  });
  const dot = document.createElementNS(ns, 'circle');
  Object.entries({cx:p.x,cy:p.y,r:1.6 + (p.depth+1)*1.1,fill:'#b0f4cf','fill-opacity':0.35+(p.depth+1)*0.3}).forEach(([k,v]) => dot.setAttribute(k,v));
  nodes.appendChild(dot);
});
// Values transcribed from evidence/v0_9_validation_summary.json.
const modes = {
  hierarchy:{cost:'6.6600',hops:'1',path:'s1 → c1',note:'Hierarchy-aware routing selects the direct connection from s1 to c1.'},
  null:{cost:'4.2905',hops:'4',path:'s1 → s2 → a1 → a2 → c1',note:'The hierarchy-null control follows the four-hop route under its own cost configuration.'},
  blocked:{cost:'7.2905',hops:'4',path:'s1 → s2 → a1 → a2 → c1',note:'Blocking s1 → c1 forces a fallback route. Recorded cost increases by 0.6305 from the hierarchy-aware baseline.'}
};
document.querySelectorAll('[data-mode]').forEach(button => button.addEventListener('click', () => {
  const mode = button.dataset.mode, value = modes[mode];
  document.querySelectorAll('[data-mode]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  for (const key of ['cost','hops','path']) document.getElementById('route-' + key).textContent = value[key];
  document.getElementById('condition-note').textContent = value.note;
  document.querySelector('.direct').classList.toggle('selected', mode === 'hierarchy');
  document.querySelector('.direct').classList.toggle('blocked', mode === 'blocked');
  document.querySelector('.fallback').classList.toggle('selected', mode !== 'hierarchy');
  document.getElementById('route-svg').setAttribute('aria-label', 'Recorded route: ' + value.path + '. Cost ' + value.cost + '.');
}));
