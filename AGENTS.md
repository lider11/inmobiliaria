# AGENTS.md

## Objetivo del proyecto
Landing page estática para promocionar lotes campestres de **Constructora Nuevo Mundo** y convertir leads por WhatsApp.

## Stack
- HTML: `index.html`
- CSS: `styles.css`
- JavaScript vanilla: `app.js`
- Assets locales: `asset/img`, `asset/video`

## Reglas para agentes de IA
1. Mantener el proyecto **sin frameworks** salvo instrucción explícita.
2. Conservar compatibilidad móvil y escritorio.
3. No romper enlaces de WhatsApp ni lógica de formularios.
4. Usar rutas existentes bajo `./asset/...` (no `assets/...`).
5. Si se cambian nombres de archivos multimedia, actualizar referencias en `index.html`.
6. Priorizar textos en español y codificación UTF-8.
7. Evitar dependencias externas innecesarias.

## Flujo recomendado al modificar
1. Revisar `index.html`, `styles.css`, `app.js`.
2. Confirmar que IDs usados en JS existan en HTML.
3. Validar rutas de imágenes y videos.
4. Verificar comportamiento de:
   - Filtro de lotes
   - CTA de WhatsApp
   - Formulario de contacto
   - Menú móvil y cambio de tema
5. Documentar cambios en `AI_CONTEXT.md`.

## Datos sensibles/configurables
- Número WhatsApp: `app.js` -> `BUSINESS.whatsappNumber`
- Mensaje base WhatsApp: `app.js` -> `BUSINESS.defaultMessage`
- Lotes y precios demo: `app.js` -> `LOTS`

