# 📚 Ejemplos de Código

## Componentes UI

### Usando Button

```jsx
import { Button } from './components/ui';

// Botón primario
<Button variant="primary" onClick={handleClick}>
  Reservar Ahora
</Button>

// Botón secundario
<Button variant="secondary" type="submit">
  Enviar
</Button>

// Botón outline
<Button variant="outline" onClick={handleCancel}>
  Cancelar
</Button>

// Botón ghost
<Button variant="ghost" onClick={handleEdit}>
  Editar
</Button>

// Botón deshabilitado
<Button variant="primary" disabled>
  Procesando...
</Button>
```

### Usando Card

```jsx
import { Card } from './components/ui';

// Card simple
<Card>
  <p>Contenido de la card</p>
</Card>

// Card con título
<Card title="Mis Reservas">
  <ul>
    <li>Reserva 1</li>
    <li>Reserva 2</li>
  </ul>
</Card>

// Card con clases personalizadas
<Card className="hover:shadow-2xl transition-shadow" title="Destacado">
  <p>Contenido especial</p>
</Card>
```

### Usando Input

```jsx
import { Input } from './components/ui';
import { useState } from 'react';

function MyForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (!e.target.value.includes('@')) {
      setError('Email inválido');
    } else {
      setError('');
    }
  };

  return (
    <Input
      id="email"
      label="Email"
      type="email"
      value={email}
      onChange={handleChange}
      error={error}
      placeholder="tu@email.com"
    />
  );
}
```

## Layout

### Usando Layout

```jsx
import { Layout } from './components/layout';

function App() {
  return (
    <Layout>
      <h1>Mi Contenido</h1>
      <p>El layout incluye header con dark mode toggle y footer</p>
    </Layout>
  );
}
```

## Iconos con Lucide React

```jsx
import { Calendar, Clock, Car, User, Mail, Phone } from 'lucide-react';

// Icono simple
<Calendar className="w-6 h-6" />

// Icono con color
<Clock className="w-6 h-6 text-primary" />

// Icono en botón
<button className="flex items-center gap-2">
  <Car className="w-5 h-5" />
  <span>Mi Vehículo</span>
</button>

// Icono con animación
<Mail className="w-6 h-6 hover:text-primary transition-colors" />
```

## Utilidades

### Usando helpers.js

```jsx
import { 
  formatDate, 
  formatTime, 
  validateEmail, 
  validatePhone,
  formatCurrency 
} from './utils/helpers';

// Formatear fecha
const formattedDate = formatDate('2026-02-10');
// Output: "10 de febrero de 2026"

// Formatear hora
const formattedTime = formatTime('14:30');
// Output: "14:30"

// Validar email
const isValidEmail = validateEmail('test@example.com');
// Output: true

// Validar teléfono
const isValidPhone = validatePhone('+54 9 11 1234-5678');
// Output: true

// Formatear moneda
const price = formatCurrency(15000);
// Output: "$15.000,00"
```

### Usando constants.js

```jsx
import { SERVICES, BUSINESS_HOURS, DAYS_OFF } from './lib/constants';

// Listar servicios
SERVICES.map(service => (
  <option key={service.id} value={service.id}>
    {service.name} - {formatCurrency(service.price)}
  </option>
));

// Verificar horario de atención
console.log(`Abrimos de ${BUSINESS_HOURS.start} a ${BUSINESS_HOURS.end}`);

// Verificar si un día está disponible
const isDayOff = (dayNumber) => DAYS_OFF.includes(dayNumber);
```

## Formularios

### Formulario con Estado

```jsx
import { useState } from 'react';
import { Input, Button, Card } from './components/ui';

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Aquí iría la lógica de envío
  };

  return (
    <Card title="Contacto">
      <form onSubmit={handleSubmit}>
        <Input
          id="name"
          name="name"
          label="Nombre"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <Input
          id="email"
          name="email"
          type="email"
          label="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Mensaje
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="input-field"
            rows="4"
            required
          />
        </div>
        <Button type="submit" variant="primary">
          Enviar Mensaje
        </Button>
      </form>
    </Card>
  );
}
```

## Dark Mode

### Toggle Manual de Dark Mode

```jsx
import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
    
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <button onClick={toggleDarkMode}>
      {darkMode ? <Sun /> : <Moon />}
    </button>
  );
}
```

## Tailwind Classes Personalizadas

### Usando las clases del index.css

```jsx
// Botón con clase personalizada
<button className="btn-primary">
  Click Me
</button>

// Input con clase personalizada
<input className="input-field" type="text" />

// Card con clase personalizada
<div className="card">
  <h3>Título</h3>
  <p>Contenido</p>
</div>
```

## Responsive Design

```jsx
// Grid responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
  <Card>Item 4</Card>
</div>

// Texto responsive
<h1 className="text-2xl md:text-4xl lg:text-5xl">
  Título Responsive
</h1>

// Padding responsive
<div className="p-4 md:p-6 lg:p-8">
  Contenido con padding responsive
</div>
```

## Animaciones y Transiciones

```jsx
// Hover con transición
<div className="transition-all duration-300 hover:scale-105 hover:shadow-xl">
  Hover sobre mí
</div>

// Fade in con opacity
<div className="opacity-0 hover:opacity-100 transition-opacity duration-500">
  Aparezco gradualmente
</div>

// Slide con transform
<div className="transform translate-x-0 hover:translate-x-2 transition-transform">
  Me deslizo
</div>
```

## Custom Hooks (Ejemplo)

```jsx
// src/hooks/useLocalStorage.js
import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

// Uso
import { useLocalStorage } from './hooks/useLocalStorage';

function MyComponent() {
  const [user, setUser] = useLocalStorage('user', null);
  
  return (
    <div>
      <p>Usuario: {user?.name}</p>
      <button onClick={() => setUser({ name: 'Juan' })}>
        Guardar Usuario
      </button>
    </div>
  );
}
```
