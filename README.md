# Fam's Automotive Inc. website

Static site, no build step. Preview scope: home (hero, promise, services, reviews, how it works), services, contact.

- `index.html`, `services.html`, `contact.html`: each page carries its own meta, Open Graph and JSON-LD (AutoRepair, WebSite/WebPage, BreadcrumbList, OfferCatalog, FAQPage, ContactPage).
- `css/styles.css`, `js/main.js` (reveal on scroll, mobile call bar, open-now badge, quote form). Everything works without JS.
- `fonts/`: self-hosted Archivo (variable weight and width) and IBM Plex Mono 400/500, latin subset.
- Header, mobile menu and footer are repeated in each page: change all three when editing them.
- `images/og-fams-automotive.jpg`, `images/apple-touch-icon.png`: rendered by `tools/make-share-images.js`.

Local preview: `python3 -m http.server 8765` then open http://localhost:8765.

Before launch: work through TO-CONFIRM.md.

Cache: css/ and js/ are linked with ?v=YYYYMMDD. Bump that number in all three pages whenever styles.css or main.js changes, or returning visitors can get new HTML with an old stylesheet.
