/* ==========================================================================
   VIVE SAM TV — Configuración y medición (GTM · GA4 · Google Ads)
   --------------------------------------------------------------------------
   Este archivo se carga en <head>. Aquí vive TODA la configuración que hay
   que reemplazar antes de publicar una campaña real:

     1. Crea un contenedor en Google Tag Manager y pega su ID en GTM_ID.
     2. Dentro de GTM crea las etiquetas de GA4 y Google Ads (ver README).
     3. (Opcional) Si NO usas GTM, llena GA4_ID / ADS_ID / etiquetas y el
        sitio cargará gtag.js directamente (USE_GTAG_DIRECT = true).

   Mientras los valores sigan siendo placeholders (contienen "X" o "_HERE"),
   no se carga ningún script externo: los eventos solo se envían al
   dataLayer y a la consola. Agrega ?debug=1 a la URL para ver en pantalla
   cada evento que se dispara (útil para explicarlo en clase).
   ========================================================================== */

window.VIVE_SAM_CONFIG = {
  // --- Google Tag Manager (método recomendado) ---
  GTM_ID: 'GTM-XXXXXXX',

  // --- Solo si se implementa gtag.js directamente (sin GTM) ---
  USE_GTAG_DIRECT: false,
  GA4_ID: 'G-XXXXXXXXXX',
  ADS_ID: 'AW-XXXXXXXXXX',
  ADS_CONVERSION_LABELS: {
    generate_lead: 'LABEL_FORMULARIO_HERE',   // Conversión primaria: formulario enviado
    click_whatsapp: 'LABEL_WHATSAPP_HERE',    // Conversión secundaria
    click_phone: 'LABEL_TELEFONO_HERE'        // Conversión secundaria
  },

  // --- Datos de contacto (teléfono real; WhatsApp sigue como placeholder) ---
  WHATSAPP_NUMBER: 'WHATSAPP_NUMBER_HERE',    // Formato wa.me: 52 + 10 dígitos, sin espacios ni "+"
  PHONE_NUMBER: '+524981060429',              // Formato tel: +52 + 10 dígitos
  PHONE_DISPLAY: '498 106 0429',              // Como se muestra en pantalla
  WHATSAPP_MESSAGE: 'Hola, me interesa comprar una vivienda con Vive Sam TV. ¿Me pueden compartir información?',

  // --- Envío del formulario ---
  // Vacío = envío simulado. Para un servicio real (Formspree, Getform,
  // Google Apps Script, etc.) pega aquí la URL del endpoint (POST).
  FORM_ENDPOINT: '',

  // Si prefieres medir la conversión por "página de gracias" en vez de por
  // evento, escribe aquí la URL (ej. 'gracias.html'). Vacío = mensaje en la misma página.
  THANK_YOU_URL: ''
};

(function () {
  var C = window.VIVE_SAM_CONFIG;
  var isPlaceholder = function (v) { return !v || /X{4,}|_HERE/.test(v); };

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };

  /* ------------------------------------------------------------------
     Consent Mode v2 (valores por defecto). Si se agrega un banner de
     cookies, actualizar con gtag('consent','update',{...}) al aceptar.
     ------------------------------------------------------------------ */
  window.gtag('consent', 'default', {
    ad_storage: 'granted', analytics_storage: 'granted',
    ad_user_data: 'granted', ad_personalization: 'granted'
  });

  /* ------------------------------------------------------------------
     Carga de Google Tag Manager
     ------------------------------------------------------------------ */
  if (!isPlaceholder(C.GTM_ID)) {
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtm.js?id=' + C.GTM_ID;
    document.head.appendChild(s);
  }

  /* ------------------------------------------------------------------
     Alternativa: gtag.js directo (GA4 + Google Ads) sin GTM
     ------------------------------------------------------------------ */
  var gtagDirect = C.USE_GTAG_DIRECT && (!isPlaceholder(C.GA4_ID) || !isPlaceholder(C.ADS_ID));
  if (gtagDirect) {
    var firstId = !isPlaceholder(C.GA4_ID) ? C.GA4_ID : C.ADS_ID;
    var g = document.createElement('script');
    g.async = true;
    g.src = 'https://www.googletagmanager.com/gtag/js?id=' + firstId;
    document.head.appendChild(g);
    window.gtag('js', new Date());
    if (!isPlaceholder(C.GA4_ID)) window.gtag('config', C.GA4_ID);
    if (!isPlaceholder(C.ADS_ID)) window.gtag('config', C.ADS_ID);
  }

  var debug = /[?&]debug=1\b/.test(location.search);

  /* ------------------------------------------------------------------
     VSTrack.event(nombre, parámetros)
     Punto único por donde pasa cada interacción medible del sitio.
     En GTM: crear un Activador "Evento personalizado" con el nombre del
     evento (ej. generate_lead) y asociarle las etiquetas de GA4 / Ads.
     ------------------------------------------------------------------ */
  window.VSTrack = {
    event: function (name, params) {
      params = params || {};
      var payload = Object.assign({ event: name }, params);
      window.dataLayer.push(payload);

      if (gtagDirect) {
        window.gtag('event', name, params);
        var label = C.ADS_CONVERSION_LABELS[name];
        if (!isPlaceholder(C.ADS_ID) && !isPlaceholder(label)) {
          window.gtag('event', 'conversion', { send_to: C.ADS_ID + '/' + label });
        }
      }

      if (debug) {
        console.info('[Vive Sam TV · evento]', name, params);
        showDebug(name, params);
      }
    }
  };

  function showDebug(name, params) {
    var panel = document.getElementById('vs-debug');
    if (!panel) {
      panel = document.createElement('div');
      panel.id = 'vs-debug';
      panel.className = 'debug-panel';
      panel.setAttribute('aria-live', 'polite');
      panel.innerHTML = '<div><b>dataLayer · eventos</b></div>';
      document.body.appendChild(panel);
    }
    var row = document.createElement('div');
    row.innerHTML = '<b>' + name + '</b> ' + escapeHtml(JSON.stringify(params));
    panel.appendChild(row);
    panel.scrollTop = panel.scrollHeight;
  }
  function escapeHtml(s) { return s.replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); }
})();
