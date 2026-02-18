import React from 'react';
import { useBooking } from '../../context/useBooking';
import { useConfig } from '../../context/useConfig';
import { useNavigate } from 'react-router-dom';

const User1 = () => {
    const { selectedVehicle, setSelectedVehicle, setStep, resetBooking } = useBooking();
    const { vehicles } = useConfig();
    const navigate = useNavigate();

    const handleVehicleSelect = (vehicleId) => {
        setSelectedVehicle(vehicleId);
    };

    const handleClose = () => {
        resetBooking();
        navigate('/');
    };

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
                            <div className="absolute top-1/2 left-0 w-0 h-[2px] bg-[#F59E0B] -translate-y-1/2 z-0 transition-all duration-300 ease-out"></div>
                            <div className="relative z-10 flex flex-col items-center gap-2 group cursor-pointer">
                                <div className="relative flex items-center justify-center">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] z-20"></div>
                                    <div className="absolute w-5 h-5 rounded-full border border-[#F59E0B]/50 animate-pulse z-10"></div>
                                </div>
                                <span className="absolute -bottom-5 text-[11px] font-medium text-[#F59E0B] whitespace-nowrap transition-colors duration-300">Vehículo</span>
                            </div>
                            <div className="relative z-10 flex flex-col items-center gap-2 group cursor-pointer">
                                <div className="w-2.5 h-2.5 rounded-full bg-white/20 transition-all duration-300"></div>
                                <span className="absolute -bottom-5 text-[11px] font-medium text-white/30 whitespace-nowrap transition-colors duration-300">Servicio</span>
                            </div>
                            <div className="relative z-10 flex flex-col items-center gap-2 group cursor-pointer">
                                <div className="w-2.5 h-2.5 rounded-full bg-white/20 transition-all duration-300"></div>
                                <span className="absolute -bottom-5 text-[11px] font-medium text-white/30 whitespace-nowrap transition-colors duration-300">Fecha</span>
                            </div>
                        </div>
                        <div className="h-4"></div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto hide-scrollbar p-6 space-y-6">
                    <div className="animate-fade-in">
                        <h3 className="text-white text-xl font-bold mb-2">1. Seleccioná tu vehículo</h3>
                        <p className="text-white/50 text-sm mb-6">Elegí el tipo que mejor se ajuste</p>

                        <div className="grid grid-cols-2 gap-4">
                            {vehicles.map((vehicle) => (
                                <button
                                    key={vehicle.id}
                                    onClick={() => handleVehicleSelect(vehicle.id)}
                                    className={`relative p-5 rounded-[16px] border-2 transition-all duration-300 active:scale-95 ${selectedVehicle === vehicle.id
                                        ? 'border-[#F59E0B] bg-[#F59E0B]/10 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                                        : 'border-white/10 bg-[#0f172a] hover:border-white/20 hover:bg-[#1e293b]'
                                        }`}
                                >
                                    <div className="flex flex-col items-center gap-3 text-center">
                                        <div className={`text-4xl transition-transform duration-300 ${selectedVehicle === vehicle.id ? 'scale-110' : ''
                                            }`}>
                                            {vehicle.icon}
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold text-base">{vehicle.name}</h4>
                                            <p className="text-white/40 text-xs mt-1">{vehicle.subtitle}</p>
                                        </div>
                                    </div>
                                    {selectedVehicle === vehicle.id && (
                                        <div className="absolute top-2 right-2">
                                            <span className="material-symbols-outlined text-[#F59E0B] text-xl">check_circle</span>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="mt-8">
                            <button
                                onClick={() => setStep(2)}
                                disabled={!selectedVehicle}
                                className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 ${selectedVehicle
                                    ? 'bg-gradient-to-r from-[#F59E0B] to-[#F97316] text-black hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] active:scale-95'
                                    : 'bg-white/10 text-white/30 cursor-not-allowed'
                                    }`}
                            >
                                Continuar →
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default User1;
