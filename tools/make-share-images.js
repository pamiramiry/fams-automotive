// Renders images/og-fams-automotive.jpg (1200x630) and images/apple-touch-icon.png (180x180)
// from the site's own fonts and art. Run from the repo root with a local server on :8765:
//   python3 -m http.server 8765 & node tools/make-share-images.js
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
  await p.goto('http://localhost:8765/index.html');
  await p.setContent(`<html><head><link rel="stylesheet" href="http://localhost:8765/css/styles.css"><style>
    body{margin:0;width:1200px;height:630px;padding:0}
    .og{position:relative;isolation:isolate;overflow:hidden;width:1200px;height:630px;background:var(--pine-900);color:var(--cream);display:flex;flex-direction:column;justify-content:center;padding:0 90px}
    .og .hero__art{right:-260px;bottom:-330px;width:820px;opacity:.12}
    .og h1{font-size:92px;line-height:.98;letter-spacing:-.035em;max-width:820px}
    .og h1 em{font-family:var(--serif);font-style:italic;font-weight:400;color:var(--tomato)}
    .og p{margin-top:28px;font-size:28px;color:rgba(245,239,227,.8)}
    .og .brand{position:absolute;top:56px;left:90px}
  </style></head><body><div class="og"><div class="hero__bg"><div class="hero__grid"></div><div class="hero__art"><img src="http://localhost:8765/images/hero-rotor.svg"><img src="http://localhost:8765/images/hero-caliper.svg"></div></div>
  <span class="brand"><span class="brand__fam" style="font-size:44px">Fam's</span><span class="brand__auto" style="font-size:15px">Automotive</span></span>
  <h1>Auto repair you can <em>actually</em> trust.</h1><p>Family-owned · Mississauga · Honest quotes, no upselling</p></div></body></html>`, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: 'images/og-fams-automotive.jpg', type: 'jpeg', quality: 86 });
  await p.setViewportSize({ width: 180, height: 180 });
  await p.setContent(`<html><head><link rel="stylesheet" href="http://localhost:8765/css/styles.css"></head><body style="margin:0;padding:0;background:#0d1c17;width:180px;height:180px;display:grid;place-items:center"><span style="font:italic 400 120px/1 var(--serif);color:#f5efe3;margin-top:-6px">F<span style="color:#f2643f">.</span></span></body></html>`, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: 'images/apple-touch-icon.png' });
  await b.close();
})();
