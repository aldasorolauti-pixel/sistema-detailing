// Tipos de vehículos con multiplicadores de precio
export const VEHICLES = [
    {
        id: 'citycar',
        name: 'Citycar',
        subtitle: 'Compacto',
        description: 'Autos compactos (ej. Swift, i10)',
        multiplier: 1.0,
        icon: '🚗',
    },
    {
        id: 'sedan',
        name: 'Sedan',
        subtitle: 'Mediano',
        description: 'Autos medianos (ej. Corolla, 3)',
        multiplier: 1.2,
        icon: '🚙',
    },
    {
        id: 'suv',
        name: 'SUV',
        subtitle: 'Grande',
        description: 'Camionetas familiares (ej. RAV4)',
        multiplier: 1.5,
        icon: '🚐',
    },
    {
        id: 'pickup',
        name: 'Pickup',
        subtitle: 'Extra Grande',
        description: 'Camionetas grandes (ej. F-150)',
        multiplier: 1.8,
        icon: '🛻',
    },
];

// Servicios disponibles con precios base
export const SERVICES = [
    {
        id: 'lavado-premium',
        name: 'Lavado Premium',
        description: 'Interior/Exterior completo',
        basePrice: 5000,
        duration: 90, // minutos
        icon: '✨',
    },
    {
        id: 'tratamiento-cueros',
        name: 'Tratamiento de Cueros',
        description: 'Limpieza y acondicionamiento',
        basePrice: 3000,
        duration: 60,
        icon: '🪑',
    },
    {
        id: 'pulido-pintura',
        name: 'Pulido de Pintura',
        description: 'Corrección de pintura profesional',
        basePrice: 8000,
        duration: 180,
        icon: '💎',
    },
    {
        id: 'ceramico',
        name: 'Tratamiento Cerámico',
        description: 'Protección cerámica de larga duración',
        basePrice: 15000,
        duration: 240,
        icon: '🛡️',
    },
    {
        id: 'motor',
        name: 'Limpieza de Motor',
        description: 'Desengrase y limpieza profunda',
        basePrice: 2500,
        duration: 45,
        icon: '⚙️',
    },
    {
        id: 'ozono',
        name: 'Sanitización con Ozono',
        description: 'Eliminación de olores y bacterias',
        basePrice: 2000,
        duration: 30,
        icon: '🌬️',
    },
];

// Horarios disponibles
export const TIME_SLOTS = [
    { time: '09:00', label: '9:00 AM' },
    { time: '10:00', label: '10:00 AM' },
    { time: '11:00', label: '11:00 AM' },
    { time: '12:00', label: '12:00 PM' },
    { time: '13:00', label: '1:00 PM' },
    { time: '14:00', label: '2:00 PM' },
    { time: '15:00', label: '3:00 PM' },
    { time: '16:00', label: '4:00 PM' },
    { time: '17:00', label: '5:00 PM' },
    { time: '18:00', label: '6:00 PM' },
];

// Días de la semana (0 = Domingo)
export const DAYS_OFF = [0]; // Domingo cerrado

// Capacidad por slot
export const CAPACITY_PER_SLOT = 3;

// Pasos del wizard
export const WIZARD_STEPS = [
    { id: 1, name: 'Vehículo', label: 'Seleccioná tu vehículo' },
    { id: 2, name: 'Servicios', label: 'Elegí los servicios' },
    { id: 3, name: 'Fecha', label: 'Fecha y hora' },
    { id: 4, name: 'Datos', label: 'Tus datos' },
    { id: 5, name: 'Confirmar', label: 'Confirmación' },
];
