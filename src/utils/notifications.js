import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { BUSINESS_CONFIG } from './constants';

// Helpers de formato
const formatDate = (dateStr) => {
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    return format(date, "EEEE d 'de' MMMM", { locale: es });
};

const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 0
    }).format(price);
};

const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins === 0 ? `${hours}h` : `${hours}h ${mins}min`;
};

// Función principal: generar mensaje según tipo
export const generateWhatsAppMessage = (type, booking) => {
    const turnoId = booking.id.slice(-6).toUpperCase();

    const templates = {
        // Cliente acaba de hacer reserva online
        'booking-created': `
🚗 *NUEVA RESERVA - ${turnoId}*

Hola! Acabás de hacer una reserva en ${BUSINESS_CONFIG.name}.

📅 *Fecha:* ${formatDate(booking.date)}
🕐 *Hora:* ${booking.time}:00 hrs
🚗 *Vehículo:* ${booking.vehicle?.name || 'N/A'}
✨ *Servicios:*
${booking.services?.map(s => `  • ${s.name}`).join('\n') || 'N/A'}

💰 *Total estimado:* ${formatPrice(booking.price)}
⏱️ *Duración:* ${formatDuration(booking.duration)}

⚠️ *Tu reserva está PENDIENTE de confirmación.*
Te confirmaremos en las próximas horas.

¿Alguna duda? Respondé este mensaje.
    `.trim(),

        // Admin solicita seña (Estado: waiting_deposit)
        'waiting_deposit': `
Hola ${booking.client?.name || 'Cliente'}! 👋 Hablamos de ${BUSINESS_CONFIG.name}.
Para confirmar tu turno del *${formatDate(booking.date)} a las ${booking.time}:00 hrs* necesitamos una seña del ${BUSINESS_CONFIG.depositPercentage}%.

💰 *Total:* ${formatPrice(booking.price)}
💳 *Seña a transferir:* ${formatPrice(booking.price * (BUSINESS_CONFIG.depositPercentage / 100))}

🏦 *Datos Bancarios:*
• Banco: ${BUSINESS_CONFIG.banking.bank}
• Alias: ${BUSINESS_CONFIG.banking.alias}
• CBU: ${BUSINESS_CONFIG.banking.cbu}
• Titular: ${BUSINESS_CONFIG.banking.accountHolder}

Por favor envianos el comprobante por acá para confirmar tu lugar. ⏳
        `.trim(),

        // Admin confirma turno (Estado: confirmed)
        'booking-confirmed': `
¡Confirmadísimo! ✅
Recibimos el pago/confirmación. Tu turno quedó agendado.

🚗 *Vehículo:* ${booking.vehicle?.name || 'N/A'}${booking.client?.plate ? ` (${booking.client.plate})` : ''}
📅 *Te esperamos el:* ${formatDate(booking.date)} ${booking.time}:00 hrs
📍 *Ubicación:* ${BUSINESS_CONFIG.address}

IMPORTANTE:
• Traer el auto lo más vacío posible.
• La tolerancia de espera es de 15 min.

¡Nos vemos!
        `.trim(),

        // Admin marca servicio como terminado (Estado: completed)
        'booking-completed': `
¡Tu auto está listo! 💎🚗
Quedó increíble. Ya podés pasar a retirarlo.

🛠 *Trabajo realizado:*
${(booking.services || []).map(s => `• ${typeof s === 'string' ? s : s.name}`).join('\n')}

💵 *Saldo restante:* ${formatPrice(booking.price ? booking.price * (1 - BUSINESS_CONFIG.depositPercentage / 100) : 0)}

Te esperamos hasta las 19:00hs. ¡Gracias por confiar!
        `.trim(),

        // Admin cancela turno
        'booking-cancelled': `
❌ *TURNO CANCELADO - ${turnoId}*

Hola ${booking.client?.name || 'Cliente'},

Tu turno para el *${formatDate(booking.date)}* a las *${booking.time}:00 hrs* 
ha sido cancelado.

Si querés reprogramar, respondé este mensaje o hacé una nueva 
reserva en nuestra web.

Disculpá las molestias.
        `.trim()
    };

    return templates[type] || '';
};

// Función para abrir WhatsApp con el mensaje
export const sendWhatsAppNotification = (type, booking) => {
    // Limpiar número de teléfono (solo dígitos)
    const phone = (booking.client?.phone || '').replace(/\D/g, '');

    if (!phone) {
        console.error('No se puede enviar notificación: teléfono vacío');
        return false;
    }

    // Generar mensaje
    const message = generateWhatsAppMessage(type, booking);

    if (!message) {
        console.error('Tipo de notificación inválido:', type);
        return false;
    }

    // Codificar mensaje para URL
    const encodedMessage = encodeURIComponent(message);

    // Construir URL de WhatsApp
    const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;

    // Abrir en nueva pestaña
    window.open(whatsappUrl, '_blank');

    // Log para debugging
    console.log('📱 WhatsApp notification sent:', {
        type,
        phone,
        bookingId: booking.id
    });

    return true;
};
