# Imágenes del sitio

**Estado:** completas. Todas las imágenes de propiedades fueron generadas con IA.

La página conserva un sistema de respaldo: si alguna imagen llegara a faltar, su espacio muestra un
placeholder con la ruta exacta del archivo en lugar de una imagen rota.

## Reglas

- **Nombres** en minúsculas y con extensión `.jpg` (GitHub Pages distingue mayúsculas: `Cantera-1.jpg` ≠ `cantera-1.jpg`).
- **Portada de cada tarjeta** = la primera imagen del atributo `data-gallery` de esa tarjeta en `index.html`.
- Las fotos se anclan **arriba** en la tarjeta (4:3): se ven el título y el precio y se recorta la barra
  inferior de características (ya está en la tarjeta). En el visor (lightbox) se ven completas.
- Si cambias un precio en `index.html`, recuerda que varias imágenes tienen el precio dibujado.
- Peso recomendado: < 250 KB por imagen.

## Inventario

| Archivo | Contenido | Dónde aparece |
|---|---|---|
| `hero/hero.jpg` | Fachada del Modelo Sierra, recortada sin texto (1024×640) | Fondo del Hero |
| `og/og-vive-sam.jpg` | Fachada + “Vive Sam · Casas y departamentos en venta en Zacatecas · Desde $890,000 MXN” (1200×630) | Vista previa al compartir el enlace |
| `casas/encino-3.jpg` | Fachada posterior con jardín | **Portada** Encino · foto 1 |
| `casas/encino-2.jpg` | Sala, comedor y cocina | Encino · foto 2 |
| `casas/encino-1.jpg` | Fachada principal + ficha técnica (vertical) | Encino · foto 3 |
| `casas/cantera-1.jpg` | Fachada con cochera doble | **Portada** Cantera · foto 1 |
| `casas/cantera-2.jpg` | Sala y comedor de doble altura | Cantera · foto 2 |
| `casas/cantera-3.jpg` | Patio interior con jardín | Cantera · foto 3 |
| `casas/sierra-1.jpg` | Fachada con cochera para dos autos | **Portada** Sierra · foto 1 |
| `casas/sierra-2.jpg` | Terraza y jardín posterior | Sierra · foto 2 |
| `casas/sierra-3.jpg` | Cocina con isla | Sierra · foto 3 |
| `departamentos/centro-2.jpg` | Sala, comedor y cocina con vista a la ciudad | **Portada** Centro · foto 1 |
| `departamentos/centro-3.jpg` | Recámara | Centro · foto 2 |
| `departamentos/centro-1.jpg` | Edificio + ficha técnica (vertical) | Centro · foto 3 |
| `departamentos/plaza-1.jpg` | Edificio | **Portada** Plaza · foto 1 |
| `departamentos/plaza-2.jpg` | Sala y cocina ⚠️ tiene dos recuadros incrustados abajo (fallo de la IA); conviene regenerarla | Plaza · foto 2 |
| `departamentos/plaza-3.jpg` | Recámara | Plaza · foto 3 |
| `departamentos/mirador-1.jpg` | Edificio | **Portada** Mirador · foto 1 |
| `departamentos/mirador-2.jpg` | Sala con vista a la ciudad | Mirador · foto 2 |
| `departamentos/mirador-3.jpg` | Recámara principal | Mirador · foto 3 |

## Retirado

- `amenidades/areas-verdes.jpg`: se quitó de la sección “Características y amenidades”, que ahora es solo
  una cuadrícula de beneficios. Si más adelante generas una foto de un **área común** del desarrollo
  (no un patio privado), se puede volver a agregar.

## Opcional

- `videos/recorrido-vive-sam.mp4`: recorrido de 30–60 s, útil para campañas de YouTube o Performance Max.
- Los PNG originales de Encino y Centro (`Encino-1.png`, `Centro-1.png`, etc.) ya no se usan: se convirtieron a JPG.
  Puedes borrarlos antes de subir el sitio (suman ~5 MB).
