# Vive Sam TV — Landing page educativa para Google Ads

> **Proyecto ficticio** creado con fines demostrativos y educativos.
> Propiedades, precios, dirección y disponibilidad no son reales. El teléfono de contacto sí es real.

Landing estática (HTML + CSS + JavaScript, sin dependencias ni backend) de una inmobiliaria ficticia
de Zacatecas que **solo vende** casas y departamentos nuevos. Está diseñada para explicar en clase el flujo:

```
Keyword  →  Anuncio  →  Landing page  →  CTA  →  Conversión
```

---

## 1. Estructura del proyecto

```
/
├── index.html                  Landing completa (todas las secciones)
├── css/
│   └── styles.css              Estilos mobile-first, sin frameworks
├── js/
│   ├── tracking.js             ★ Configuración: GTM/GA4/Ads, WhatsApp, teléfono, endpoint del formulario
│   └── script.js               Interacciones: menú, filtro, galerías, formulario, eventos
├── assets/
│   ├── IMAGENES-PENDIENTES.md  Inventario de imágenes y reglas de nombres
│   ├── icons/favicon.svg
│   ├── images/
│   │   ├── hero/               hero.jpg
│   │   ├── og/                 og-vive-sam.jpg
│   │   ├── casas/              encino-1..3, cantera-1..3, sierra-1..3
│   │   └── departamentos/      centro-1..3, plaza-1..3, mirador-1..3
│   └── videos/                 (opcional)
├── .nojekyll                   GitHub Pages sirve los archivos tal cual
└── README.md
```

Se separó `tracking.js` de `script.js` a propósito: en clase puedes abrir **un solo archivo** para mostrar
toda la configuración de medición.

## 2. Cómo verla y publicarla

- **Local:** abre `index.html` con un servidor estático (VS Code *Live Server*, o `python -m http.server`).
- **GitHub Pages:** sube el repositorio → *Settings → Pages → Deploy from branch → main / root*.
- **Modo demostración de eventos:** agrega `?debug=1` a la URL. Aparece un panel con cada evento que se envía al `dataLayer`.

### Qué reemplazar antes de una campaña real (todo en `js/tracking.js`)

| Placeholder | Qué es |
|---|---|
| `GTM-XXXXXXX` | ID del contenedor de Google Tag Manager (también en el `<noscript>` de `index.html`) |
| `G-XXXXXXXXXX` | ID de medición de GA4 (solo si no usas GTM) |
| `LABEL_FORMULARIO_HERE` y demás `LABEL_*_HERE` | Etiquetas de cada acción de conversión de Google Ads (ver §4.1) |
| `WHATSAPP_NUMBER_HERE` | Número para wa.me (52 + 10 dígitos, sin “+”) |
| `PHONE_NUMBER` / `PHONE_DISPLAY` | ✅ Configurado: +52 498 106 0429 (cámbialo aquí si lo necesitas) |
| `FORM_ENDPOINT` | URL de Formspree / Getform / Apps Script. Vacío = envío simulado |
| `THANK_YOU_URL` | Opcional: redirigir a una página de gracias en vez de mostrar el mensaje |
| `https://TU_USUARIO.github.io/vive-sam/` | URL canónica en `<head>` |

La **etiqueta de Google de la cuenta `AW-17346716536` ya está instalada** en el `<head>` de `index.html`,
tal como la entrega Google Ads. Los demás placeholders siguen inactivos: no cargan scripts externos, y los
clics en WhatsApp muestran un aviso en lugar de abrir un enlace roto (el evento se mide igual).

La página tiene `noindex` para que Google no la muestre como oferta real. Quítalo si quieres usarla para una demostración de SEO.

---

## 3. Secciones (en orden) y su función

