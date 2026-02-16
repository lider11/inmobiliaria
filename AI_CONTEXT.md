# AI_CONTEXT.md

## 1) Resumen operativo
Proyecto web estático de generación de leads para venta de lotes campestres.  
Canal principal de conversión: WhatsApp (`wa.me`).

## 2) Entrada y archivos críticos
- Entrada principal: `index.html`
- Estilos: `styles.css`
- Lógica: `app.js`

## 3) Modelo de datos (frontend)
En `app.js` existen dos estructuras clave:

1. `BUSINESS`
- `name`: nombre comercial.
- `project`: nombre del proyecto.
- `whatsappNumber`: número destino para CTAs.
- `defaultMessage`: mensaje inicial para conversaciones.

2. `LOTS` (array)
- `id`: identificador del lote.
- `area`: área en m2.
- `type`: categoría (`estandar` o `premium`).
- `label`: etiqueta visual.
- `price`: precio numérico.
- `status`: estado comercial.
- `note`: descripción breve.

## 4) Flujos de usuario
1. Usuario navega secciones desde menú.
2. Usuario filtra lotes por texto/tipo.
3. Usuario cotiza por botón de lote o CTA principal.
4. Usuario completa formulario y se abre WhatsApp con mensaje generado.

## 5) Contratos HTML/JS importantes
IDs esperados por `app.js`:
- `lotsGrid`, `search`, `filter`, `countPill`, `resetBtn`
- `leadForm`, `copyBtn`
- `waFloat`, `ctaWhats`
- `themeBtn`, `themeBtn2`
- `drawer`, `openDrawer`, `closeDrawer`
- `year`

Si se elimina/renombra alguno de estos IDs, la funcionalidad se rompe.

## 6) Decisiones técnicas actuales
- Sin bundler ni framework; todo corre en navegador.
- Persistencia mínima usando `localStorage` (tema).
- Formulario no envía correos; solo construye texto para WhatsApp.

## 7) Cambios aplicados en este parche
- `index,html` renombrado a `index.html`.
- Ruta de galería corregida a `./asset/img/Portada-1.jpeg`.
- Video `recorrido 3.mp4` renombrado a `recorrido-3.mp4` y referencia HTML actualizada.
- Documentación añadida: `AGENTS.md`, `README.md`, `AI_CONTEXT.md`.

## 8) Accesibilidad (estado actual)
- Objetivo: acercar cumplimiento a WCAG 2.1 AA.
- Implementado:
  - `skip-link` al contenido principal.
  - Landmark principal con `<main id="main-content">`.
  - Foco visible con `:focus-visible` para enlaces, botones e inputs.
  - Labels asociados a campos del formulario (`for` + `id`).
  - FAQ con `aria-expanded`, `aria-controls` y paneles con `hidden`.
  - Drawer móvil con `role="dialog"`, `aria-modal`, cierre con `Escape`, foco inicial, focus trap y retorno de foco.
  - Respeto de `prefers-reduced-motion` en CSS y scroll JS.
  - Tracks de subtítulos en videos (`.vtt` base).

## 9) Pendientes de accesibilidad recomendados
- Reemplazar subtítulos base por transcripción real completa por video.
- Ejecutar auditoría automática (Lighthouse/axe) y prueba manual con lector de pantalla.
- Revisar contraste en todos los estados hover/focus para confirmar AA en ambos temas.

## 10) Riesgos y pendientes recomendados
- Cambiar `BUSINESS.whatsappNumber` por número real.
- Reemplazar lotes demo por inventario real.
- Opcional: mover estilos inline del toast a CSS para mantenimiento.
- Opcional: agregar validaciones más estrictas al formulario (teléfono y email).

## 11) Propuestas para mejorar amenidades (comercial y experiencia)
1. **Club social multipropósito**
   - Salón para eventos familiares y comunitarios con zona BBQ y cocineta.
   - Beneficio: incrementa la percepción de valor del proyecto y fomenta vida en comunidad.

2. **Circuito eco-deportivo**
   - Senderos peatonales/ciclorruta con estaciones de ejercicio al aire libre y señalética.
   - Beneficio: apela a compradores que priorizan bienestar, naturaleza y hábitos saludables.

3. **Zona de bienestar campestre**
   - Espacio para yoga/meditación, mirador, jardines nativos y áreas de descanso.
   - Beneficio: diferencia el proyecto frente a ofertas urbanas y refuerza la promesa de tranquilidad.

4. **Amenidades familiares seguras**
   - Parque infantil con piso amortiguado, cancha múltiple y área pet-friendly delimitada.
   - Beneficio: amplía el mercado objetivo (familias con niños y mascotas) y mejora permanencia.

5. **Infraestructura de conectividad y trabajo remoto**
   - Puntos Wi-Fi en áreas comunes, pérgolas con enchufes y pequeño coworking campestre.
   - Beneficio: aumenta atractivo para compradores que combinan vivienda, descanso y teletrabajo.
