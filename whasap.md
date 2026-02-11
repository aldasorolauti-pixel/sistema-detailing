Necesito implementar un sistema de notificaciones automáticas por WhatsApp 
que se disparen en los momentos clave del ciclo de vida de una reserva.

Por ahora será SEMI-AUTOMÁTICO: cuando ocurre un evento (confirmar turno, 
terminarlo, etc), se abre WhatsApp Web con el mensaje ya escrito, y el 
admin solo presiona Enter para enviarlo.

═══════════════════════════════════════════════════════════════
PASO 1: CREAR UTILIDAD DE NOTIFICACIONES
═══════════════════════════════════════════════════════════════

Crear archivo: src/utils/notifications.js

import { format } from 'date-fns';
import { es } from 'date-fns/locale';

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

Hola! Acabás de hacer una reserva en Premium Detailing.

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

    // Admin confirma turno SIN seña
    'booking-confirmed': `
✅ *TURNO CONFIRMADO - ${turnoId}*

Hola ${booking.client?.name || 'Cliente'}!

Tu reserva ha sido *confirmada* ✓

📅 *Fecha:* ${formatDate(booking.date)}
🕐 *Hora:* ${booking.time}:00 hrs
🚗 *Vehículo:* ${booking.vehicle?.name || 'N/A'}${booking.client?.plate ? ` (Patente: ${booking.client.plate})` : ''}

💰 *Total a pagar:* ${formatPrice(booking.price)}

⚠️ *IMPORTANTE:*
- Llegá 5 minutos antes
- Traé las llaves del vehículo
- El pago se realiza al finalizar el servicio

Nos vemos pronto! 👋
    `.trim(),

    // Admin confirma turno CON seña
    'deposit-required': `
💳 *SEÑA REQUERIDA - ${turnoId}*

Hola ${booking.client?.name || 'Cliente'}!

Para confirmar tu reserva necesitamos una seña del *30%*

💰 *Seña:* ${formatPrice(booking.price * 0.3)}
💰 *Total:* ${formatPrice(booking.price)}
💰 *Saldo restante:* ${formatPrice(booking.price * 0.7)}

*Datos para transferencia:*
- Alias: premium.detailing
- CBU: 0000000000000000000000
- Titular: Premium Detailing

Una vez realizada la transferencia, envianos el comprobante 
por este mismo chat.

📅 *Fecha reservada:* ${formatDate(booking.date)} a las ${booking.time}:00 hrs

El saldo restante se abona al finalizar el servicio.
    `.trim(),

    // Admin marca servicio como terminado
    'booking-completed': `
🎉 *SERVICIO COMPLETADO - ${turnoId}*

Hola ${booking.client?.name || 'Cliente'}!

Tu vehículo está listo! ✨

🚗 *${booking.vehicle?.name || 'Vehículo'}*${booking.client?.plate ? ` (${booking.client.plate})` : ''}

✅ *Servicios realizados:*
${booking.services?.map(s => `  • ${s.name}`).join('\n') || 'N/A'}

💰 *Total: ${formatPrice(booking.price)}*

*¡Gracias por confiar en Premium Detailing!*

⭐ Tu opinión nos ayuda a mejorar.
¿Cómo estuvo el servicio?

Esperamos verte pronto! 🚗💨
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

═══════════════════════════════════════════════════════════════
PASO 2: INTEGRAR EN EL WIZARD DEL CLIENTE
═══════════════════════════════════════════════════════════════

En BookingWizard.jsx (o donde esté la función confirmBooking):

import { sendWhatsAppNotification } from '../utils/notifications';

const confirmBooking = async () => {
  const booking = {
    id: `booking-${Date.now()}`,
    type: 'online',
    status: 'pending',
    vehicle: VEHICLES.find(v => v.id === selectedVehicle),
    services: selectedServices.map(id => SERVICES.find(s => s.id === id)),
    date: selectedDate,
    time: selectedTime,
    duration: calculateDuration(),
    price: calculatePrice(),
    client: clientData,
    createdAt: new Date().toISOString()
  };

  try {
    // Guardar en storage
    await window.storage.set(booking.id, JSON.stringify(booking));
    setBookings([...bookings, booking]);
    
    // ENVIAR NOTIFICACIÓN AL CLIENTE
    // Esto abrirá WhatsApp con el mensaje listo para enviar
    sendWhatsAppNotification('booking-created', booking);
    
  } catch (error) {
    console.error('Error guardando reserva:', error);
  }

  // Ir a pantalla de éxito
  setView('success');
};

═══════════════════════════════════════════════════════════════
PASO 3: INTEGRAR EN DETALLE DE TURNO (ADMIN)
═══════════════════════════════════════════════════════════════

En el modal/componente de detalle de turno, crear modal de confirmación:

AGREGAR AL STATE:
const [showConfirmModal, setShowConfirmModal] = useState(false);

MODAL DE CONFIRMACIÓN CON OPCIÓN DE SEÑA:
{showConfirmModal && (
  <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
    <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full">
      <h3 className="text-2xl font-bold mb-4">Confirmar Turno</h3>
      
      <p className="text-gray-300 mb-6">
        ¿Este turno requiere seña del 30% para confirmar?
      </p>
      
      <div className="bg-gray-700 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400">Total del servicio:</span>
          <span className="text-white font-bold">
            {formatPrice(booking.price)}
          </span>
        </div>
        <div className="flex justify-between items-center text-yellow-400">
          <span className="font-semibold">Seña (30%):</span>
          <span className="font-bold">
            {formatPrice(booking.price * 0.3)}
          </span>
        </div>
      </div>
      
      <div className="space-y-3">
        <button
          onClick={() => handleConfirmWithDeposit(true)}
          className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 
                     hover:shadow-lg text-black font-semibold py-4 rounded-xl 
                     transition-all"
        >
          💳 Sí, requiere seña
        </button>
        
        <button
          onClick={() => handleConfirmWithDeposit(false)}
          className="w-full bg-green-500 hover:bg-green-600 text-white 
                     font-semibold py-4 rounded-xl transition-all"
        >
          ✅ No, confirmar directo
        </button>
        
        <button
          onClick={() => setShowConfirmModal(false)}
          className="w-full bg-gray-600 hover:bg-gray-500 text-white 
                     font-semibold py-3 rounded-xl transition-all"
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
)}

FUNCIÓN PARA CONFIRMAR CON/SIN SEÑA:
const handleConfirmWithDeposit = async (requiresDeposit) => {
  try {
    // Actualizar status del turno
    const updatedBooking = {
      ...booking,
      status: 'confirmed',
      requiresDeposit: requiresDeposit,
      confirmedAt: new Date().toISOString()
    };
    
    await window.storage.set(booking.id, JSON.stringify(updatedBooking));
    
    // Enviar notificación según si requiere seña o no
    if (requiresDeposit) {
      sendWhatsAppNotification('deposit-required', updatedBooking);
    } else {
      sendWhatsAppNotification('booking-confirmed', updatedBooking);
    }
    
    // Cerrar modal y actualizar
    setShowConfirmModal(false);
    onClose();
    loadBookings();
    
  } catch (error) {
    console.error('Error confirmando turno:', error);
    alert('Error al confirmar turno');
  }
};

REEMPLAZAR EL BOTÓN "CONFIRMAR TURNO":
// Antes:
<button onClick={handleConfirm}>Confirmar Turno</button>

// Ahora:
<button onClick={() => setShowConfirmModal(true)}>
  Confirmar Turno
</button>

═══════════════════════════════════════════════════════════════
PASO 4: MARCAR COMO TERMINADO
═══════════════════════════════════════════════════════════════

const handleComplete = async () => {
  if (!window.confirm('¿El servicio está terminado?')) {
    return;
  }
  
  try {
    const updatedBooking = {
      ...booking,
      status: 'completed',
      completedAt: new Date().toISOString()
    };
    
    await window.storage.set(booking.id, JSON.stringify(updatedBooking));
    
    // NOTIFICAR AL CLIENTE
    sendWhatsAppNotification('booking-completed', updatedBooking);
    
    onClose();
    loadBookings();
    
  } catch (error) {
    console.error('Error marcando como terminado:', error);
    alert('Error al actualizar turno');
  }
};

═══════════════════════════════════════════════════════════════
PASO 5: CANCELAR TURNO
═══════════════════════════════════════════════════════════════

const handleCancel = async () => {
  if (!window.confirm('¿Seguro que querés cancelar este turno?')) {
    return;
  }
  
  try {
    const updatedBooking = {
      ...booking,
      status: 'cancelled',
      cancelledAt: new Date().toISOString()
    };
    
    await window.storage.set(booking.id, JSON.stringify(updatedBooking));
    
    // NOTIFICAR AL CLIENTE
    sendWhatsAppNotification('booking-cancelled', updatedBooking);
    
    onClose();
    loadBookings();
    
  } catch (error) {
    console.error('Error cancelando turno:', error);
    alert('Error al cancelar turno');
  }
};

═══════════════════════════════════════════════════════════════
PASO 6: INSTALAR date-fns (si no está)
═══════════════════════════════════════════════════════════════

npm install date-fns

(Para formatear fechas bonitas en español)

═══════════════════════════════════════════════════════════════
PASO 7: CONFIGURAR NÚMERO DE NEGOCIO
═══════════════════════════════════════════════════════════════

Agregar en src/utils/constants.js (o donde tengas configs):

export const BUSINESS_CONFIG = {
  phone: '5491234567890', // Sin espacios ni guiones
  whatsappAlias: 'premium.detailing',
  cbu: '0000000000000000000000',
  businessName: 'Premium Detailing'
};

Usar en templates donde dice "premium.detailing", etc.

═══════════════════════════════════════════════════════════════
TESTING:
═══════════════════════════════════════════════════════════════

1. CLIENTE HACE RESERVA:
   □ Se abre WhatsApp con mensaje al teléfono del cliente
   □ El mensaje tiene toda la info (fecha, hora, servicios, precio)
   □ Dice "PENDIENTE de confirmación"

2. ADMIN CONFIRMA SIN SEÑA:
   □ Modal pregunta si requiere seña
   □ Click "No, confirmar directo"
   □ Se abre WhatsApp con mensaje "Turno confirmado"
   □ NO menciona seña

3. ADMIN CONFIRMA CON SEÑA:
   □ Click "Sí, requiere seña"
   □ Se abre WhatsApp con datos de transferencia
   □ Muestra seña (30%), total, y saldo restante
   □ Muestra alias/CBU

4. ADMIN MARCA TERMINADO:
   □ Se abre WhatsApp con mensaje de agradecimiento
   □ Pide feedback/opinión

5. ADMIN CANCELA:
   □ Se abre WhatsApp con mensaje de cancelación
   □ Ofrece reprogramar

═══════════════════════════════════════════════════════════════
MEJORAS OPCIONALES (FUTURO):
═══════════════════════════════════════════════════════════════

- Integrar Twilio API para envíos automáticos (sin abrir WhatsApp)
- Agregar plantillas editables en configuración
- Recordatorios automáticos 24hs antes del turno
- Confirmación por parte del cliente (botones en WhatsApp)

Por favor implementa este sistema de notificaciones.