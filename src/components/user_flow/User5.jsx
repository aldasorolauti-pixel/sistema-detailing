import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/useBooking';
import { useConfig } from '../../context/useConfig';
import { formatDuration } from '../../lib/formatters';

const User5 = () => {
    const navigate = useNavigate();
    const {
        selectedVehicle,
        selectedServices,
        selectedDate,
        selectedTime,
        clientData,
        calculatePrice,
        calculateDuration,
        saveBooking,
        setStep,
        resetBooking
    } = useBooking();
    const { vehicles, services: allServices } = useConfig();
    const [saving, setSaving] = React.useState(false);

    const handleClose = () => {
        resetBooking();
        navigate('/');
    };

    const vehicle = vehicles.find(v => v.id === selectedVehicle);
    const services = allServices.filter(s => selectedServices.includes(s.id));
    const totalPrice = calculatePrice();
    const totalDuration = calculateDuration();

    const handleConfirm = async () => {
        setSaving(true);
        await saveBooking();
        setStep(6);
        // No need to setSaving(false) — component unmounts after setStep(6)
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
                .delay-100 { animation-delay: 0.1s; }
                .delay-200 { animation-delay: 0.2s; }
                .delay-300 { animation-delay: 0.3s; }
                `}
            </style>

            <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
            <div className="absolute inset-0 z-0 bg-[#020617]/90 backdrop-blur-sm"></div>

            <div className="relative z-10 w-full max-w-[420px] h-[850px] max-h-[92vh] bg-[#020617] rounded-[16px] shadow-2xl overflow-hidden flex flex-col border border-white/10 ring-1 ring-white/5">
                <header className="h-[80px] bg-[#020617]/80 backdrop-blur border-b border-white/5 px-6 shrink-0 relative flex items-center justify-between z-20">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">🚙</span>
                        <span className="text-white font-bold text-lg tracking-tight">Detailing Pro</span>
                    </div>
                    <div className="absolute left-1/2 -translate-x-1/2 top-3 w-full max-w-[240px]">
                        <h2 className="text-white/90 text-[13px] font-medium text-center mb-2">Reservá tu turno</h2>
                        <div className="relative flex items-center justify-between w-full px-1">
                            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/10 -translate-y-1/2 z-0 rounded-full"></div>
                            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[#F59E0B] -translate-y-1/2 z-0 rounded-full transition-all duration-300"></div>
                            {['Veh', 'Serv', 'Fecha', 'Datos', 'OK'].map((s, i) => (
                                <div key={s} className="relative z-10 flex flex-col items-center gap-1 group">
                                    <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i <= 3 ? 'bg-[#F59E0B]' : 'bg-[#F59E0B] shadow-[0_0_0_4px_rgba(245,158,11,0.2)] ring-1 ring-[#F59E0B] scale-110'}`}></div>
                                    <span className={`text-[10px] sm:text-[11px] font-medium absolute -bottom-5 transition-colors duration-300 ${i === 4 ? 'font-bold text-[#F59E0B]' : 'text-[#F59E0B]'}`}>{s}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-white/60 hover:text-white transition-colors p-1.5 hover:bg-white/5 rounded-full"
                    >
                        <span className="material-symbols-outlined text-xl">close</span>
                    </button>
                </header>

                <main className="flex-1 overflow-y-auto hide-scrollbar p-6 space-y-4 pb-32">
                    <div className="space-y-1 mb-2">
                        <h2 className="text-white text-xl font-bold">5. Confirmá tu reserva</h2>
                        <p className="text-white/50 text-sm">Revisá que todo esté correcto</p>
                    </div>

                    <section className="animate-fade-in bg-[#0f172a] rounded-[16px] border border-white/10 p-5 flex items-center gap-5">
                        <div className="w-14 h-14 rounded-full bg-[#F59E0B]/20 flex items-center justify-center shrink-0">
                            <span className="text-3xl">{vehicle?.icon}</span>
                        </div>
                        <div>
                            <span className="block text-[#F59E0B] text-xs font-bold uppercase tracking-wider mb-0.5">Vehículo</span>
                            <h3 className="text-white font-bold text-lg">{vehicle?.name}</h3>
                        </div>
                        <div className="ml-auto">
                            <span className="material-symbols-outlined text-green-500">check_circle</span>
                        </div>
                    </section>

                    <section className="animate-fade-in delay-100 bg-[#0f172a] rounded-[16px] border border-white/10 p-5">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="material-symbols-outlined text-[#F59E0B]">design_services</span>
                            <h3 className="text-white font-bold text-base">Servicios</h3>
                        </div>
                        <ul className="space-y-2 pl-2">
                            {services.map(service => (
                                <li key={service.id} className="flex items-start gap-2">
                                    <span className="text-[#F59E0B] mt-1.5 w-1.5 h-1.5 rounded-full bg-[#F59E0B] shrink-0"></span>
                                    <span className="text-white/80 text-sm">{service.name}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section className="animate-fade-in delay-200 bg-[#0f172a] rounded-[16px] border border-white/10 p-5">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="material-symbols-outlined text-[#F59E0B]">calendar_month</span>
                            <h3 className="text-white font-bold text-base">Fecha y Hora</h3>
                        </div>
                        <div className="pl-1 space-y-1">
                            <p className="text-white font-semibold text-lg">
                                {selectedDate?.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                            <div className="flex items-center gap-2 text-white/60 text-sm">
                                <span className="material-symbols-outlined text-sm">schedule</span>
                                <span>{selectedTime} - Duración: {formatDuration(totalDuration)}</span>
                            </div>
                        </div>
                    </section>

                    <section className="animate-fade-in delay-300 bg-[#0f172a] rounded-[16px] border border-white/10 p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="material-symbols-outlined text-[#F59E0B]">person</span>
                            <h3 className="text-white font-bold text-base">Tus Datos</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-y-3 pl-1">
                            <div>
                                <span className="block text-xs text-white/40 mb-0.5">Nombre</span>
                                <span className="block text-white text-sm font-medium">{clientData.name}</span>
                            </div>
                            <div>
                                <span className="block text-xs text-white/40 mb-0.5">WhatsApp</span>
                                <span className="block text-white text-sm font-medium">{clientData.phone}</span>
                            </div>
                            {(clientData.brand || clientData.model) && (
                                <div className="grid grid-cols-2 gap-4">
                                    {clientData.brand && (
                                        <div>
                                            <span className="block text-xs text-white/40 mb-0.5">Marca</span>
                                            <span className="block text-white text-sm font-medium">{clientData.brand}</span>
                                        </div>
                                    )}
                                    {clientData.model && (
                                        <div>
                                            <span className="block text-xs text-white/40 mb-0.5">Modelo</span>
                                            <span className="block text-white text-sm font-medium">{clientData.model}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                            {clientData.plate && (
                                <div>
                                    <span className="block text-xs text-white/40 mb-0.5">Patente</span>
                                    <span className="block text-white text-sm font-medium bg-white/5 px-2 py-1 rounded w-fit tracking-wider">{clientData.plate}</span>
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="animate-fade-in delay-300 relative overflow-hidden rounded-[16px] border border-[#F59E0B]/30 p-6">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#F59E0B]/20 via-[#F59E0B]/5 to-transparent"></div>
                        <div className="relative z-10 flex flex-col items-center justify-center text-center gap-1">
                            <span className="text-[#F59E0B] font-bold text-sm tracking-widest uppercase">Total a Pagar</span>
                            <span className="text-4xl font-black text-[#F59E0B] drop-shadow-sm">${totalPrice.toLocaleString()}</span>
                            <span className="text-white/40 text-xs mt-1">Se abona al finalizar el servicio</span>
                        </div>
                    </section>
                </main>

                <footer className="absolute bottom-0 w-full bg-[#020617]/95 backdrop-blur-md border-t border-white/10 p-6 z-40">
                    <div className="flex gap-3">
                        <button
                            onClick={() => setStep(4)}
                            className="flex-1 bg-[#0f172a] hover:bg-white/5 border border-white/10 text-white/70 hover:text-white font-semibold text-sm py-4 px-4 rounded-[16px] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined text-lg">arrow_back</span>
                            <span>Editar</span>
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={saving}
                            className="flex-[2] bg-gradient-to-r from-[#FBBF24] to-[#D97706] hover:brightness-110 text-[#020617] font-bold text-base py-4 px-4 rounded-[16px] shadow-[0_8px_20px_-5px_rgba(245,158,11,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {saving ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-[#020617]/30 border-t-[#020617] rounded-full animate-spin" />
                                    <span>Guardando...</span>
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-xl">check</span>
                                    <span>Confirmar</span>
                                </>
                            )}
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default User5;