| # | Sección | Ancla | Función comercial / Google Ads |
|---|---|---|---|
| 1 | Header | `#inicio` | Navegación a Casas, Departamentos, Precios… + teléfono y **Agendar una visita** siempre visibles |
| 2 | Hero | — | H1 “Encuentra tu próximo hogar en Zacatecas”, botones **Ver casas / Ver departamentos**, precios “desde”. Cambia según `?interes=` (message match) |
| 3 | Encuentra tu vivienda | `#encuentra-tu-vivienda` | “Estoy buscando… Comprar una casa / Comprar un departamento”: sirve para explicar **intención de búsqueda** |
| 4 | Propiedades + filtro | `#propiedades` | Filtro **Todas / Casas / Departamentos** |
| 4a | Casas | `#casas` | ▶ **Grupo de anuncios 1.** H2 “Casas nuevas en venta en Zacatecas”, 3 modelos |
| 4b | Departamentos | `#departamentos` | ▶ **Grupo de anuncios 2.** H2 “Departamentos nuevos en venta en Zacatecas”, 3 modelos |
| 5 | Precios | `#precios` | Tabla comparativa con precio, m², recámaras, baños, estacionamientos. Respalda los anuncios con precio |
| 6 | ¿Por qué comprar en Vive Sam TV? | `#nosotros` | Argumentos de confianza, sin promesas legales ni financieras |
| 7 | Características y amenidades | `#amenidades` | Beneficios generales (áreas verdes, acceso controlado…) |
| 8 | Proceso de compra | `#proceso` | 4 pasos: reduce la fricción antes del formulario |
| 9 | Ubicación | `#ubicacion` | Av. del Encino #245, Col. Quezada, Zacatecas (ficticia) + mapa ilustrativo sin API |
| 10 | Preguntas frecuentes | `#preguntas-frecuentes` | Incluye “¿Venta o renta?” → base para explicar **palabras clave negativas** |
| 11 | Formulario | `#contacto` | ★ **Conversión primaria** |
| 12 | Footer | — | Enlaces, contacto y aviso de proyecto ficticio |
| — | WhatsApp flotante | — | “Cotiza por WhatsApp”: conversión secundaria |

Cada modelo tiene su propio ancla (`#modelo-encino`, `#modelo-cantera`, `#modelo-sierra`,
`#modelo-centro`, `#modelo-plaza`, `#modelo-mirador`), útil para sitelinks o anuncios de un modelo específico.

### Propiedades

| Modelo | Tipo | Precio | Construcción | Terreno | Rec. | Baños | Estac. |
|---|---|---|---|---|---|---|---|
| Encino | Casa | $1,450,000 | 95 m² | 105 m² | 2 | 1.5 | 1 |
| Cantera | Casa | $1,780,000 | 125 m² | 140 m² | 3 | 2 | 2 |
| Sierra | Casa | $2,150,000 | 155 m² | 160 m² | 3 | 2.5 | 2 |
| Centro | Depto. | $890,000 | 55 m² | — | 1 | 1 | 1 |
| Plaza | Depto. | $1,150,000 | 75 m² | — | 2 | 1 | 1 |
| Mirador | Depto. | $1,390,000 | 90 m² | — | 2 | 2 | 2 |

---

## 4. Qué está preparado para Google Ads

### 4.1 Crear una conversión y conectarla (para la demostración en clase)

La etiqueta de Google ya está puesta. Falta el segundo paso: crear la acción de conversión y pegar su etiqueta.

1. En Google Ads: **Objetivos → Conversiones → Acciones de conversión → Nueva → Sitio web**.
2. Escribe el dominio y elige **Agregar manualmente la conversión**.
   - Categoría: *Envío de formulario de cliente potencial*
   - Nombre: `Formulario enviado — Vive Sam TV`
   - Valor: el que quieras usar en clase · Recuento: **Una** (un lead por persona)
3. En **Configurar la etiqueta → Instalar manualmente**, Google muestra el *fragmento de evento*:

   ```js
   gtag('event', 'conversion', {'send_to': 'AW-17346716536/AbC-D_efGhIjKlMnOp'});
   ```

