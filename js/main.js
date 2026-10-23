/* Fam's Automotive: small progressive enhancements. Everything works without this file. */
(function () {
  'use strict';

  // Footer year
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  // Reveal on scroll
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  // Mobile call bar: hidden over the hero (which has its own buttons), shown after it
  var mbar = document.querySelector('.mbar');
  var hero = document.querySelector('.hero, .page-hero');
  if (mbar) {
    var setBar = function (on) {
      mbar.classList.toggle('is-on', on);
      document.documentElement.style.setProperty('--mbar-h', on && innerWidth < 832 ? '72px' : '0px');
    };
    if (hero && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        setBar(!entries[0].isIntersecting);
      }, { threshold: 0.05 }).observe(hero);
    } else {
      setBar(true);
    }
  }

  // Hours: highlight today and say whether the shop is open (shop time, America/Toronto)
  var hoursTable = document.querySelector('[data-hours]');
  if (hoursTable) {
    var now = new Date();
    var parts = {};
    try {
      new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Toronto', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' })
        .formatToParts(now).forEach(function (p) { parts[p.type] = p.value; });
    } catch (err) { parts = null; }
    if (parts) {
      var day = parts.weekday.slice(0, 3);
      var mins = parseInt(parts.hour, 10) * 60 + parseInt(parts.minute, 10);
      var row = hoursTable.querySelector('[data-day="' + day + '"]');
      var status = document.querySelector('[data-open-now]');
      if (row) {
        row.classList.add('is-today');
        var open = row.getAttribute('data-open'), close = row.getAttribute('data-close');
        var toMin = function (t) { var s = t.split(':'); return +s[0] * 60 + +s[1]; };
        var isOpen = !!(open && close && mins >= toMin(open) && mins < toMin(close));
        if (status) {
          status.hidden = false;
          status.setAttribute('data-open', String(isOpen));
          status.textContent = isOpen ? 'Open now, call us' : 'Closed right now, book online and we will call you back';
        }
      }
    }
  }

  // Quote form: inline validation, then send (or fall back to a phone call while there is no endpoint)
  var form = document.querySelector('[data-quote-form]');
  if (form) {
    // Preselect the service when arriving from a "Book" button on the services page
    var wanted = new URLSearchParams(location.search).get('service');
    var select = form.querySelector('select[name="service"]');
    if (wanted && select && select.querySelector('option[value="' + wanted.replace(/[^a-z-]/g, '') + '"]')) select.value = wanted;
    var statusEl = form.querySelector('.form__status');
    var check = function (field) {
      var err = form.querySelector('#' + field.id + '-err');
      var msg = '';
      if (field.validity.valueMissing) msg = 'Please fill this in.';
      else if (field.type === 'tel' && field.value.replace(/\D/g, '').length < 10) msg = 'Please enter a 10-digit phone number.';
      else if (field.validity.typeMismatch) msg = 'That does not look right.';
      field.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (err) err.textContent = msg;
      return !msg;
    };
    form.querySelectorAll('input, select, textarea').forEach(function (f) {
      f.addEventListener('blur', function () { if (f.value) check(f); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var fields = form.querySelectorAll('[required]');
      var firstBad = null;
      fields.forEach(function (f) { if (!check(f) && !firstBad) firstBad = f; });
      if (firstBad) { firstBad.focus(); return; }

      var endpoint = form.getAttribute('action');
      if (!endpoint || endpoint.indexOf('[') === 0) {
        statusEl.textContent = 'Thanks! Online booking is being set up. Please call the shop and we will look after you right away.';
        return;
      }
      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (r) {
          if (!r.ok) throw new Error(r.status);
          form.reset();
          statusEl.textContent = 'Got it. We will call you back within one business day with a price.';
        })
        .catch(function () {
          statusEl.textContent = 'Sorry, that did not send. Please call the shop instead.';
        })
        .then(function () { btn.disabled = false; });
    });
  }
})();
