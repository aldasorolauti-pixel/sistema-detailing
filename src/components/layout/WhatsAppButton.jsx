import React from 'react';
import { BUSINESS_CONFIG } from '../../utils/constants';

export default function WhatsAppButton() {
    const openWhatsApp = () => {
        const message = encodeURIComponent(
            'Hola! Tengo una consulta sobre los servicios de detailing.'
        );
        window.open(
            `https://wa.me/${BUSINESS_CONFIG.phone}?text=${message}`,
            '_blank'
        );
    };

    return (
        <button
            onClick={openWhatsApp}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 animate-bounce cursor-pointer group"
            aria-label="Contactar por WhatsApp"
        >
            <span className="material-symbols-outlined text-white text-3xl">chat</span>
            <div className="absolute right-full mr-4 bg-white text-black px-4 py-2 rounded-xl text-sm font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                ¡Hablemos!
            </div>
        </button>
    );
}
