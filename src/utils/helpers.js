// Utility functions for the booking system

export const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

export const formatTime = (time) => {
    if (!time) return '';
    return time;
};

export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

export const validatePhone = (phone) => {
    const re = /^[\d\s\-+()]+$/;
    return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS'
    }).format(amount);
};
