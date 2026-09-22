/* ==========================================================================
   VIVE SAM TV — Interacciones de la landing
   Sin dependencias. Módulos:
     1. Utilidades
     2. Header y menú móvil
     3. Enlaces de teléfono y WhatsApp (desde VIVE_SAM_CONFIG)
     4. Imágenes con placeholder
     5. Galerías + lightbox
     6. Filtro Todas | Casas | Departamentos
     7. Parámetros de URL (message match por grupo de anuncios + UTM/gclid)
     8. CTAs que preconfiguran el formulario
     9. Formulario (conversión primaria)
    10. Medición de clics (conversiones secundarias) y señales de remarketing
    11. Animaciones sutiles
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- 1. Utilidades ---------- */
  var C = window.VIVE_SAM_CONFIG || {};
  var track = function (name, params) { if (window.VSTrack) window.VSTrack.event(name, params || {}); };
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var isPlaceholder = function (v) { return !v || /X{4,}|_HERE/.test(v); };
  var params = new URLSearchParams(location.search);

  var MODELS = {
    encino:  { tipo: 'casa', nombre: 'Modelo Encino' },
    cantera: { tipo: 'casa', nombre: 'Modelo Cantera' },
    sierra:  { tipo: 'casa', nombre: 'Modelo Sierra' },
    centro:  { tipo: 'departamento', nombre: 'Modelo Centro' },
    plaza:   { tipo: 'departamento', nombre: 'Modelo Plaza' },
    mirador: { tipo: 'departamento', nombre: 'Modelo Mirador' }
  };

  // Elementos del formulario (se usan en varios módulos)
  var form = $('#lead-form');
  var propSelect = $('#f-propiedad');
  var msgField = $('#f-mensaje');
  var DEFAULT_MSG_PH = msgField.placeholder;

  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Etiquetas para la tabla de precios en móvil (cada fila se muestra como tarjeta)
  var priceHeads = $$('.price-table thead th').map(function (th) { return th.textContent.trim(); });
  $$('.price-table tbody tr').forEach(function (tr) {
    $$('th, td', tr).forEach(function (cell, i) { if (priceHeads[i]) cell.setAttribute('data-label', priceHeads[i]); });
  });

  /* ---------- 2. Header y menú móvil ---------- */
  var header = $('.site-header');
  var nav = $('#main-nav');
  var toggle = $('#nav-toggle');

  var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  }
  toggle.addEventListener('click', function () { setMenu(!nav.classList.contains('is-open')); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  document.addEventListener('click', function (e) {
    if (nav.classList.contains('is-open') && !e.target.closest('#main-nav') && !e.target.closest('#nav-toggle')) setMenu(false);
  });
  window.addEventListener('resize', function () { if (window.innerWidth >= 1080) setMenu(false); });

  /* ---------- 3. Teléfono y WhatsApp ---------- */
  var phoneReady = !isPlaceholder(C.PHONE_NUMBER);
  var waReady = !isPlaceholder(C.WHATSAPP_NUMBER);

  $$('.js-phone-link').forEach(function (a) { a.href = 'tel:' + (C.PHONE_NUMBER || 'PHONE_NUMBER_HERE'); });
  $$('.js-phone-text').forEach(function (el) { el.textContent = C.PHONE_DISPLAY || C.PHONE_NUMBER || 'PHONE_NUMBER_HERE'; });
  $$('.js-whatsapp-link').forEach(function (a) {
    a.href = 'https://wa.me/' + (C.WHATSAPP_NUMBER || 'WHATSAPP_NUMBER_HERE') + '?text=' + encodeURIComponent(C.WHATSAPP_MESSAGE || '');
  });

  // Mientras los números sean placeholders, el clic se mide igualmente pero
  // no abre un enlace roto: muestra un aviso breve.
  document.addEventListener('click', function (e) {
    var a = e.target.closest('.js-phone-link, .js-whatsapp-link');
    if (!a) return;
    var isWa = a.classList.contains('js-whatsapp-link');
    if ((isWa && !waReady) || (!isWa && !phoneReady)) {
      e.preventDefault();
      toast(isWa
        ? 'Número de WhatsApp pendiente de configurar (WHATSAPP_NUMBER_HERE).'
        : 'Teléfono pendiente de configurar (PHONE_NUMBER_HERE).');
    }
  });

  var toastTimer;
  function toast(msg) {
    var t = $('#vs-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'vs-toast';
      t.setAttribute('role', 'status');
      t.style.cssText = 'position:fixed;left:50%;bottom:88px;transform:translateX(-50%);z-index:250;max-width:calc(100vw - 32px);padding:12px 18px;border-radius:12px;background:#1E2B2A;color:#fff;font:600 14px/1.4 Manrope,sans-serif;box-shadow:0 10px 30px -10px rgba(0,0,0,.4);text-align:center;transition:opacity .25s';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.opacity = '1';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.style.opacity = '0'; }, 3200);
  }

  /* ---------- 4. Imágenes con placeholder ----------
     Si un archivo de /assets/images/ no existe todavía, el contenedor
     .media recibe .is-missing y muestra qué archivo hay que agregar. */
  function watchImage(img) {
    var box = img.closest('.media');
    if (!box) return;
    var mark = function () { box.classList.add('is-missing'); };
    var clear = function () { if (img.naturalWidth > 1) box.classList.remove('is-missing'); };
    img.addEventListener('error', mark);
    img.addEventListener('load', clear);
    if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) mark();
  }
  $$('.media img').forEach(watchImage);

  /* ---------- 5. Galerías + lightbox ---------- */
  var IMG_BASE = 'assets/images/';
  var galleries = {};

  $$('.property-card').forEach(function (card) {
    var model = card.dataset.model;
    var title = card.querySelector('.card-title').textContent;
    var items = (card.dataset.gallery || '').split(';').filter(Boolean).map(function (entry) {
      var parts = entry.split('|');
      return { path: parts[0].trim(), alt: (parts[1] || title).trim() };
    });
    galleries[model] = { title: title, items: items, index: 0 };

    var main = card.querySelector('.card-main');
    var mainImg = main.querySelector('img');
    var thumbsBox = card.querySelector('.thumbs');

    items.forEach(function (item, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'media thumb' + (i === 0 ? ' is-active' : '');
      b.dataset.ph = item.path;
      b.dataset.n = 'Foto ' + (i + 1);
      b.setAttribute('aria-label', 'Ver foto ' + (i + 1) + ': ' + item.alt);
      var im = document.createElement('img');
      im.src = IMG_BASE + item.path;
      im.alt = '';
      im.loading = 'lazy';
      im.width = 160; im.height = 120;
      b.appendChild(im);
      thumbsBox.appendChild(b);
      watchImage(im);

      b.addEventListener('click', function () {
        galleries[model].index = i;
        $$('.thumb', thumbsBox).forEach(function (t) { t.classList.toggle('is-active', t === b); });
        main.dataset.ph = item.path;
        main.classList.remove('is-missing');
        mainImg.src = IMG_BASE + item.path;
        mainImg.alt = item.alt;
        if (mainImg.complete && mainImg.naturalWidth === 0) main.classList.add('is-missing');
      });
    });

    main.addEventListener('click', function () {
      openLightbox(model, galleries[model].index);
      // Señal de interés alto (remarketing / microconversión)
      track('view_gallery', { propiedad: model, tipo_vivienda: card.dataset.type });
    });
  });

  var lb = $('#lightbox'), lbStage = $('#lb-stage'), lbImg = $('#lb-img');
  var lbTitle = $('#lb-title'), lbCounter = $('#lb-counter');
  var lbState = { model: null, index: 0 };
  watchImage(lbImg);

  function renderLightbox() {
    var g = galleries[lbState.model];
    var item = g.items[lbState.index];
    lbStage.classList.remove('is-missing');
    lbStage.dataset.ph = item.path;
    lbImg.src = IMG_BASE + item.path;
    lbImg.alt = item.alt;
    if (lbImg.complete && lbImg.naturalWidth === 0) lbStage.classList.add('is-missing');
    lbTitle.textContent = item.alt;
    lbCounter.textContent = (lbState.index + 1) + ' / ' + g.items.length;
  }
  function openLightbox(model, index) {
    lbState.model = model; lbState.index = index || 0;
    renderLightbox();
    if (typeof lb.showModal === 'function') lb.showModal(); else lb.setAttribute('open', '');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    if (typeof lb.close === 'function' && lb.open) lb.close(); else lb.removeAttribute('open');
  }
  function stepLightbox(d) {
    var n = galleries[lbState.model].items.length;
    lbState.index = (lbState.index + d + n) % n;
    renderLightbox();
  }
  lb.addEventListener('close', function () { document.body.style.overflow = ''; });
  $('#lb-close').addEventListener('click', closeLightbox);
  $('#lb-prev').addEventListener('click', function () { stepLightbox(-1); });
  $('#lb-next').addEventListener('click', function () { stepLightbox(1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLightbox(); });
  lb.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') stepLightbox(-1);
    if (e.key === 'ArrowRight') stepLightbox(1);
  });
  // Gesto de deslizar en móvil
  var touchX = null;
  lbStage.addEventListener('touchstart', function (e) { touchX = e.touches[0].clientX; }, { passive: true });
  lbStage.addEventListener('touchend', function (e) {
    if (touchX === null) return;
    var dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) stepLightbox(dx < 0 ? 1 : -1);
    touchX = null;
  });

  /* ---------- 6. Filtro Todas | Casas | Departamentos ---------- */
  var filterBtns = $$('.filter-btn');
  var groups = $$('.property-group');

  function setFilter(value, silent) {
    if (['todas', 'casas', 'departamentos'].indexOf(value) === -1) value = 'todas';
    filterBtns.forEach(function (b) {
      var on = b.dataset.filter === value;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-selected', String(on));
    });
    groups.forEach(function (g) {
      var show = value === 'todas' || g.dataset.group === value;
      var wasHidden = g.hidden;
      g.hidden = !show;
      if (show && wasHidden) {
        g.classList.remove('is-entering'); void g.offsetWidth; g.classList.add('is-entering');
      }
    });
    if (!silent) track('filter_properties', { filtro: value });
  }
  filterBtns.forEach(function (b) { b.addEventListener('click', function () { setFilter(b.dataset.filter); }); });

  // Enlaces "Ver casas" / "Ver departamentos" / selector de intención:
  // aplican el filtro y luego desplazan a la sección.
  document.addEventListener('click', function (e) {
    var link = e.target.closest('[data-filter-link]');
    if (!link) return;
    e.preventDefault();
    var value = link.dataset.filterLink;
    setFilter(value, true);
    var target = document.getElementById(value);
    if (target) {
      requestAnimationFrame(function () { target.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
      history.replaceState(null, '', location.pathname + location.search + '#' + value);
    }
  });

  /* ---------- 7. Parámetros de URL ----------
     a) ?interes=casas | departamentos  → message match con el grupo de anuncios.
        URL final sugerida en Google Ads:
          Grupo Casas:         index.html?interes=casas#casas
          Grupo Departamentos: index.html?interes=departamentos#departamentos
     b) UTM + gclid → campos ocultos del formulario (atribución del lead). */
  var HERO_VARIANTS = {
    casas: {
      eyebrow: 'Casas nuevas en venta · Zacatecas',
      title: 'Casas nuevas en venta en Zacatecas',
      sub: 'Tres modelos de casa moderna en Colonia Quezada desde $1,450,000 MXN. Compara precios, recámaras y metros cuadrados, y agenda una visita.'
    },
    departamentos: {
      eyebrow: 'Departamentos nuevos en venta · Zacatecas',
      title: 'Departamentos nuevos en venta en Zacatecas',
      sub: 'Tres modelos de departamento moderno en Colonia Quezada desde $890,000 MXN. Compara precios, recámaras y metros cuadrados, y agenda una visita.'
    }
  };
  var interes = (params.get('interes') || '').toLowerCase();
  if (interes === 'casa') interes = 'casas';
  if (interes === 'departamento') interes = 'departamentos';
  if (HERO_VARIANTS[interes]) {
    var v = HERO_VARIANTS[interes];
    $('#hero-eyebrow').textContent = v.eyebrow;
    $('#hero-title').textContent = v.title;
    $('#hero-sub').textContent = v.sub;
    setFilter(interes, true);
    presetForm({ tipo: interes === 'casas' ? 'casa' : 'departamento' });
    // Al cambiar el filtro, #casas o #departamentos existen visibles: el hash funciona.
    if (location.hash) {
      var h = document.getElementById(location.hash.slice(1));
      if (h) setTimeout(function () { h.scrollIntoView(); }, 0);
    }
  } else if (location.hash === '#casas' || location.hash === '#departamentos') {
    setFilter(location.hash.slice(1), true);
  }

  var ATTR_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid'];
  var stored = {};
  try { stored = JSON.parse(sessionStorage.getItem('vs_attr') || '{}'); } catch (err) { stored = {}; }
  ATTR_KEYS.forEach(function (k) { if (params.get(k)) stored[k] = params.get(k); });
  try { sessionStorage.setItem('vs_attr', JSON.stringify(stored)); } catch (err) { /* modo privado */ }
  ATTR_KEYS.forEach(function (k) { if (stored[k]) form.elements[k].value = stored[k]; });
  form.elements.landing_url.value = location.href.split('#')[0];

  /* ---------- 8. CTAs que preconfiguran el formulario ---------- */
  function syncPropertyOptions(tipo) {
    $$('optgroup', propSelect).forEach(function (og) {
      og.disabled = !!tipo && og.dataset.tipo !== tipo;
    });
    var sel = MODELS[propSelect.value];
    if (sel && tipo && sel.tipo !== tipo) propSelect.value = 'aun-no-lo-se';
  }

  function presetForm(opts) {
    if (opts.tipo) {
      var radio = form.querySelector('input[name="tipo"][value="' + opts.tipo + '"]');
      if (radio) { radio.checked = true; clearError('tipo'); }
      syncPropertyOptions(opts.tipo);
    }
    if (opts.propiedad && MODELS[opts.propiedad]) propSelect.value = opts.propiedad;
    if (opts.solicitud) {
      form.elements.solicitud.value = opts.solicitud;
      var modelName = opts.propiedad && MODELS[opts.propiedad] ? ' el ' + MODELS[opts.propiedad].nombre : '';
      if (opts.solicitud === 'visita') msgField.placeholder = 'Me gustaría agendar una visita para conocer' + (modelName || ' las viviendas') + '. Mi horario preferido es…';
      else if (opts.solicitud === 'precios') msgField.placeholder = 'Me gustaría conocer precio, disponibilidad y formas de pago de' + (modelName || ' sus viviendas') + '.';
      else msgField.placeholder = DEFAULT_MSG_PH;
    }
  }

  document.addEventListener('click', function (e) {
    var cta = e.target.closest('.js-cta-form');
    if (!cta) return;
    presetForm({ tipo: cta.dataset.tipo, propiedad: cta.dataset.propiedad, solicitud: cta.dataset.solicitud || 'informacion' });
    // Enfocar el primer campo al llegar (sin salto brusco)
    setTimeout(function () { try { $('#f-nombre').focus({ preventScroll: true }); } catch (err) { /* noop */ } }, 700);
  });

  form.addEventListener('change', function (e) {
    if (e.target.name === 'tipo') { syncPropertyOptions(e.target.value); clearError('tipo'); }
    if (e.target === propSelect && MODELS[propSelect.value]) {
      var t = MODELS[propSelect.value].tipo;
      var r = form.querySelector('input[name="tipo"][value="' + t + '"]');
      if (r && !r.checked) { r.checked = true; syncPropertyOptions(t); clearError('tipo'); }
    }
  });

  /* ---------- 9. Formulario — CONVERSIÓN PRIMARIA ---------- */
  var success = $('#form-success');
  var submitBtn = $('#submit-btn');
  var formStarted = false;

  // Microconversión: el usuario empezó a llenar el formulario (embudo form_start → generate_lead)
  form.addEventListener('focusin', function () {
    if (formStarted) return;
    formStarted = true;
    track('form_start', { form_id: form.dataset.formId });
  });

  function setError(name, msg) {
    var el = $('#e-' + name);
    if (el) el.textContent = msg;
    var field = el && el.closest('.field');
    if (field) field.classList.add('has-error');
    var input = form.elements[name];
    if (input && input.setAttribute) input.setAttribute('aria-invalid', 'true');
  }
  function clearError(name) {
    var el = $('#e-' + name);
    if (el) el.textContent = '';
    var field = el && el.closest('.field');
    if (field) field.classList.remove('has-error');
    var input = form.elements[name];
    if (input && input.removeAttribute) input.removeAttribute('aria-invalid');
  }
  ['nombre', 'telefono', 'email'].forEach(function (n) {
    form.elements[n].addEventListener('input', function () { clearError(n); });
  });

  function validate() {
    var ok = true, first = null;
    var nombre = form.elements.nombre.value.trim();
    var tel = form.elements.telefono.value.replace(/\D/g, '');
    var email = form.elements.email.value.trim();
    var tipo = form.querySelector('input[name="tipo"]:checked');

    ['nombre', 'telefono', 'email', 'tipo'].forEach(clearError);
    if (nombre.length < 3) { setError('nombre', 'Escribe tu nombre completo.'); ok = false; first = first || form.elements.nombre; }
    if (!(tel.length === 10 || (tel.length === 12 && tel.indexOf('52') === 0))) { setError('telefono', 'Escribe un teléfono de 10 dígitos.'); ok = false; first = first || form.elements.telefono; }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { setError('email', 'Revisa el formato del correo.'); ok = false; first = first || form.elements.email; }
    if (!tipo) { setError('tipo', 'Elige si buscas casa o departamento.'); ok = false; first = first || form.querySelector('input[name="tipo"]'); }
    if (first) first.focus();
    return ok;
  }

  function sendLead(data) {
    if (!C.FORM_ENDPOINT) {
      // Envío SIMULADO (sin backend). Sustituir configurando FORM_ENDPOINT.
      return new Promise(function (resolve) { setTimeout(resolve, 900); });
    }
    return fetch(C.FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data)
    }).then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r; });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (form.elements.empresa.value) return; // honeypot: bot
    if (!validate()) {
      track('form_error', { form_id: form.dataset.formId });
      return;
    }

    var data = {};
    new FormData(form).forEach(function (val, key) { if (key !== 'empresa') data[key] = val; });

    submitBtn.classList.add('is-loading');
    submitBtn.querySelector('.btn-label').textContent = 'Enviando…';

    sendLead(data).then(function () {
      /* ★ CONVERSIÓN PRIMARIA ★
         Evento "generate_lead" en el dataLayer. En GTM:
           - Activador: Evento personalizado = generate_lead
           - Etiquetas: GA4 Evento (generate_lead) + Conversión de Google Ads
         No se envían datos personales (nombre/teléfono) al dataLayer.
         Para Conversiones Mejoradas, usar una variable de GTM que lea el
         email/teléfono del formulario de forma hasheada (ver README). */
      track('generate_lead', {
        form_id: form.dataset.formId,
        tipo_vivienda: data.tipo,
        propiedad: data.propiedad,
        solicitud: data.solicitud,
        value: 1,
        currency: 'MXN',
        utm_campaign: data.utm_campaign || '(sin campaña)',
        utm_term: data.utm_term || ''
      });

      if (C.THANK_YOU_URL) { location.href = C.THANK_YOU_URL; return; }
      form.hidden = true;
      success.hidden = false;
      success.focus();
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }).catch(function () {
      toast('No pudimos enviar tu solicitud. Inténtalo de nuevo o escríbenos por WhatsApp.');
      track('form_error', { form_id: form.dataset.formId, motivo: 'envio' });
    }).then(function () {
      submitBtn.classList.remove('is-loading');
      submitBtn.querySelector('.btn-label').textContent = 'Solicitar información';
    });
  });

  $('#form-reset').addEventListener('click', function () {
    form.reset();
    ATTR_KEYS.forEach(function (k) { if (stored[k]) form.elements[k].value = stored[k]; });
    form.elements.landing_url.value = location.href.split('#')[0];
    syncPropertyOptions(null);
    msgField.placeholder = DEFAULT_MSG_PH;
    formStarted = false;
    success.hidden = true;
    form.hidden = false;
    $('#f-nombre').focus();
  });

  /* ---------- 10. Medición de clics y señales de remarketing ----------
     Todo elemento con data-track="evento" envía ese evento al dataLayer.
     Eventos definidos en el HTML:
       click_phone, click_whatsapp            → conversiones secundarias
       click_conocer_propiedades              → interés en ver modelos
       click_solicitar_informacion            → intención alta
       click_agendar_visita                   → intención alta
       select_intent (casa | departamento)    → segmentación / remarketing */
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-track]');
    if (!el) return;
    var card = el.closest('.property-card');
    track(el.dataset.track, {
      etiqueta: el.dataset.trackLabel || '',
      ubicacion: el.dataset.trackLocation || (card ? 'tarjeta_propiedad' : ''),
      tipo_vivienda: el.dataset.tipo || (card ? card.dataset.type : ''),
      propiedad: el.dataset.propiedad || (card ? card.dataset.model : ''),
      texto: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 80)
    });
  });

  // REMARKETING: registrar qué modelos vio cada visitante (view_item).
  // Permite crear audiencias como "vio casas pero no envió formulario".
  if ('IntersectionObserver' in window) {
    var seen = {};
    var viewObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var m = en.target.dataset.model;
        if (en.isIntersecting && !seen[m]) {
          seen[m] = true;
          track('view_item', { propiedad: m, tipo_vivienda: en.target.dataset.type });
          viewObs.unobserve(en.target);
        }
      });
    }, { threshold: 0.6 });
    $$('.property-card').forEach(function (c) { viewObs.observe(c); });
  }

  /* ---------- 11. Animaciones sutiles al hacer scroll ---------- */
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reduce) {
    var revealEls = $$('.section-head, .intent-card, .why-card, .steps li, .price-hl, .amenities li, .faq details, .address-card, .map');
    var revObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); revObs.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) {
      // Solo animar lo que está por debajo del primer pantallazo
      if (el.getBoundingClientRect().top > window.innerHeight) { el.classList.add('reveal'); revObs.observe(el); }
    });
  }
})();
