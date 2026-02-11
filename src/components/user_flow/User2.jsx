import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import { useConfig } from '../../context/ConfigContext';
import { formatDuration } from '../../lib/formatters';

const User2 = () => {
    const navigate = useNavigate();
    const {
        selectedVehicle,
        selectedServices,
        toggleService,
        calculatePrice,
        calculateDuration,
        setStep,
        resetBooking
    } = useBooking();
    const { activeServices, vehicles } = useConfig();

    const handleClose = () => {
        resetBooking();
        navigate('/');
    };

    const isValid = selectedServices.length > 0;
    const totalPrice = calculatePrice();
    const totalDuration = calculateDuration();

    // Get vehicle info for display
    const vehicle = vehicles.find(v => v.id === selectedVehicle);

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
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fadeIn 0.4s ease-out forwards;
                }
                `}
            </style>

            <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
            <div className="absolute inset-0 z-0 bg-[#020617]/90 backdrop-blur-sm"></div>

            <div className="relative z-10 w-full max-w-[420px] h-[850px] max-h-[92vh] bg-[#020617] rounded-[16px] shadow-2xl overflow-hidden flex flex-col border border-white/10 ring-1 ring-white/5">
                <header className="bg-[#020617]/95 backdrop-blur border-b border-white/5 sticky top-0 z-30">
                    <div className="h-[80px] flex items-center justify-between px-6">
                        <div className="flex items-center gap-2">
                            <span className="text-white font-bold text-[18px]">🚙 Detailing Pro</span>
                        </div>
                        <button
                            onClick={handleClose}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
                        >
                            <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                    </div>
                    <div className="px-6 pb-6">
                        <h2 className="text-center text-[14px] text-white/50 mb-4">Reservá tu turno</h2>
                        <div className="relative flex justify-between items-center max-w-[200px] mx-auto">
                            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/10 -translate-y-1/2 z-0"></div>
                            <div className="absolute top-1/2 left-0 w-1/2 h-[2px] bg-[#F59E0B] -translate-y-1/2 z-0 transition-all duration-300 ease-out"></div>
                            <div className="relative z-10 flex flex-col items-center gap-2 group cursor-pointer">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] transition-all duration-300"></div>
                                <span className="absolute -bottom-5 text-[11px] font-medium text-[#F59E0B] whitespace-nowrap transition-colors duration-300">Vehículo</span>
                            </div>
                            <div className="relative z-10 flex flex-col items-center gap-2 group cursor-pointer">
                                <div className="relative flex items-center justify-center">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] z-20"></div>
                                    <div className="absolute w-5 h-5 rounded-full border border-[#F59E0B]/50 animate-pulse z-10"></div>
                                </div>
                                <span className="absolute -bottom-5 text-[11px] font-medium text-[#F59E0B] whitespace-nowrap transition-colors duration-300">Servicio</span>
                            </div>
                            <div className="relative z-10 flex flex-col items-center gap-2 group cursor-pointer">
                                <div className="w-2.5 h-2.5 rounded-full bg-white/20 transition-all duration-300"></div>
                                <span className="absolute -bottom-5 text-[11px] font-medium text-white/30 whitespace-nowrap transition-colors duration-300">Fecha</span>
                            </div>
                        </div>
                        <div className="h-4"></div>
                    </div>

                    {/* Summary Card */}
                    <div className="mx-6 mb-4 bg-[#0f172a] rounded-xl border border-white/5 overflow-hidden">
                        <details className="group">
                            <summary className="flex items-center justify-between p-3 cursor-pointer select-none">
                                <div className="flex items-center gap-3">
                                    <div className="bg-[#F59E0B]/10 p-1.5 rounded-lg">
                                        <span className="material-symbols-outlined text-[#F59E0B] text-lg">local_car_wash</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-white text-sm font-semibold">Resumen</span>
                                        <span className="text-white/40 text-xs">{vehicle?.name} • {selectedServices.length} servicio{selectedServices.length !== 1 ? 's' : ''}</span>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-white/40 group-open:rotate-180 transition-transform">expand_more</span>
                            </summary>
                            <div className="px-3 pb-3 pt-0 border-t border-white/5 bg-white/[0.02]">
                                <div className="flex justify-between items-center py-2 text-sm">
                                    <span className="text-white/60">Vehículo</span>
                                    <span className="text-white font-medium">{vehicle?.name}</span>
                                </div>
                                {selectedServices.length > 0 && (
                                    <div className="flex justify-between items-center py-2 text-sm border-t border-white/5">
                                        <span className="text-white/60">Servicios</span>
                                        <span className="text-white font-medium">{selectedServices.length}</span>
                                    </div>
                                )}
                            </div>
                        </details>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto hide-scrollbar p-6 space-y-4 pb-40">
                    <div className="animate-fade-in">
                        <h3 className="text-white text-xl font-bold mb-2">2. Seleccioná los servicios</h3>
                        <p className="text-white/50 text-sm mb-6">Podés elegir uno o más</p>

                        <div className="space-y-3">
                            {activeServices.map((service) => {
                                const isSelected = selectedServices.includes(service.id);
                                const price = Math.round(service.basePrice * (vehicle?.multiplier || 1));

                                return (
                                    <button
                                        key={service.id}
                                        onClick={() => toggleService(service.id)}
                                        className={`w-full p-4 rounded-[16px] border-2 transition-all duration-300 text-left ${isSelected
                                            ? 'border-[#F59E0B] bg-[#F59E0B]/10'
                                            : 'border-white/10 bg-[#0f172a] hover:border-white/20'
                                            }`}
                                    >
                                        <div className="flex items-start gap-4">
                                            {/* Checkbox */}
                                            <div className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${isSelected
                                                ? 'border-[#F59E0B] bg-[#F59E0B]'
                                                : 'border-white/30'
                                                }`}>
                                                {isSelected && (
                                                    <span className="material-symbols-outlined text-[#020617] text-sm">check</span>
                                                )}
                                            </div>

                                            {/* Service Info */}
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between mb-1">
                                                    <h4 className="text-white font-bold text-base">{service.name}</h4>
                                                    <span className="text-[#F59E0B] font-bold text-base">${price.toLocaleString()}</span>
                                                </div>
                                                <p className="text-white/50 text-xs mb-2">{service.description}</p>
                                                <div className="flex items-center gap-2 text-white/40 text-xs">
                                                    <span className="material-symbols-outlined text-sm">schedule</span>
                                                    <span>{service.duration} min</span>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </main>

                <footer className="absolute bottom-0 w-full bg-[#020617]/95 backdrop-blur-md border-t border-white/10 p-6 z-40">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex flex-col">
                            <span className="text-xs text-white/50 mb-1 font-medium">Total estimado</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-[#F59E0B]">${totalPrice.toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="block text-xs font-medium text-white/50 mb-1">Duración total</span>
                            <span className="block text-sm font-bold text-white">{formatDuration(totalDuration)}</span>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setStep(1)}
                            className="flex-1 bg-[#0f172a] hover:bg-white/5 border border-white/10 text-white/70 hover:text-white font-semibold text-sm py-4 px-4 rounded-[16px] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined text-lg">arrow_back</span>
                            <span>Volver</span>
                        </button>
                        <button
                            onClick={() => setStep(3)}
                            disabled={!isValid}
                            className="flex-[2] bg-gradient-to-r from-[#FBBF24] to-[#D97706] disabled:from-gray-700 disabled:to-gray-800 disabled:text-white/20 disabled:shadow-none hover:brightness-110 text-[#020617] font-bold text-base py-4 px-4 rounded-[16px] shadow-[0_8px_20px_-5px_rgba(245,158,11,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                        >
                            <span>Siguiente</span>
                            <span className="material-symbols-outlined text-xl">arrow_forward</span>
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default User2;
