import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { VEHICLES, SERVICES } from '../../lib/constants';
import { formatDuration } from '../../lib/formatters';

const AdminWalkIn = () => {
    const { addWalkInBooking, navigateTo } = useAdmin();

    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [selectedServices, setSelectedServices] = useState([]);
    const [clientData, setClientData] = useState({ name: '', phone: '', plate: '' });
    const [saved, setSaved] = useState(false);

    const toggleService = (sid) => {
        setSelectedServices(prev =>
            prev.includes(sid) ? prev.filter(id => id !== sid) : [...prev, sid]
        );
    };

    const vehicle = VEHICLES.find(v => v.id === selectedVehicle);
    const services = SERVICES.filter(s => selectedServices.includes(s.id));
    const totalPrice = services.reduce((sum, s) => sum + (s.basePrice * (vehicle?.multiplier || 1)), 0);
    const totalDuration = services.reduce((sum, s) => sum + s.duration, 0);

    const isValid = selectedVehicle && selectedServices.length > 0 && clientData.name.trim();

    const handleSave = () => {
        if (!isValid) return;
        addWalkInBooking({
            vehicle: selectedVehicle,
            services: selectedServices,
            date: new Date().toISOString(),
            time: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
            client: clientData,
            price: totalPrice,
            duration: totalDuration,
        });
        setSaved(true);
        setTimeout(() => {
            navigateTo('dashboard');
        }, 1500);
    };

    return (
        <div className="flex-1 p-8 overflow-y-auto">
            {/* Back */}
            <button
                onClick={() => navigateTo('dashboard')}
                className="flex items-center gap-2 text-white/50 hover:text-white text-sm mb-6 transition-colors"
            >
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                Volver
            </button>

            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white">Nuevo Registro Walk-in</h2>
                <p className="text-white/40 text-sm mt-1">Registra un cliente presencial y asigna servicios.</p>
            </div>

            {saved ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-4 animate-bounce">
                        <span className="material-symbols-outlined text-4xl text-white">check</span>
                    </div>
                    <p className="text-white text-xl font-bold">¡Turno registrado!</p>
                    <p className="text-white/40 text-sm mt-1">Redirigiendo al dashboard...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Section 1: Vehicle */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <h3 className="text-white font-bold text-base mb-4 flex items-center gap-2">
                                <span className="w-7 h-7 bg-[#F59E0B] rounded-lg flex items-center justify-center text-black text-sm font-black">1</span>
                                Tipo de Vehículo
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {VEHICLES.map(v => (
                                    <button
                                        key={v.id}
                                        onClick={() => setSelectedVehicle(v.id)}
                                        className={`p-4 rounded-xl border text-center transition-all
                                            ${selectedVehicle === v.id
                                                ? 'bg-[#F59E0B]/15 border-[#F59E0B]/50 ring-1 ring-[#F59E0B]/20'
                                                : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                                    >
                                        <span className="text-3xl block mb-2">{v.icon}</span>
                                        <p className="text-white text-sm font-semibold">{v.name}</p>
                                        <p className="text-white/40 text-xs">{v.description}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Section 2: Services */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <h3 className="text-white font-bold text-base mb-4 flex items-center gap-2">
                                <span className="w-7 h-7 bg-[#F59E0B] rounded-lg flex items-center justify-center text-black text-sm font-black">2</span>
                                Servicios
                            </h3>
                            <div className="space-y-2">
                                {SERVICES.map(s => (
                                    <button
                                        key={s.id}
                                        onClick={() => toggleService(s.id)}
                                        className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left
                                            ${selectedServices.includes(s.id)
                                                ? 'bg-[#F59E0B]/15 border-[#F59E0B]/50'
                                                : 'bg-white/3 border-white/10 hover:border-white/20'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl">{s.icon}</span>
                                            <div>
                                                <p className="text-white text-sm font-semibold">{s.name}</p>
                                                <p className="text-white/40 text-xs">{s.description}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-white/60 text-sm font-medium">${(s.basePrice * (vehicle?.multiplier || 1)).toLocaleString()}</p>
                                            <p className="text-white/30 text-xs">{formatDuration(s.duration)}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Section 3: Client Data */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <h3 className="text-white font-bold text-base mb-4 flex items-center gap-2">
                                <span className="w-7 h-7 bg-[#F59E0B] rounded-lg flex items-center justify-center text-black text-sm font-black">3</span>
                                Datos del Cliente
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-white/50 text-xs font-semibold uppercase mb-2">Nombre *</label>
                                    <input
                                        type="text"
                                        value={clientData.name}
                                        onChange={e => setClientData(p => ({ ...p, name: e.target.value }))}
                                        placeholder="Nombre del cliente"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 px-4 py-3 focus:outline-none focus:border-[#F59E0B]/50 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-white/50 text-xs font-semibold uppercase mb-2">Teléfono</label>
                                    <input
                                        type="tel"
                                        value={clientData.phone}
                                        onChange={e => setClientData(p => ({ ...p, phone: e.target.value }))}
                                        placeholder="+56 9 XXXX XXXX"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 px-4 py-3 focus:outline-none focus:border-[#F59E0B]/50 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-white/50 text-xs font-semibold uppercase mb-2">Patente</label>
                                    <input
                                        type="text"
                                        value={clientData.plate}
                                        onChange={e => setClientData(p => ({ ...p, plate: e.target.value.toUpperCase() }))}
                                        placeholder="ABCD12"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 px-4 py-3 focus:outline-none focus:border-[#F59E0B]/50 transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Summary */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                            <h3 className="text-white font-bold text-base">Resumen del Turno</h3>

                            {selectedVehicle && (
                                <div className="flex items-center gap-2 text-white/60 text-sm">
                                    <span className="text-lg">{vehicle?.icon}</span>
                                    {vehicle?.name}
                                </div>
                            )}

                            {services.length > 0 && (
                                <div className="space-y-1">
                                    {services.map(s => (
                                        <div key={s.id} className="flex justify-between text-sm">
                                            <span className="text-white/60">{s.name}</span>
                                            <span className="text-white/40">${(s.basePrice * (vehicle?.multiplier || 1)).toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="border-t border-white/10 pt-4">
                                <div className="flex justify-between">
                                    <span className="text-white/50 text-sm">Total</span>
                                    <span className="text-[#F59E0B] text-xl font-black">${totalPrice.toLocaleString()}</span>
                                </div>
                                {totalDuration > 0 && (
                                    <p className="text-white/30 text-xs mt-1 text-right">Duración: {formatDuration(totalDuration)}</p>
                                )}
                            </div>

                            <button
                                onClick={handleSave}
                                disabled={!isValid}
                                className="w-full bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:brightness-110 text-black font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-[#F59E0B]/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                            >
                                <span className="material-symbols-outlined text-xl">save</span>
                                Registrar Turno
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminWalkIn;
