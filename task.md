# Tareas de Integración Supabase

- [x] **Configuración Inicial**
  - [x] Crear `.env.local` con credenciales `VITE_`
  - [x] Verificar `supabaseClient.js` para Vite
  - [x] Reiniciar servidor y probar conexión

- [x] **Gestión de Servicios (Precios Dinámicos)**
  - [x] Refactorizar `ConfigContext.jsx` para usar Supabase (`fetch`, `insert`, `update`, `delete`)
  - [x] Eliminar/Comentar array hardcodeado `SERVICES` en `constants.js`
  - [x] Conectar `User2.jsx` (Formulario Cliente) a través del Contexto (automático)
  - [x] Conectar `AdminSettings.jsx` (Panel Admin) a través del Contexto (automático)
  - [x] Crear script SQL de migración para servicios iniciales (`supabase_services.sql`)

- [ ] **Próximos Pasos**
  - [ ] Verificar que los servicios se carguen correctamente en el frontend
  - [ ] Probar creación, edición y eliminación desde el Admin
