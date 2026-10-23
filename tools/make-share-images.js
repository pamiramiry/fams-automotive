// Renders images/og-fams-automotive.jpg (1200x630) and images/apple-touch-icon.png (180x180)
// with the site's own fonts. Run from the repo root with a local server on :8765:
//   python3 -m http.server 8765 & node tools/make-share-images.js
const { chromium } = require('playwright');
const css = '<link rel="stylesheet" href="http://localhost:8765/css/styles.css">';
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
  await p.goto('http://localhost:8765/index.html');
  await p.setContent(`<html><head>${css}<style>
    body{margin:0;padding:0;background:var(--ink)}
    .og{position:relative;isolation:isolate;overflow:hidden;width:1200px;height:630px;color:var(--bone);display:grid;grid-template-rows:auto 1fr auto;padding:56px 72px}
    .og .hero__sheen{animation:none;transform:translateX(-4%)}
    .og h1{align-self:center;font-size:104px;max-width:none}
    .og .row{display:flex;justify-content:space-between;border-top:1px solid var(--line-dark);padding-top:22px;color:var(--stone-dark)}
  </style></head><body><div class="og"><div class="hero__bg"><div class="hero__sheen"></div><div class="hero__sheen hero__sheen--warm"></div></div>
  <span class="brand"><span class="brand__mark"></span><span class="brand__name">Fam's Automotive</span></span>
  <h1 class="display">Honest auto<br>repair in<br>Mississauga</h1>
  <div class="row label"><span>Family-owned</span><span>Quote before any work</span><span>No upselling</span></div></div></body></html>`, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: 'images/og-fams-automotive.jpg', type: 'jpeg', quality: 88 });
  await p.setViewportSize({ width: 180, height: 180 });
  await p.setContent(`<html><head>${css}</head><body style="margin:0;padding:0;width:180px;height:180px;background:#0d0e0d;display:grid;place-items:center;position:relative">
    <span class="display" style="color:#ecebe5;font-size:96px;line-height:1;margin-top:8px">F</span>
    <span style="position:absolute;right:40px;bottom:44px;width:16px;height:16px;background:#d8402a"></span></body></html>`, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: 'images/apple-touch-icon.png' });
  await b.close();
})();
