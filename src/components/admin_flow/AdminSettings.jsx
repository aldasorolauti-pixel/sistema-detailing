import React from 'react';
import { VEHICLES, SERVICES, TIME_SLOTS, CAPACITY_PER_SLOT, DAYS_OFF } from '../../lib/constants';
import { formatDuration } from '../../lib/formatters';

const DAYS_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const AdminSettings = () => {
    return (
        <div className="flex-1 p-8 overflow-y-auto">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white">Configuración del Sistema</h2>
                <p className="text-white/40 text-sm mt-1">Gestiona servicios, precios y horarios operativos.</p>
            </div>

            <div className="space-y-6 max-w-4xl">
                {/* Services Catalog */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-white font-bold text-base mb-5 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#F59E0B]">cleaning_services</span>
                        Catálogo de Servicios
                    </h3>
                    <div className="space-y-3">
                        {SERVICES.map(service => (
                            <div key={service.id} className="flex items-center justify-between p-4 bg-white/3 border border-white/5 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{service.icon}</span>
                                    <div>
                                        <p className="text-white text-sm font-semibold">{service.name}</p>
                                        <p className="text-white/40 text-xs">{service.description}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[#F59E0B] text-sm font-bold">${service.basePrice.toLocaleString()}</p>
                                    <p className="text-white/30 text-xs">{formatDuration(service.duration)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Vehicle Multipliers */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-white font-bold text-base mb-5 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#F59E0B]">directions_car</span>
                        Multiplicadores por Vehículo
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {VEHICLES.map(v => (
                            <div key={v.id} className="bg-white/3 border border-white/5 rounded-xl p-4 text-center">
                                <span className="text-3xl block mb-2">{v.icon}</span>
                                <p className="text-white text-sm font-bold">{v.name}</p>
                                <p className="text-white/40 text-xs mb-2">{v.description}</p>
                                <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-lg px-3 py-1.5 inline-block">
                                    <span className="text-[#F59E0B] text-sm font-black">×{v.multiplier}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Schedule & Capacity */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Business Hours */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <h3 className="text-white font-bold text-base mb-5 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[#F59E0B]">storefront</span>
                            Horario de Atención
                        </h3>
                        <div className="space-y-2">
                            {DAYS_NAMES.map((day, i) => {
                                const isClosed = DAYS_OFF.includes(i);
                                return (
                                    <div key={day} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                                        <span className={`text-sm ${isClosed ? 'text-white/30' : 'text-white/70'}`}>{day}</span>
                                        <span className={`text-xs font-medium px-3 py-1 rounded-full
                                            ${isClosed
                                                ? 'bg-red-500/10 text-red-400'
                                                : 'bg-emerald-500/10 text-emerald-400'}`}>
                                            {isClosed ? 'Cerrado' : `${TIME_SLOTS[0]?.time} - ${TIME_SLOTS[TIME_SLOTS.length - 1]?.time}`}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Capacity */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <h3 className="text-white font-bold text-base mb-5 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[#F59E0B]">groups</span>
                            Capacidad Operativa
                        </h3>
                        <div className="text-center py-6">
                            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[#F59E0B]/20 to-[#F59E0B]/5 border border-[#F59E0B]/20 rounded-2xl flex items-center justify-center mb-4">
                                <span className="text-[#F59E0B] text-4xl font-black">{CAPACITY_PER_SLOT}</span>
                            </div>
                            <p className="text-white text-sm font-semibold">vehículos simultáneos</p>
                            <p className="text-white/40 text-xs mt-2 max-w-xs mx-auto">
                                Cuántos vehículos pueden ser atendidos al mismo tiempo por turno horario.
                            </p>
                        </div>

                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mt-4">
                            <p className="text-blue-400 text-xs flex items-start gap-2">
                                <span className="material-symbols-outlined text-sm mt-0.5">info</span>
                                Modificar la capacidad afectará los cupos disponibles en el calendario a partir de mañana.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
