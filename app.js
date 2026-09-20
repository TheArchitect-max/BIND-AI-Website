'use strict';
// Decorative website artwork only. No research data or platform implementation.
const ns = 'http://www.w3.org/2000/svg';
const lines = document.getElementById('network-lines');
const nodes = document.getElementById('network-nodes');
if (lines && nodes) {
  const points = Array.from({length: 100}, (_, i) => {
    const z = 1 - 2 * (i + 0.5) / 100;
    const a = i * 2.399963229728653;
    const r = Math.sqrt(1 - z * z);
    const x = r * Math.cos(a), y = r * Math.sin(a);
    return {x: 300 + 222 * x, y: 265 + 205 * z + 25 * y, depth: y};
  });
  function add(parent, tag, attributes) {
    const element = document.createElementNS(ns, tag);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, String(value)));
    parent.appendChild(element);
  }
  points.forEach((p, i) => {
    points.slice(i + 1).forEach(q => {
      if (Math.hypot(p.x - q.x, p.y - q.y) < 82 && Math.abs(p.depth - q.depth) < 0.65) {
        add(lines, 'line', {x1:p.x,y1:p.y,x2:q.x,y2:q.y,stroke:'#92e5bd','stroke-opacity':0.12 + (p.depth + 1) * 0.1,'stroke-width':0.7});
      }
    });
    add(nodes, 'circle', {cx:p.x,cy:p.y,r:1.6 + (p.depth+1)*1.1,fill:'#b0f4cf','fill-opacity':0.35+(p.depth+1)*0.3});
  });
}
