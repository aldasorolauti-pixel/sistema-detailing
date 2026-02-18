import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/useBooking';

const User4 = () => {
    const navigate = useNavigate();
    const { clientData, setClientData, setStep, resetBooking } = useBooking();

    const handleClose = () => {
        resetBooking();
        navigate('/');
    };

    const isValid = clientData.name.trim() && clientData.phone.trim();

    const handleInputChange = (field, value) => {
        setClientData(prev => ({
            ...prev,
            [field]: value
        }));
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
                .step-glow {
                    box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.2);
                }
                `}
            </style>

            <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
            <div className="absolute inset-0 z-0 bg-[#020617]/90 backdrop-blur-sm"></div>

            <div className="relative z-10 w-full max-w-[420px] h-[850px] max-h-[92vh] bg-[#020617] rounded-[16px] shadow-2xl overflow-hidden flex flex-col border border-white/10 ring-1 ring-white/5">
                <header className="bg-[#020617]/95 backdrop-blur border-b border-white/5 relative z-30 flex flex-col h-[140px]">
                    <div className="flex items-center justify-between px-6 pt-4 h-[50px]">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">🚙</span>
                            <h1 className="text-white font-bold text-lg tracking-tight">Detailing Pro</h1>
                        </div>
                        <button
                            onClick={handleClose}
                            className="text-white/60 hover:text-white transition-colors"
                        >
                            <span className="material-symbols-outlined text-2xl">close</span>
                        </button>
                    </div>
                    <div className="text-center -mt-1">
                        <h2 className="text-white font-semibold text-sm">Reservá tu turno</h2>
                    </div>
                    <div className="px-8 mt-4 w-full">
                        <div className="relative flex items-center justify-between w-full">
                            <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 h-[2px] bg-[#334155] z-0"></div>
                            <div className="absolute top-1/2 left-0 -translate-y-1/2 h-[2px] bg-[#F59E0B] z-0 transition-all duration-300" style={{ width: '75%' }}></div>
                            {['Veh', 'Serv', 'Fecha', 'Datos', 'OK'].map((s, i) => (
                                <div key={s} className="relative z-10 flex flex-col items-center gap-1.5">
                                    <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i <= 3 ? 'bg-[#F59E0B]' : 'bg-[#475569]'} ${i === 3 ? 'step-glow transform scale-110' : ''}`}></div>
                                    <span className={`text-[10px] sm:text-[11px] font-medium transition-colors duration-300 absolute -bottom-5 w-max ${i <= 3 ? 'text-[#F59E0B]' : 'text-[#64748B]'}`}>{s}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto hide-scrollbar p-6 space-y-6 pb-32 pt-4">
                    <div className="animate-fade-in">
                        <div className="mb-4">
                            <h2 className="text-white text-xl font-bold">4. Tus datos</h2>
                            <p className="text-white/50 text-xs mt-1">Necesitamos tu info para confirmar la reserva</p>
                        </div>
                        <div className="bg-[#0f172a] border border-white/10 rounded-[16px] p-6 space-y-5">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-white">
                                    Nombre Completo <span className="text-[#F59E0B]">*</span>
                                </label>
                                <input
                                    value={clientData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    className="w-full h-12 bg-[#020617] border border-white/10 rounded-xl px-4 text-white placeholder-white/20 focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] transition-colors"
                                    placeholder="Juan Pérez"
                                    type="text"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-white">
                                    WhatsApp <span className="text-[#F59E0B]">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 material-symbols-outlined text-xl">chat</span>
                                    <input
                                        value={clientData.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        className="w-full h-12 bg-[#020617] border border-white/10 rounded-xl pl-12 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] transition-colors"
                                        placeholder="+54 9 351 123 4567"
                                        type="tel"
                                    />
                                </div>
                            </div>
                            <div className="h-px bg-white/5 w-full my-2"></div>
                            <p className="text-xs font-medium text-white/40 uppercase tracking-wider">Detalles opcionales</p>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-white/80">Patente (Opcional)</label>
                                <input
                                    value={clientData.plate}
                                    onChange={(e) => handleInputChange('plate', e.target.value.toUpperCase())}
                                    className="w-full h-12 bg-[#020617] border border-white/10 rounded-xl px-4 text-white placeholder-white/20 focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] transition-colors uppercase"
                                    placeholder="AA 123 BB"
                                    type="text"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-white/80">Marca</label>
                                    <input
                                        value={clientData.brand}
                                        onChange={(e) => handleInputChange('brand', e.target.value)}
                                        className="w-full h-12 bg-[#020617] border border-white/10 rounded-xl px-4 text-white placeholder-white/20 focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] transition-colors"
                                        placeholder="Toyota"
                                        type="text"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-white/80">Modelo</label>
                                    <input
                                        value={clientData.model}
                                        onChange={(e) => handleInputChange('model', e.target.value)}
                                        className="w-full h-12 bg-[#020617] border border-white/10 rounded-xl px-4 text-white placeholder-white/20 focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] transition-colors"
                                        placeholder="Corolla"
                                        type="text"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                <footer className="absolute bottom-0 w-full bg-[#020617]/95 backdrop-blur-md border-t border-white/10 p-6 z-40">
                    <div className="flex gap-3">
                        <button
                            onClick={() => setStep(3)}
                            className="flex-1 bg-[#0f172a] hover:bg-white/5 border border-white/10 text-white/70 hover:text-white font-semibold text-sm py-4 px-4 rounded-[16px] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined text-lg">arrow_back</span>
                            <span>Volver</span>
                        </button>
                        <button
                            onClick={() => setStep(5)}
                            disabled={!isValid}
                            className="flex-[2] bg-gradient-to-r from-[#FBBF24] to-[#D97706] disabled:from-gray-700 disabled:to-gray-800 disabled:text-white/20 disabled:shadow-none hover:brightness-110 text-[#020617] font-bold text-base py-4 px-4 rounded-[16px] shadow-[0_8px_20px_-5px_rgba(245,158,11,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                        >
                            <span>Continuar</span>
                            <span className="material-symbols-outlined text-xl">arrow_forward</span>
                        </button>
                    </div>
                    <p className="text-center text-[10px] text-white/30 mt-3 font-medium">Al continuar aceptas nuestros términos y condiciones.</p>
                </footer>
            </div>
        </div>
    );
};

export default User4;
