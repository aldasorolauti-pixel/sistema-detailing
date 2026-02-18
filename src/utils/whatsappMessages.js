import { BUSINESS_CONFIG } from './constants';

// Helper para formatear fecha
const formatDate = (date) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  // Ajustar zona horaria si es necesario, asumiendo input en ISO o Date local correcto
  // Para evitar problemas de timezone, usamos getters locales
  const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
                  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  return `${days[d.getDay()]} ${d.getDate()} de ${months[d.getMonth()]}`;
};

// Helper para formatear precio
const formatPrice = (amount) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0
  }).format(amount);
};

// Helper para construir link de WhatsApp
const buildWhatsAppLink = (phone, message) => {
  if (!phone) return '#';
  const cleanPhone = phone.replace(/\D/g, ''); // Solo dígitos
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
};

// 1. MENSAJE DE SOLICITUD DE SEÑA
export const getDepositMessage = (booking) => {
  // Validar y formatear servicios
  const servicesList = booking.services
    ?.map(s => typeof s === 'string' ? s : s.name)
    .filter(Boolean)
    .join('\n• ') || 'Servicios seleccionados';
  
  // Calcular precio total si no está definido (fallback simple)
  // Nota: Idealmente el booking ya debería tener el precio total calculado
  const total = booking.price || 0;
  const depositAmount = Math.round(total * 0.3);
  
  const message = `
Hola ${booking.client?.name || ''}! 👋

Te escribimos de *${BUSINESS_CONFIG.name}*.

Recibimos tu solicitud para el *${booking.vehicle?.name || booking.vehicle || 'vehículo'}*${booking.client?.plate ? ` (Patente: ${booking.client.plate})` : ''}.

Para confirmar la fecha del *${formatDate(booking.date)} a las ${booking.time}:00hs* necesitamos una seña inicial.

✨ *Servicios solicitados:*
- ${servicesList}

💰 *Total del trabajo:* ${formatPrice(total)}
💳 *Seña a abonar (30%):* ${formatPrice(depositAmount)}

🏦 *Datos para transferir:*
- Banco: ${BUSINESS_CONFIG.banking.bank}
- Alias: ${BUSINESS_CONFIG.banking.alias}
- CBU: ${BUSINESS_CONFIG.banking.cbu}
- Titular: ${BUSINESS_CONFIG.banking.accountHolder}

Enviame el comprobante por acá y te confirmo el turno! ⏳
  `.trim();
  
  return buildWhatsAppLink(booking.client?.phone, message);
};

// 2. MENSAJE DE CONFIRMACIÓN DE TURNO
export const getConfirmMessage = (booking) => {
  const servicesList = booking.services
    ?.map(s => typeof s === 'string' ? s : s.name)
    .filter(Boolean)
    .join('\n• ') || 'Servicios seleccionados';

  const depositPaid = booking.depositPaid || booking.status === 'waiting_deposit';
  const total = booking.price || 0;
  const depositAmount = depositPaid ? Math.round(total * 0.3) : 0;
  const remainingBalance = total - depositAmount;
  
  const message = `
¡Turno Confirmado! ✅

Tu lugar para el *${booking.vehicle?.name || booking.vehicle || 'vehículo'}* ya está reservado.

📅 *Fecha:* ${formatDate(booking.date)}
⏰ *Hora:* ${booking.time}:00hs
📍 *Ubicación:* ${BUSINESS_CONFIG.address}, ${BUSINESS_CONFIG.city}

🛠 *Servicios confirmados:*
- ${servicesList}

💰 *${depositPaid ? 'Saldo restante' : 'Total'} a abonar:* ${formatPrice(remainingBalance)}
${depositPaid ? `(Seña abonada: ${formatPrice(depositAmount)})` : ''}

⚠️ *IMPORTANTE:*
- Traer el auto con la menor cantidad de cosas posible
- Tolerancia de espera: 15 minutos
- Si no podés venir, avisanos con 24hs de anticipación

¡Nos vemos! 🚗✨
  `.trim();
  
  return buildWhatsAppLink(booking.client?.phone, message);
};

// 3. MENSAJE DE AUTO LISTO
export const getReadyMessage = (booking) => {
  const servicesList = booking.services
    ?.map(s => typeof s === 'string' ? s : s.name)
    .filter(Boolean)
    .join('\n• ') || 'Servicios realizados';
  
  // Calcular saldo restante
  // Calcular saldo restante
  // Ahora confiamos en que el booking tiene la info correcta gracias a AdminContext
  const depositPaid = booking.depositPaid === true; // Asegurar booleano
  
  const total = booking.price || 0;
  const depositAmount = depositPaid ? Math.round(total * 0.3) : 0;
  const remainingBalance = total - depositAmount;
  
  const message = `
¡Tu auto está listo! 💎🚗

El trabajo sobre el *${booking.vehicle?.name || booking.vehicle || 'vehículo'}*${booking.client?.plate ? ` (${booking.client.plate})` : ''} quedó terminado.

🛠 *Servicios realizados:*
- ${servicesList}

💵 *${depositPaid ? 'Saldo restante' : 'Total'} a abonar:* ${formatPrice(remainingBalance)}
${depositPaid ? `(Seña abonada: ${formatPrice(depositAmount)})` : ''}

📍 Podés pasar a retirarlo a ${BUSINESS_CONFIG.address}, ${BUSINESS_CONFIG.city}.

⏰ *Horario:* Hasta las 19:00hs

¡Gracias por confiar en ${BUSINESS_CONFIG.name}! 🙌
  `.trim();
  
  return buildWhatsAppLink(booking.client?.phone, message);
};
