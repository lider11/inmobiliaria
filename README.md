# Inmobiliaria Mary - Landing de Lotes Campestres

Sitio web estático para promocionar un proyecto inmobiliario y captar prospectos por WhatsApp.

## Estructura
- `index.html`: contenido y secciones del sitio
- `styles.css`: estilos globales, layout y responsive
- `app.js`: lógica (filtros, WhatsApp, formulario, tema, animaciones)
- `asset/img`: imágenes locales
- `asset/video`: videos locales

## Funcionalidades principales
- Navegación por secciones con scroll suave.
- Catálogo de lotes con filtro por texto y tipo.
- Enlaces dinámicos a WhatsApp.
- Formulario de contacto que construye mensaje para WhatsApp.
- Modo claro/oscuro con persistencia en `localStorage`.
- Menú móvil tipo drawer.

## Configuración rápida
Editar `app.js`:
- `BUSINESS.whatsappNumber`: número real en formato internacional (sin `+` ni espacios).
- `BUSINESS.defaultMessage`: mensaje inicial.
- `LOTS`: inventario de lotes, áreas y precios.

## Nota de despliegue
El archivo de entrada es `index.html`.  
Verificar que el servidor sirva correctamente archivos con rutas relativas `./asset/...`.

## Documentación para IA
Consultar:
- `AGENTS.md` para reglas operativas de agentes.
- `AI_CONTEXT.md` para contexto técnico detallado del proyecto.