4. Copia **solo lo que va después de la diagonal** (`AbC-D_efGhIjKlMnOp`) y pégalo en `js/tracking.js`:

   ```js
   ADS_CONVERSION_LABELS: {
     generate_lead:  'AbC-D_efGhIjKlMnOp',   // Formulario enviado
     click_whatsapp: 'LABEL_WHATSAPP_HERE',
     click_phone:    'LABEL_TELEFONO_HERE'
   },
   ```

No hay que pegar el fragmento de evento en el HTML: la página ya lo dispara sola en el momento correcto
(al enviar el formulario, al tocar WhatsApp o al tocar el teléfono), con `value` y `currency`.

5. Comprueba con la extensión **Google Tag Assistant** o con `?debug=1`: al enviar el formulario, la consola
   muestra `CONVERSIÓN enviada a Google Ads` con el `send_to` usado.

Mientras una etiqueta siga como `LABEL_..._HERE`, ese evento se registra en el `dataLayer` pero **no** se
envía como conversión, y en modo `?debug=1` la consola avisa que falta.

### 4.2 Resto de la preparación

1. **URLs finales por grupo de anuncios**, con message match automático:
   - Casas → `https://…/?interes=casas#casas`
     El H1 cambia a “Casas nuevas en venta en Zacatecas”, se filtran las casas y el formulario llega con “Casa” preseleccionado.
   - Departamentos → `https://…/?interes=departamentos#departamentos`
2. **Captura de UTM y `gclid`** en campos ocultos del formulario (`utm_source`, `utm_medium`, `utm_campaign`,
   `utm_term`, `utm_content`, `gclid`, `landing_url`). Se guardan en `sessionStorage` durante la visita.
   Plantilla de seguimiento sugerida en Google Ads:
   `{lpurl}?utm_source=google&utm_medium=cpc&utm_campaign={campaignid}&utm_term={keyword}&utm_content={creative}`
3. **Capa de datos (`dataLayer`)**: todos los eventos pasan por `VSTrack.event()` en `tracking.js`.
4. **Atributos `data-track`** en cada CTA: para medir un botón nuevo basta con agregarle `data-track="nombre_evento"`.
5. **Comentarios en `index.html`** que marcan: CTA principal, conversiones posibles, secciones del grupo
   “Casas” y del grupo “Departamentos”, y señales de remarketing.
6. **Consent Mode v2** con valores por defecto en `tracking.js`, listo para conectar un banner de cookies.

## 5. Conversiones y eventos disponibles

| Evento (`dataLayer`) | Cuándo se dispara | Uso sugerido |
|---|---|---|
| `generate_lead` | Formulario enviado con éxito | ★ **Conversión primaria** (Google Ads + evento clave en GA4) |
| `click_whatsapp` | Clic en cualquier botón de WhatsApp | Conversión secundaria |
| `click_phone` | Clic en cualquier teléfono | Conversión secundaria |
| `click_agendar_visita` | Clic en “Agendar una visita” | Conversión secundaria / microconversión |
| `click_solicitar_informacion` | Clic en “Quiero información del Modelo…” o “Solicitar información” | Microconversión |
| `click_conocer_propiedades` | Clic en “Ver casas” / “Ver departamentos” del hero | Microconversión |
| `select_intent` | Clic en “Comprar una casa / un departamento” | Segmentación / remarketing |
| `filter_properties` | Cambio de filtro | Análisis de interés |
| `view_item` | Una tarjeta de propiedad es visible al 60 % | Remarketing por modelo |
| `view_gallery` | Se abre la galería de un modelo | Señal de interés alto |
| `form_start` | Primer foco en el formulario | Embudo `form_start → generate_lead` |
| `form_error` | Envío con errores de validación | Optimización del formulario |

Parámetros que acompañan a los eventos: `tipo_vivienda`, `propiedad`, `solicitud` (`informacion` / `visita` / `precios`),
`ubicacion` (header, footer, tarjeta_propiedad…), `etiqueta`, `texto`. **No se envían datos personales al `dataLayer`.**

