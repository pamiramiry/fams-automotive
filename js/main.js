/* Fam's Automotive: small progressive enhancements. Everything works without this file. */
(function () {
  'use strict';
  var root = document.documentElement;
  var calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var clamp = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };
  var easeOut = function (t) { return 1 - Math.pow(1 - t, 3); };
  // Scroll-triggered hidden states in the CSS only apply once this class is on
  root.classList.add('motion');

  // Footer year
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  // Mobile menu
  var menuBtn = document.querySelector('.menu-btn');
  var menu = document.getElementById('menu');
  if (menuBtn && menu) {
    var setMenu = function (open) {
      root.classList.toggle('nav-open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.querySelector('.menu-btn__text').textContent = open ? 'Close' : 'Menu';
      if (open) menu.querySelector('a').focus();
    };
    menuBtn.addEventListener('click', function () { setMenu(!root.classList.contains('nav-open')); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    addEventListener('keydown', function (e) { if (e.key === 'Escape' && root.classList.contains('nav-open')) { setMenu(false); menuBtn.focus(); } });
  }

  // Headings: split into the lines the browser actually set, let each rise from behind its edge,
  // then put the plain text back so the heading reflows normally on resize.
  var esc = function (s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;'); };
  var splitRise = function (el) {
    if (calm) { el.classList.add('split'); return; }
    var original = el.innerHTML;
    var words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map(function (w) { return '<span class="w">' + esc(w) + '</span>'; }).join(' ');
    var lines = [], top = null;
    el.querySelectorAll('.w').forEach(function (w) {
      if (w.offsetTop !== top) { lines.push([]); top = w.offsetTop; }
      lines[lines.length - 1].push(w.textContent);
    });
    el.innerHTML = lines.map(function (l, i) {
      return '<span class="line"><span style="--d:' + (i * 90 - 150) + '">' + esc(l.join(' ')) + '</span></span>';
    }).join(' ');
    el.classList.add('split');
    setTimeout(function () { el.innerHTML = original; }, 1300 + lines.length * 90);
  };

  // Scroll-triggered motion
  var ruled = '.process__steps li, .contact__block, .svc__quote, .svc-list, .faq, .quotes, .foot, .promises';
  document.querySelectorAll('.svc-list, .faq, .quotes, .foot, .promises').forEach(function (list) {
    Array.prototype.forEach.call(list.children, function (child, i) { child.style.setProperty('--c', i); });
  });
  var headings = document.querySelectorAll('[data-rise]');
  var watched = document.querySelectorAll('.reveal, .wordmark, ' + ruled);
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        if (e.target.hasAttribute('data-rise')) splitRise(e.target);
        else e.target.classList.add('is-in');
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0 });
    watched.forEach(function (el) { io.observe(el); });
    headings.forEach(function (el) { io.observe(el); });
  } else {
    watched.forEach(function (el) { el.classList.add('is-in'); });
    headings.forEach(function (el) { el.classList.add('split'); });
  }

  // One scroll loop: solid header, light across the hero, the closing headline opening up
  var header = document.querySelector('.site-header');
  var hero = document.querySelector('.hero, .page-hero');
  var closingTitle = document.querySelector('.closing__grid h2');
  var ticking = false;
  var frame = function () {
    ticking = false;
    var y = scrollY, vh = innerHeight;
    if (header) header.classList.toggle('is-scrolled', y > 24);
    if (calm) return;
    if (hero && y < hero.offsetHeight) hero.style.setProperty('--sp', (y / hero.offsetHeight).toFixed(4));
    if (closingTitle) {
      var top = closingTitle.getBoundingClientRect().top;
      if (top < vh * 1.1 && top > -vh) {
        var p = easeOut(clamp((vh - top) / (vh * 0.65)));
        closingTitle.style.setProperty('--w', (72 + 53 * p).toFixed(1) + '%');
      }
    }
  };
  var onScroll = function () { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
  frame();
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);

  // Mobile call bar: hidden over the hero (which has its own buttons), shown after it
  var mbar = document.querySelector('.mbar');
  if (mbar) {
    var setBar = function (on) {
      mbar.classList.toggle('is-on', on);
      root.style.setProperty('--mbar-h', on && innerWidth < 960 ? '60px' : '0px');
    };
    if (hero && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) { setBar(!entries[0].isIntersecting); }, { threshold: 0 }).observe(hero);
    } else {
      setBar(true);
    }
  }

  // Services page: one underline that slides to the jump link for the section in view
  var jumpWrap = document.querySelector('.jump__in');
  var jump = document.querySelectorAll('.jump a[href^="#"]');
  if (jumpWrap && jump.length && 'IntersectionObserver' in window) {
    var bar = document.createElement('span');
    bar.className = 'jump__bar';
    bar.setAttribute('aria-hidden', 'true');
    jumpWrap.appendChild(bar);
    var current = null;
    var moveBar = function (a) {
      if (!a) { bar.style.transform = 'translateX(0) scaleX(0)'; return; }
      bar.style.transform = 'translateX(' + a.offsetLeft + 'px) scaleX(' + (a.offsetWidth / 100) + ')';
      var target = a.offsetLeft - (jumpWrap.clientWidth - a.offsetWidth) / 2;
      jumpWrap.scrollTo({ left: target, behavior: calm ? 'auto' : 'smooth' });
    };
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        jump.forEach(function (a) {
          var on = a.getAttribute('href') === '#' + e.target.id;
          a.classList.toggle('is-active', on);
          if (on) current = a;
        });
        moveBar(current);
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    jump.forEach(function (a) {
      var el = document.getElementById(a.getAttribute('href').slice(1));
      if (el) spy.observe(el);
    });
    addEventListener('resize', function () { moveBar(current); });
  }

  // Hours: highlight today and say whether the shop is open (shop time, America/Toronto)
  var hoursTable = document.querySelector('[data-hours]');
  if (hoursTable) {
    var parts = {};
    try {
      new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Toronto', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' })
        .formatToParts(new Date()).forEach(function (p) { parts[p.type] = p.value; });
    } catch (err) { parts = null; }
    if (parts && parts.weekday) {
      var mins = parseInt(parts.hour, 10) * 60 + parseInt(parts.minute, 10);
      var row = hoursTable.querySelector('[data-day="' + parts.weekday.slice(0, 3) + '"]');
      var status = document.querySelector('[data-open-now]');
      if (row) {
        row.classList.add('is-today');
        var open = row.getAttribute('data-open'), close = row.getAttribute('data-close');
        var toMin = function (t) { var s = t.split(':'); return +s[0] * 60 + +s[1]; };
        var isOpen = !!(open && close && mins >= toMin(open) && mins < toMin(close));
        if (status) {
          status.hidden = false;
          status.setAttribute('data-open', String(isOpen));
          status.textContent = isOpen ? 'Open now' : 'Closed now. Request a quote and we’ll call you back.';
        }
      }
    }
  }

  // Quote form: inline validation, then send (or fall back to a phone call while there is no endpoint)
  var form = document.querySelector('[data-quote-form]');
  if (form) {
    // Preselect the service when arriving from a "Book" link on the services page
    var wanted = new URLSearchParams(location.search).get('service');
    var select = form.querySelector('select[name="service"]');
    if (wanted && select && select.querySelector('option[value="' + wanted.replace(/[^a-z-]/g, '') + '"]')) select.value = wanted;

    var statusEl = form.querySelector('.form__status');
    var check = function (field) {
      var err = form.querySelector('#' + field.id + '-err');
      var msg = '';
      if (field.validity.valueMissing) msg = 'Please fill this in.';
      else if (field.type === 'tel' && field.value.replace(/\D/g, '').length < 10) msg = 'Please enter a 10-digit phone number.';
      field.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (err) err.textContent = msg;
      return !msg;
    };
    form.querySelectorAll('input, select, textarea').forEach(function (f) {
      f.addEventListener('blur', function () { if (f.value) check(f); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstBad = null;
      form.querySelectorAll('[required]').forEach(function (f) { if (!check(f) && !firstBad) firstBad = f; });
      if (firstBad) { firstBad.focus(); return; }

      var endpoint = form.getAttribute('action');
      if (!endpoint || endpoint.charAt(0) === '[') {
        statusEl.textContent = 'Thanks. Online requests are being set up. Please call the shop and we’ll look after you right away.';
        return;
      }
      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (r) {
          if (!r.ok) throw new Error(r.status);
          form.reset();
          statusEl.textContent = 'Received. We’ll call you back within one business day with a price.';
        })
        .catch(function () { statusEl.textContent = 'Sorry, that didn’t send. Please call the shop instead.'; })
        .then(function () { btn.disabled = false; });
    });
  }
})();
