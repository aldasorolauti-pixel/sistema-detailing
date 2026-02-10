# Guía de Desarrollo - Detailing Booking

## 🎨 Sistema de Diseño

### Colores

El proyecto utiliza un sistema de colores personalizado definido en `tailwind.config.js`:

**Primary (Amarillo)**
- `primary-50` a `primary-900`: Escala completa del color amarillo (#F59E0B)
- Uso: Botones principales, acentos, elementos destacados

**Secondary (Gris Oscuro)**
- `secondary-50` a `secondary-900`: Escala de grises (#1F2937)
- Uso: Textos, fondos, elementos secundarios

### Componentes UI Reutilizables

#### Button
```jsx
import { Button } from './components/ui';

<Button variant="primary">Click me</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
```

#### Card
```jsx
import { Card } from './components/ui';

<Card title="Mi Card">
  Contenido aquí
</Card>
```

#### Input
```jsx
import { Input } from './components/ui';

<Input 
  label="Email"
  type="email"
  id="email"
  error="Error message"
/>
```

## 📁 Estructura de Archivos

```
src/
├── components/
│   ├── ui/              # Componentes reutilizables
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Input.jsx
│   │   └── index.js
│   ├── booking/         # Componentes de reservas
│   │   ├── BookingForm.jsx
│   │   └── index.js
│   └── layout/          # Componentes de layout
│       ├── Layout.jsx
│       └── index.js
├── hooks/               # Custom hooks (vacío por ahora)
├── utils/               # Funciones utilitarias
│   └── helpers.js
├── lib/                 # Constantes y configuración
│   └── constants.js
├── App.jsx              # Componente principal
├── main.jsx             # Entry point
└── index.css            # Estilos globales
```

## 🔧 Utilidades Disponibles

### helpers.js
- `formatDate(date)` - Formatea fechas al formato argentino
- `formatTime(time)` - Formatea horas
- `validateEmail(email)` - Valida emails
- `validatePhone(phone)` - Valida teléfonos
- `formatCurrency(amount)` - Formatea moneda ARS

### constants.js
- `SERVICES` - Array de servicios disponibles
- `BUSINESS_HOURS` - Horarios de atención
- `DAYS_OFF` - Días no laborables

## 🌙 Dark Mode

El dark mode está implementado con:
- Toggle en el Header
- Persistencia en localStorage
- Clase `dark` en el elemento raíz

```jsx
// Activar dark mode
document.documentElement.classList.add('dark');

// Desactivar dark mode
document.documentElement.classList.remove('dark');
```

## 🎯 Próximos Pasos Sugeridos

1. **Backend Integration**
   - Crear API endpoints para reservas
   - Implementar base de datos (MongoDB/PostgreSQL)
   - Agregar autenticación (JWT)

2. **Features Adicionales**
   - Calendario interactivo
   - Sistema de notificaciones (email/SMS)
   - Panel de administración
   - Gestión de disponibilidad
   - Historial de reservas

3. **Mejoras UI/UX**
   - Animaciones con Framer Motion
   - Toast notifications
   - Loading states
   - Error boundaries
   - Formulario multi-step

4. **Testing**
   - Unit tests con Vitest
   - Integration tests
   - E2E tests con Playwright

5. **Deployment**
   - Configurar CI/CD
   - Deploy en Vercel/Netlify
   - Configurar dominio personalizado

## 📝 Convenciones de Código

- Usar componentes funcionales con hooks
- PropTypes para validación de props
- Nombres de archivos en PascalCase para componentes
- Nombres de archivos en camelCase para utilidades
- Exportar componentes con named exports
- Usar barrel exports (index.js) en carpetas

## 🚀 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint
```

## 💡 Tips

1. **Tailwind Classes**: Usa las clases predefinidas en `index.css` como `.btn-primary`, `.input-field`, `.card`
2. **Dark Mode**: Siempre incluir variantes dark en nuevos componentes
3. **Iconos**: Importar de `lucide-react` según necesidad
4. **Responsive**: Usar prefijos `md:`, `lg:` para diseño responsive