## 6. Etiquetas recomendadas en Google Tag Manager

**Variables** (Variable de capa de datos): `tipo_vivienda`, `propiedad`, `solicitud`, `ubicacion`, `etiqueta`, `value`, `currency`.

| Etiqueta | Tipo | Activador |
|---|---|---|
| Google tag (GA4) | Etiqueta de Google `G-…` | All Pages |
| Vinculación de conversiones | Conversion Linker | All Pages |
| GA4 · generate_lead | Evento de GA4 (con parámetros) | Evento personalizado `generate_lead` |
| **Ads · Conversión Formulario** | Seguimiento de conversiones de Google Ads (valor/moneda desde variables) | Evento personalizado `generate_lead` |
| Ads · Conversión WhatsApp | Seguimiento de conversiones de Google Ads | Evento personalizado `click_whatsapp` |
| Ads · Conversión Llamada | Seguimiento de conversiones de Google Ads | Evento personalizado `click_phone` |
| GA4 · Clics de CTA | Evento de GA4 `{{Event}}` | Evento personalizado, regex `^click_\|select_intent\|view_gallery$` |
| GA4 · view_item | Evento de GA4 | Evento personalizado `view_item` |
| Ads · Remarketing | Remarketing de Google Ads (o la etiqueta de Google con audiencias) | All Pages + `view_item` |
| (Opcional) Conversiones mejoradas | Datos proporcionados por el usuario desde los campos `#f-email` / `#f-telefono` | En la etiqueta Ads · Conversión Formulario |

En Google Ads marca **Formulario** como conversión *Principal* y WhatsApp / Llamada como *Secundarias*
(para que no inflen la optimización de Smart Bidding al inicio).

**Audiencias de remarketing posibles:** vio casas y no envió formulario · vio departamentos y no envió formulario ·
abrió la galería de un modelo · inició el formulario pero no lo envió.

---

## 7. Ejemplo de campaña para la clase

**Campaña:** Vive Sam TV — Venta de Viviendas · Red de Búsqueda · Ubicación: Zacatecas y Guadalupe, Zac. (radio ~20 km)

### Grupo de anuncios 1 — Casas

URL final: `/?interes=casas#casas`

Palabras clave (concordancia de frase `"…"` y exacta `[…]`):

```
"casas en venta"                     [casas en venta en zacatecas]
"casas en venta en zacatecas"        [comprar casa en zacatecas]
"comprar casa en zacatecas"          [casas nuevas en zacatecas]
"casas nuevas en zacatecas"          [casa en venta en zacatecas]
"casas modernas en zacatecas"        "casa nueva en venta"
"comprar casa nueva"                 "viviendas en venta en zacatecas"
"casas de 3 recamaras en zacatecas"  "casas en colonia quezada"
"precio de casas en zacatecas"       "casas en venta zacatecas"
```

Anuncio de búsqueda responsivo (títulos ≤ 30 caracteres, descripciones ≤ 90):

- Títulos: `Casas en Venta en Zacatecas` · `Casas desde $1,450,000 MXN` · `Vive Sam TV | Casas Nuevas` ·
  `Casas de 2 y 3 Recámaras` · `En Colonia Quezada` · `Agenda una Visita Hoy`
- Descripciones:
  `Casas nuevas en venta en Col. Quezada, Zacatecas. Consulta precios y agenda tu visita.` ·
  `Modelos Encino, Cantera y Sierra con cochera. Solicita información sin compromiso.`
- Rutas visibles: `/casas/zacatecas`

### Grupo de anuncios 2 — Departamentos

URL final: `/?interes=departamentos#departamentos`

