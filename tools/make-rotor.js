// Draws the hero's background line art: a cross-drilled brake rotor (rotates)
// and the caliper + dimension marks (static). Run: node tools/make-rotor.js
const fs = require('fs');
const path = require('path');
const C = 400;
const f = n => +n.toFixed(2);
const pt = (r, deg) => [f(C + r * Math.cos(deg * Math.PI / 180)), f(C + r * Math.sin(deg * Math.PI / 180))];

let rotor = [];
// friction face, hat and bore
[388, 372, 214, 198].forEach(r => rotor.push(`<circle cx="${C}" cy="${C}" r="${r}"/>`));
[150, 58].forEach(r => rotor.push(`<circle cx="${C}" cy="${C}" r="${r}"/>`));
// lug holes
for (let i = 0; i < 5; i++) { const [x, y] = pt(102, i * 72 - 90); rotor.push(`<circle cx="${x}" cy="${y}" r="21"/>`); }
// cross-drilling: three staggered rings
const rings = [[248, 0], [292, 5], [336, 10]];
for (let i = 0; i < 30; i++) rings.forEach(([r, off]) => { const [x, y] = pt(r, i * 12 + off); rotor.push(`<circle cx="${x}" cy="${y}" r="7.5"/>`); });
// curved vanes between the drilled groups
for (let i = 0; i < 30; i++) {
  const a = i * 12 + 7;
  const [x1, y1] = pt(222, a), [x2, y2] = pt(364, a + 9);
  rotor.push(`<path d="M${x1} ${y1} Q${pt(300, a + 2).join(' ')} ${x2} ${y2}"/>`);
}
const rotorSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" fill="none" stroke="#f5efe3" stroke-width="1.6" stroke-linecap="round">${rotor.join('')}</svg>\n`;

// caliper: a band hugging the outer edge from 196deg to 254deg
const arc = (r, a1, a2, sweep) => { const [x, y] = pt(r, a2); return `A${r} ${r} 0 0 ${sweep} ${x} ${y}`; };
const [sx, sy] = pt(412, 196);
const [ix, iy] = pt(300, 254);
const cal = `M${sx} ${sy} ${arc(412, 196, 254, 1)} L${ix} ${iy} ${arc(300, 254, 196, 0)} Z`;
const [px, py] = pt(356, 225);
const [d1x, d1y] = pt(388, 312), [d2x, d2y] = pt(388, 132);
const extra = [
  `<path d="${cal}" stroke-width="2"/>`,
  `<circle cx="${px}" cy="${py}" r="26"/>`,
  `<circle cx="${pt(330, 205)[0]}" cy="${pt(330, 205)[1]}" r="9"/>`,
  `<circle cx="${pt(330, 245)[0]}" cy="${pt(330, 245)[1]}" r="9"/>`,
  // dimension line across the rotor, drafting style
  `<path d="M${C - 388} 828 H${C + 388} M${C - 388} 816 V840 M${C + 388} 816 V840" stroke-width="1.2"/>`,
  `<path d="M${C} ${C} L${d1x} ${d1y}" stroke-dasharray="6 8" stroke-width="1.2"/>`,
  `<text x="${C}" y="868" fill="#f5efe3" stroke="none" font-family="ui-monospace,monospace" font-size="22" text-anchor="middle" letter-spacing="4">Ø 330 · 32 MM VENTED</text>`,
  `<path d="M${C} 4 V40 M${C} 760 V796 M4 ${C} H40 M760 ${C} H796" stroke-width="1"/>`,
];
const calSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -20 800 900" fill="none" stroke="#f5efe3" stroke-width="1.6" stroke-linecap="round">${extra.join('')}</svg>\n`;

const out = path.join(__dirname, '..', 'images');
fs.writeFileSync(path.join(out, 'hero-rotor.svg'), rotorSvg);
fs.writeFileSync(path.join(out, 'hero-caliper.svg'), calSvg);
console.log('rotor', rotorSvg.length, 'bytes; caliper', calSvg.length, 'bytes');
