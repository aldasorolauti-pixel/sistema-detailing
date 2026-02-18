import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/useBooking';
import { useConfig } from '../../context/useConfig';
import { BUSINESS_CONFIG } from '../../utils/constants';
import { formatDuration } from '../../lib/formatters';

const User6 = () => {
    const navigate = useNavigate();
    const {
        resetBooking,
        setStep,
        selectedDate,
        selectedTime,
        selectedVehicle,
        selectedServices,
        clientData,
        calculatePrice,
        calculateDuration
    } = useBooking();
    const { vehicles, services: allServices } = useConfig();

    const handleNewBooking = () => {
        resetBooking();
        setStep(1);
    };

    const handleGoHome = () => {
        resetBooking();
        navigate('/');
    };

    const openWhatsApp = () => {
        const dateStr = selectedDate?.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' }) || '';
        const message = encodeURIComponent(
            `Hola! Acabo de hacer una reserva para el ${dateStr} a las ${selectedTime}. ¿Pueden confirmarme?`
        );
        window.open(`https://wa.me/${BUSINESS_CONFIG.phone}?text=${message}`, '_blank');
    };

    const vehicle = vehicles.find(v => v.id === selectedVehicle);
    const services = allServices.filter(s => selectedServices.includes(s.id));
    const totalPrice = calculatePrice();
    const totalDuration = calculateDuration();

    return (
        <div className="bg-gray-100 dark:bg-black font-sans flex items-center justify-center min-h-screen p-4 bg-cover bg-center bg-no-repeat relative">
            <style>
                {`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                @keyframes popIn {
                    0% { transform: scale(0); opacity: 0; }
                    70% { transform: scale(1.2); }
                    100% { transform: scale(1); opacity: 1; }
                }
                .animate-pop {
                    animation: popIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                }
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-slide-up {
                    animation: slideUp 0.5s ease-out forwards;
                }
                .delay-100 { animation-delay: 0.1s; }
                .delay-200 { animation-delay: 0.2s; }
                .delay-300 { animation-delay: 0.3s; }
                `}
            </style>

            <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
            <div className="absolute inset-0 z-0 bg-[#020617]/95 backdrop-blur-sm"></div>

            <div className="relative z-10 w-full max-w-[420px] bg-[#020617] rounded-[24px] shadow-2xl flex flex-col border border-white/10 ring-1 ring-white/5 my-auto">
                <div className="flex flex-col items-center justify-center w-full p-8 pt-12 pb-10">
                    {/* Check verde con espacio suficiente */}
                    <div className="relative flex items-center justify-center mb-8">
                        <div className="absolute w-36 h-36 bg-green-500/20 rounded-full blur-xl animate-pulse"></div>
                        <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/50 animate-pop z-10">
                            <span className="material-symbols-outlined text-white w-20 h-20 text-7xl font-bold flex items-center justify-center">check</span>
                        </div>
                    </div>

                    <div className="space-y-3 animate-slide-up delay-100">
                        <h1 className="text-white text-3xl font-bold tracking-tight">¡Reserva Confirmada!</h1>
                        <p className="text-white/50 text-sm font-medium px-4">Te contactaremos por WhatsApp para confirmar los detalles.</p>
                    </div>

                    <div className="w-full animate-slide-up delay-200 mt-8">
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[20px] p-6 space-y-5 shadow-lg relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F59E0B]/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>

                            {/* Fecha */}
                            <div className="flex items-start justify-between border-b border-white/10 pb-4">
                                <div className="flex flex-col items-start">
                                    <span className="text-white/40 text-xs uppercase tracking-wider font-semibold mb-1">Fecha</span>
                                    <div className="flex items-center gap-2 text-white">
                                        <span className="material-symbols-outlined text-[#F59E0B] text-xl">calendar_today</span>
                                        <span className="font-semibold text-base">
                                            {selectedDate?.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' })}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Hora */}
                            <div className="flex items-start justify-between border-b border-white/10 pb-4">
                                <div className="flex flex-col items-start">
                                    <span className="text-white/40 text-xs uppercase tracking-wider font-semibold mb-1">Hora</span>
                                    <div className="flex items-center gap-2 text-white">
                                        <span className="material-symbols-outlined text-[#F59E0B] text-xl">schedule</span>
                                        <span className="font-semibold text-base">{selectedTime}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Vehículo */}
                            <div className="flex items-start justify-between border-b border-white/10 pb-4">
                                <div className="flex flex-col items-start">
                                    <span className="text-white/40 text-xs uppercase tracking-wider font-semibold mb-1">Vehículo</span>
                                    <div className="flex items-center gap-2 text-white">
                                        <span className="text-2xl">{vehicle?.icon}</span>
                                        <span className="font-semibold text-base">{vehicle?.name}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Servicios */}
                            <div className="flex flex-col items-start border-b border-white/10 pb-4">
                                <span className="text-white/40 text-xs uppercase tracking-wider font-semibold mb-2">Servicios</span>
                                <ul className="space-y-1 pl-2">
                                    {services.map(service => (
                                        <li key={service.id} className="flex items-start gap-2">
                                            <span className="text-[#F59E0B] mt-1.5 w-1.5 h-1.5 rounded-full bg-[#F59E0B] shrink-0"></span>
                                            <span className="text-white/80 text-sm">{service.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Total */}
                            <div className="flex flex-col items-center pt-1">
                                <span className="text-white/40 text-xs uppercase tracking-wider font-semibold mb-1">Total Estimado</span>
                                <span className="text-[#F59E0B] text-3xl font-black tracking-tight">${totalPrice.toLocaleString()}</span>
                                <span className="text-white/40 text-xs mt-1">Duración: {formatDuration(totalDuration)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Botones con margen inferior */}
                    <div className="w-full space-y-3 mt-8 animate-slide-up delay-300">
                        <button
                            onClick={openWhatsApp}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-base py-4 px-6 rounded-[16px] shadow-lg shadow-green-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined text-xl">chat</span>
                            <span>Contactar por WhatsApp</span>
                        </button>
                        <button
                            onClick={handleNewBooking}
                            className="w-full bg-gradient-to-r from-[#FBBF24] to-[#D97706] hover:brightness-110 text-[#020617] font-bold text-base py-4 px-6 rounded-[16px] shadow-[0_8px_20px_-5px_rgba(245,158,11,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            <span>Hacer otra reserva</span>
                        </button>
                        <button
                            onClick={handleGoHome}
                            className="w-full bg-white/10 hover:bg-white/20 text-white font-bold text-base py-4 px-6 rounded-[16px] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            Volver al inicio
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default User6;