```
"departamentos en venta"                  [departamentos en venta en zacatecas]
"departamentos en venta en zacatecas"     [comprar departamento en zacatecas]
"comprar departamento en zacatecas"       [departamentos nuevos en zacatecas]
"departamentos nuevos en zacatecas"       [departamento en venta en zacatecas]
"departamento nuevo en venta"             "departamentos modernos en zacatecas"
"comprar departamento nuevo"              "viviendas nuevas en zacatecas"
"departamento de 2 recamaras zacatecas"   "precio de departamentos en zacatecas"
```

- Títulos: `Departamentos en Zacatecas` · `Deptos. desde $890,000 MXN` · `Departamentos en Venta` ·
  `Departamentos Nuevos` · `De 1 y 2 Recámaras` · `Agenda una Visita Hoy`
- Descripciones:
  `Departamentos nuevos en venta en Col. Quezada, Zacatecas. Precios claros y asesoría.` ·
  `Modelos Centro, Plaza y Mirador con estacionamiento. Solicita información hoy.`
- Rutas visibles: `/departamentos/zacatecas`

> **Tip de clase:** agrega `"casas"` como negativa del grupo Departamentos y `"departamentos"` / `"depto"` como negativas
> del grupo Casas. Así cada búsqueda cae en el grupo cuyo anuncio y URL final le corresponden.

### Palabras clave negativas (nivel campaña)

```
Renta / alquiler         Intención distinta          Fuera de oferta
renta                    gratis                      terreno / terrenos
rentar                   infonavit subasta           lotes
alquiler                 remate                      local comercial
alquilar                 embargada / adjudicada      oficina / bodega
en renta                 empleo / trabajo            usadas / seminuevas
casa en renta            vacante                     traspaso
departamento en renta    planos gratis               airbnb
casas para rentar        diseño de casas             por dia / por noche
departamentos para rentar  maquetas                  cuartos / roomies
renta mensual            curso / tesis               hotel
```

Justificación visible en la propia landing: la FAQ responde
*“Vive Sam TV actualmente ofrece únicamente propiedades en venta. No contamos con propiedades en renta.”*
Pagar por un clic de alguien que busca rentar sería desperdiciar presupuesto: esa persona no va a convertir.

---

## 8. Cómo la landing mantiene la relevancia con ambos grupos

| Paso | Grupo Casas | Grupo Departamentos |
|---|---|---|
| **Keyword** | casas en venta en zacatecas | departamentos en venta en zacatecas |
| **Anuncio** | “Casas en Venta en Zacatecas” | “Departamentos en Zacatecas” |
| **URL final** | `?interes=casas#casas` | `?interes=departamentos#departamentos` |
| **H1 que ve el usuario** | Casas nuevas en venta en Zacatecas | Departamentos nuevos en venta en Zacatecas |
| **Contenido** | H2 del grupo Casas, 3 modelos con precio, m² y terreno | H2 del grupo Departamentos, 3 modelos con precio y m² |
| **Precio que respalda el anuncio** | “desde $1,450,000 MXN” | “desde $890,000 MXN” |
| **CTA** | “Quiero información del Modelo …” / “Quiero comprar una casa” | “Quiero información del Modelo …” / “Quiero conocer departamentos” |
| **Formulario** | Llega con “Casa” y el modelo preseleccionados | Llega con “Departamento” y el modelo preseleccionados |
| **Conversión** | `generate_lead` con `tipo_vivienda: casa` | `generate_lead` con `tipo_vivienda: departamento` |

Las palabras clave aparecen donde Google y el usuario las esperan (title, meta description, H1, H2, H3,
descripciones, `alt` de imágenes, FAQ), pero sin repetirse de forma forzada. Esto mejora los tres componentes
del **Nivel de calidad**: CTR esperado, relevancia del anuncio y experiencia en la página de destino.

## 9. Imágenes

Ver [`assets/IMAGENES-PENDIENTES.md`](assets/IMAGENES-PENDIENTES.md): inventario completo (imágenes generadas con IA) y reglas de nombres.
Si alguna imagen llegara a faltar, su espacio muestra un placeholder con la ruta exacta del archivo.
