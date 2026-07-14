/* ============================================================
   Norte Capital — shared behaviour
   1. Market ribbon: índices ilustrativos. El label es HONESTO:
      dice "Datos ilustrativos".
   2. Mobile menu (burger) — works on every page.
   3. Reveal-on-scroll.
   4. Barra CTA fija en móvil.
   5. Suscripción a Insights+ (Brevo).
   ============================================================ */

/* ---- 1. Market ribbon ---- */
(function () {
  var ribbon = document.getElementById('ribbon');
  if (!ribbon) return;

  // [symbol, price, dir]
  var items = [
    ['IBEX 35', '11.842', 'up'],
    ['EURO STOXX 50', '5.318', 'up'],
    ['ORO', '2.214 €', 'up'],
    ['S&P 500', '5.604', 'up'],
    ['EUR/USD', '1,084', 'down'],
    ['NÁSDAQ', '18.420', 'up']
  ];

  var color = function (d) { return d === 'up' ? 'var(--forest-bright)' : '#d8a07e'; };
  var arrow = function (d) { return d === 'up' ? '▲' : '▼'; };
  var cell = function (it) {
    return '<span style="display:inline-flex;align-items:baseline;gap:.5rem;margin:0 1.5rem;white-space:nowrap;flex-shrink:0">' +
      '<span class="mono-label" style="font-size:.72rem;color:var(--cream)">' + it[0] + '</span>' +
      '<span class="tnum" style="font-family:var(--font-mono);font-size:.72rem;color:' + color(it[2]) + '">' + it[1] + '</span>' +
      '<span class="tnum" style="font-family:var(--font-mono);font-size:.6rem;color:' + color(it[2]) + '">' + arrow(it[2]) + '</span></span>';
  };
  var render = function () {
    var html = items.map(cell).join('');
    ribbon.innerHTML = html + html;
  };

  var status = document.getElementById('ribbonStatus');
  if (status) status.textContent = 'Datos ilustrativos';
  render();
})();

/* ---- 2. Mobile menu ---- */
(function () {
  var burger = document.querySelector('.burger');
  var panel = document.getElementById('mobileNav');
  if (!burger || !panel) return;

  function setOpen(open) {
    panel.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  }
  burger.addEventListener('click', function () {
    setOpen(!panel.classList.contains('open'));
  });
  panel.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') setOpen(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setOpen(false);
  });
})();

/* ---- 3. Reveal on scroll ---- */
(function () {
  var els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  if (!('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  els.forEach(function (el) { io.observe(el); });
  setTimeout(function () { els.forEach(function (el) { el.classList.add('in'); }); }, 1600);
})();

/* Barra CTA fija en móvil: aparece tras pasar el hero, se esconde junto al contacto */
(function () {
  var dock = document.getElementById('ctaDock');
  if (!dock) return;
  var contact = document.getElementById('contacto');
  var shown = false;
  function onScroll() {
    var past = window.scrollY > window.innerHeight * 0.85;
    var nearEnd = contact && contact.getBoundingClientRect().top < window.innerHeight;
    var want = past && !nearEnd;
    if (want !== shown) {
      shown = want;
      dock.classList.toggle('show', want);
      dock.setAttribute('aria-hidden', want ? 'false' : 'true');
      document.body.classList.toggle('dock-visible', want);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* Suscripción a Insights+ (doble opt-in vía /api/subscribe → Brevo) */
(function () {
  var form = document.getElementById('insights-form');
  if (!form) return;
  var input = form.querySelector('input[type="email"]');
  var button = form.querySelector('button[type="submit"]');
  var ok = form.querySelector('.ok');
  var err = form.querySelector('.err');
  var busy = false;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (busy) return;
    if (ok) ok.hidden = true;
    if (err) err.hidden = true;

    var email = (input && input.value ? input.value : '').trim();
    if (!input || !input.checkValidity() || !email) {
      if (input) input.reportValidity();
      return;
    }

    busy = true;
    var label = button ? button.textContent : '';
    if (button) { button.disabled = true; button.textContent = 'Enviando…'; }

    fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: email })
    })
      .then(function (r) { return r.json().catch(function () { return { ok: r.ok }; }); })
      .then(function (data) {
        if (data && data.ok) {
          form.reset();
          if (ok) ok.hidden = false;
        } else if (err) {
          err.hidden = false;
        }
      })
      .catch(function () { if (err) err.hidden = false; })
      .finally(function () {
        busy = false;
        if (button) { button.disabled = false; button.textContent = label; }
      });
  });
})();
