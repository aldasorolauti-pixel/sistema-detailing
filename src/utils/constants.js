export const BUSINESS_CONFIG = {
    // DATOS DEL NEGOCIO
    name: 'LuxeDetail',
    slug: 'luxedetail',
    tagline: 'Cuidado profesional para tu vehículo',

    // CONTACTO
    phone: '5493516361678', // WhatsApp business
    email: 'contacto@luxedetail.com.ar',

    // UBICACIÓN
    address: 'Av. Rafael Núñez 3850',
    city: 'Córdoba',
    province: 'Córdoba',
    country: 'Argentina',
    mapsUrl: 'https://maps.google.com/?q=Córdoba+Argentina',

    // HORARIOS (para mostrar en landing)
    schedule: {
        weekdays: 'Lun - Vie: 09:00 - 19:00',
        saturday: 'Sábados: 09:00 - 14:00',
        sunday: 'Cerrado'
    },

    // DATOS BANCARIOS (para mensajes de seña)
    banking: {
        alias: 'aldasoro.lauti',
        cbu: '0000003100032518582215',
        accountHolder: 'Lautaro Gabriel Aldasoro',
        bank: 'Banco Galicia'
    },

    // SOCIAL (opcional)
    instagram: '@luxedetail',
    facebook: 'LuxeDetailCordoba',

    // POLÍTICAS
    depositPercentage: 30, // % de seña requerida
    cancellationHours: 24 // horas mínimas para cancelar sin cargo
};

// Helper para formatear teléfono
export const formatPhone = (phone) => {
    // De 5493516361678 a +54 9 351 636-1678
    return phone.replace(/(\d{2})(\d{1})(\d{3})(\d{3})(\d{4})/, '+$1 $2 $3 $4-$5');
};
