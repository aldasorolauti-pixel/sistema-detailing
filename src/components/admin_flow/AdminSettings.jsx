import React, { useState } from 'react';
import { useConfig } from '../../context/ConfigContext';
import { formatDuration } from '../../lib/formatters';
import { supabase } from '../../lib/supabaseClient';

const DAYS_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const EMOJI_OPTIONS = ['✨', '🪑', '💎', '🛡️', '⚙️', '🌬️', '🧼', '🚿', '🧴', '🔧', '🏎️', '💫', '🧹', '🪣'];

const AdminSettings = () => {
    const {
        services, vehicles, schedule, capacity,
        addService, updateService, deleteService,
        updateVehicleMultiplier,
        updateDaySchedule, addException, removeException,
        setCapacity,
    } = useConfig();

    // ── Service editing state ──
    const [editingServiceId, setEditingServiceId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [showAddService, setShowAddService] = useState(false);
    const [newService, setNewService] = useState({ name: '', description: '', basePrice: '', duration: '', icon: '✨' });
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    // ── Exception state ──
    const [showAddException, setShowAddException] = useState(false);
    const [newException, setNewException] = useState({ date: '', end: '', reason: '', isRange: false });

    // ── Service handlers ──
    const startEditService = (service) => {
        setEditingServiceId(service.id);
        setEditForm({ name: service.name, basePrice: service.basePrice, duration: service.duration, description: service.description || '' });
    };

    const saveEditService = async () => {
        if (!editForm.name || !editForm.basePrice || !editForm.duration) return;
        const updates = {
            name: editForm.name,
            description: editForm.description,
            basePrice: Number(editForm.basePrice),
            duration: Number(editForm.duration),
        };
        // Optimistic UI update
        updateService(editingServiceId, updates);
        setEditingServiceId(null);
        // Persist to Supabase
        const { error } = await supabase
            .from('services')
            .update({ name: updates.name, description: updates.description, price: updates.basePrice, duration: updates.duration })
            .eq('id', editingServiceId);
        if (error) console.error('Error updating service:', error);
    };

    const handleAddService = async () => {
        if (!newService.name || !newService.basePrice || !newService.duration) return;
        const payload = {
            name: newService.name,
            description: newService.description,
            price: Number(newService.basePrice),
            duration: Number(newService.duration),
            icon: newService.icon,
            active: true,
        };
        // Insert into Supabase first to get the real ID
        const { data, error } = await supabase
            .from('services')
            .insert([payload])
            .select()
            .single();
        if (error) {
            console.error('Error adding service:', error);
            return;
        }
        // Add to local state with real DB id
        addService({ ...payload, id: data.id, basePrice: data.price });
        setNewService({ name: '', description: '', basePrice: '', duration: '', icon: '✨' });
        setShowAddService(false);
    };

    const confirmDelete = async (id) => {
        // Optimistic UI update
        deleteService(id);
        setDeleteConfirm(null);
        // Soft-delete in Supabase
        const { error } = await supabase
            .from('services')
            .update({ active: false })
            .eq('id', id);
        if (error) console.error('Error deleting service:', error);
    };

    // ── Exception handlers ──
    const handleAddException = () => {
        if (!newException.date || !newException.reason) return;
        addException({
            date: newException.isRange ? undefined : newException.date,
            start: newException.isRange ? newException.date : undefined,
            end: newException.isRange ? newException.end : undefined,
            closed: true,
            reason: newException.reason,
        });
        setNewException({ date: '', end: '', reason: '', isRange: false });
        setShowAddException(false);
    };

    return (
        <div className="flex-1 p-8 overflow-y-auto">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white">Configuración del Sistema</h2>
                <p className="text-white/40 text-sm mt-1">Gestiona servicios, precios y horarios operativos. Los cambios se aplican en tiempo real.</p>
            </div>

            <div className="space-y-6 max-w-4xl">

                {/* ═══ 1. SERVICE CATALOG ═══ */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-white font-bold text-base flex items-center gap-2">
                            <span className="material-symbols-outlined text-[#F59E0B]">cleaning_services</span>
                            Catálogo de Servicios
                        </h3>
                        <button
                            onClick={() => setShowAddService(true)}
                            className="flex items-center gap-1.5 text-[#F59E0B] text-sm font-semibold hover:brightness-125 transition-all bg-[#F59E0B]/10 px-3 py-1.5 rounded-lg"
                        >
                            <span className="material-symbols-outlined text-lg">add</span>
                            Agregar Servicio
                        </button>
                    </div>

                    <div className="space-y-2">
                        {services.filter(s => s.active !== false).map(service => (
                            <div key={service.id} className="flex items-center justify-between p-4 bg-white/3 border border-white/5 rounded-xl group">
                                {editingServiceId === service.id ? (
                                    /* Editing mode */
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                                        <div>
                                            <label className="block text-white/40 text-[10px] uppercase mb-1">Nombre</label>
                                            <input
                                                type="text"
                                                value={editForm.name}
                                                onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))}
                                                className="w-full bg-white/10 border border-white/15 rounded-lg text-white text-sm px-3 py-2 focus:outline-none focus:border-[#F59E0B]/50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-white/40 text-[10px] uppercase mb-1">Precio Base $</label>
                                            <input
                                                type="number"
                                                value={editForm.basePrice}
                                                onChange={e => setEditForm(p => ({ ...p, basePrice: e.target.value }))}
                                                className="w-full bg-white/10 border border-white/15 rounded-lg text-white text-sm px-3 py-2 focus:outline-none focus:border-[#F59E0B]/50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-white/40 text-[10px] uppercase mb-1">Duración (min)</label>
                                            <input
                                                type="number"
                                                value={editForm.duration}
                                                onChange={e => setEditForm(p => ({ ...p, duration: e.target.value }))}
                                                className="w-full bg-white/10 border border-white/15 rounded-lg text-white text-sm px-3 py-2 focus:outline-none focus:border-[#F59E0B]/50"
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={saveEditService} className="flex-1 bg-emerald-500 text-white text-sm font-bold py-2 px-3 rounded-lg hover:bg-emerald-600 transition-all">
                                                Guardar
                                            </button>
                                            <button onClick={() => setEditingServiceId(null)} className="bg-white/10 text-white/60 text-sm py-2 px-3 rounded-lg hover:bg-white/15 transition-all">
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    /* View mode */
                                    <>
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{service.icon}</span>
                                            <div>
                                                <p className="text-white text-sm font-semibold">{service.name}</p>
                                                <p className="text-white/40 text-xs">{service.description}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="text-right mr-2">
                                                <p className="text-[#F59E0B] text-sm font-bold">${service.basePrice.toLocaleString()}</p>
                                                <p className="text-white/30 text-xs">{formatDuration(service.duration)}</p>
                                            </div>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => startEditService(service)}
                                                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/50 hover:text-white transition-all"
                                                >
                                                    <span className="material-symbols-outlined text-lg">edit</span>
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirm(service.id)}
                                                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-500/20 flex items-center justify-center text-white/50 hover:text-red-400 transition-all"
                                                >
                                                    <span className="material-symbols-outlined text-lg">delete</span>
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Add Service Modal */}
                    {showAddService && (
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAddService(false)}>
                            <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 w-full max-w-md space-y-4" onClick={e => e.stopPropagation()}>
                                <h4 className="text-white font-bold text-lg">Agregar Nuevo Servicio</h4>
                                <div>
                                    <label className="block text-white/50 text-xs font-semibold uppercase mb-1">Ícono</label>
                                    <div className="flex gap-2 flex-wrap">
                                        {EMOJI_OPTIONS.map(emoji => (
                                            <button
                                                key={emoji}
                                                onClick={() => setNewService(p => ({ ...p, icon: emoji }))}
                                                className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all
                                                    ${newService.icon === emoji ? 'bg-[#F59E0B]/20 border-[#F59E0B]/50 border' : 'bg-white/5 border border-transparent hover:bg-white/10'}`}
                                            >
                                                {emoji}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-white/50 text-xs font-semibold uppercase mb-1">Nombre *</label>
                                    <input type="text" value={newService.name} onChange={e => setNewService(p => ({ ...p, name: e.target.value }))}
                                        placeholder="Ej: Lavado Express" className="w-full bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 px-3 py-2.5 focus:outline-none focus:border-[#F59E0B]/50" />
                                </div>
                                <div>
                                    <label className="block text-white/50 text-xs font-semibold uppercase mb-1">Descripción</label>
                                    <input type="text" value={newService.description} onChange={e => setNewService(p => ({ ...p, description: e.target.value }))}
                                        placeholder="Breve descripción" className="w-full bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 px-3 py-2.5 focus:outline-none focus:border-[#F59E0B]/50" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-white/50 text-xs font-semibold uppercase mb-1">Precio Base $ *</label>
                                        <input type="number" value={newService.basePrice} onChange={e => setNewService(p => ({ ...p, basePrice: e.target.value }))}
                                            placeholder="5000" className="w-full bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 px-3 py-2.5 focus:outline-none focus:border-[#F59E0B]/50" />
                                    </div>
                                    <div>
                                        <label className="block text-white/50 text-xs font-semibold uppercase mb-1">Duración (min) *</label>
                                        <input type="number" value={newService.duration} onChange={e => setNewService(p => ({ ...p, duration: e.target.value }))}
                                            placeholder="90" className="w-full bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 px-3 py-2.5 focus:outline-none focus:border-[#F59E0B]/50" />
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button onClick={() => setShowAddService(false)} className="flex-1 bg-white/5 border border-white/10 text-white/60 font-semibold py-3 rounded-xl hover:bg-white/10 transition-all">
                                        Cancelar
                                    </button>
                                    <button onClick={handleAddService} disabled={!newService.name || !newService.basePrice || !newService.duration}
                                        className="flex-1 bg-[#F59E0B] text-black font-bold py-3 rounded-xl hover:brightness-110 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                                        Agregar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Delete Confirmation Modal */}
                    {deleteConfirm && (
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
                            <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 w-full max-w-sm space-y-4" onClick={e => e.stopPropagation()}>
                                <div className="text-center">
                                    <div className="w-14 h-14 mx-auto bg-red-500/10 rounded-full flex items-center justify-center mb-3">
                                        <span className="material-symbols-outlined text-3xl text-red-400">delete_forever</span>
                                    </div>
                                    <h4 className="text-white font-bold text-lg">¿Eliminar servicio?</h4>
                                    <p className="text-white/40 text-sm mt-1">
                                        ¿Seguro que querés eliminar <strong className="text-white">{services.find(s => s.id === deleteConfirm)?.name}</strong>? Esta acción no se puede deshacer.
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={() => setDeleteConfirm(null)} className="flex-1 bg-white/5 border border-white/10 text-white/60 font-semibold py-3 rounded-xl hover:bg-white/10 transition-all">
                                        Cancelar
                                    </button>
                                    <button onClick={() => confirmDelete(deleteConfirm)} className="flex-1 bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition-all">
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* ═══ 2. VEHICLE MULTIPLIERS ═══ */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-white font-bold text-base mb-5 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#F59E0B]">directions_car</span>
                        Multiplicadores por Vehículo
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {vehicles.map(v => (
                            <div key={v.id} className="bg-white/3 border border-white/5 rounded-xl p-4 text-center">
                                <span className="text-3xl block mb-2">{v.icon}</span>
                                <p className="text-white text-sm font-bold">{v.name}</p>
                                <p className="text-white/40 text-xs mb-3">{v.description}</p>
                                <div className="flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => updateVehicleMultiplier(v.id, v.multiplier - 0.1)}
                                        disabled={v.multiplier <= 0.5}
                                        className="w-7 h-7 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 text-sm font-bold disabled:opacity-30 transition-all"
                                    >−</button>
                                    <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-lg px-3 py-1.5">
                                        <span className="text-[#F59E0B] text-sm font-black">×{v.multiplier.toFixed(1)}</span>
                                    </div>
                                    <button
                                        onClick={() => updateVehicleMultiplier(v.id, v.multiplier + 0.1)}
                                        disabled={v.multiplier >= 3.0}
                                        className="w-7 h-7 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 text-sm font-bold disabled:opacity-30 transition-all"
                                    >+</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ═══ 3. SCHEDULE ═══ */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Weekly Schedule */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <h3 className="text-white font-bold text-base mb-5 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[#F59E0B]">storefront</span>
                            Horario de Atención
                        </h3>
                        <div className="space-y-2">
                            {schedule.weekly.map((day, i) => (
                                <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0 gap-2">
                                    <span className={`text-sm w-24 shrink-0 ${!day.open ? 'text-white/30' : 'text-white/70'}`}>
                                        {DAYS_NAMES[i]}
                                    </span>
                                    <select
                                        value={day.open ? 'open' : 'closed'}
                                        onChange={e => updateDaySchedule(i, {
                                            open: e.target.value === 'open',
                                            start: e.target.value === 'open' ? (day.start || '09:00') : null,
                                            end: e.target.value === 'open' ? (day.end || '18:00') : null,
                                        })}
                                        className="bg-white/5 border border-white/10 text-white text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#F59E0B]/50 [color-scheme:dark]"
                                    >
                                        <option value="open">Abierto</option>
                                        <option value="closed">Cerrado</option>
                                    </select>
                                    {day.open ? (
                                        <div className="flex items-center gap-1">
                                            <input
                                                type="time"
                                                value={day.start || '09:00'}
                                                onChange={e => updateDaySchedule(i, { start: e.target.value })}
                                                className="bg-white/5 border border-white/10 text-white text-xs rounded-lg px-2 py-1.5 w-24 focus:outline-none focus:border-[#F59E0B]/50 [color-scheme:dark]"
                                            />
                                            <span className="text-white/30 text-xs">a</span>
                                            <input
                                                type="time"
                                                value={day.end || '18:00'}
                                                onChange={e => updateDaySchedule(i, { end: e.target.value })}
                                                className="bg-white/5 border border-white/10 text-white text-xs rounded-lg px-2 py-1.5 w-24 focus:outline-none focus:border-[#F59E0B]/50 [color-scheme:dark]"
                                            />
                                        </div>
                                    ) : (
                                        <span className="text-red-400/60 text-xs font-medium px-2 py-1 bg-red-500/10 rounded-lg">Cerrado</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Exceptions */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-white font-bold text-base flex items-center gap-2">
                                <span className="material-symbols-outlined text-[#F59E0B]">event_busy</span>
                                Feriados y Excepciones
                            </h3>
                            <button
                                onClick={() => setShowAddException(true)}
                                className="flex items-center gap-1 text-[#F59E0B] text-xs font-semibold bg-[#F59E0B]/10 px-2.5 py-1.5 rounded-lg hover:brightness-125 transition-all"
                            >
                                <span className="material-symbols-outlined text-sm">add</span>
                                Agregar
                            </button>
                        </div>

                        {schedule.exceptions.length === 0 ? (
                            <div className="text-center py-6">
                                <span className="material-symbols-outlined text-3xl text-white/15 block mb-2">beach_access</span>
                                <p className="text-white/30 text-sm">Sin feriados configurados</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {schedule.exceptions.map(exc => (
                                    <div key={exc.id} className="flex items-center justify-between p-3 bg-white/3 border border-white/5 rounded-xl">
                                        <div>
                                            <p className="text-white text-sm font-medium">{exc.reason}</p>
                                            <p className="text-white/40 text-xs mt-0.5">
                                                {exc.date || `${exc.start} al ${exc.end}`}
                                                <span className="ml-2 text-red-400">Cerrado</span>
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => removeException(exc.id)}
                                            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-500/20 flex items-center justify-center text-white/40 hover:text-red-400 transition-all"
                                        >
                                            <span className="material-symbols-outlined text-lg">delete</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Add Exception Modal */}
                        {showAddException && (
                            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAddException(false)}>
                                <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 w-full max-w-sm space-y-4" onClick={e => e.stopPropagation()}>
                                    <h4 className="text-white font-bold text-lg">Agregar Fecha Especial</h4>
                                    <div>
                                        <label className="block text-white/50 text-xs font-semibold uppercase mb-1">Motivo *</label>
                                        <input type="text" value={newException.reason} onChange={e => setNewException(p => ({ ...p, reason: e.target.value }))}
                                            placeholder="Ej: Día del Trabajador" className="w-full bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 px-3 py-2.5 focus:outline-none focus:border-[#F59E0B]/50" />
                                    </div>
                                    <label className="flex items-center gap-2 text-white/60 text-sm cursor-pointer">
                                        <input type="checkbox" checked={newException.isRange} onChange={e => setNewException(p => ({ ...p, isRange: e.target.checked }))}
                                            className="accent-[#F59E0B]" />
                                        Rango de fechas (vacaciones)
                                    </label>
                                    <div className={`grid gap-3 ${newException.isRange ? 'grid-cols-2' : 'grid-cols-1'}`}>
                                        <div>
                                            <label className="block text-white/50 text-xs font-semibold uppercase mb-1">{newException.isRange ? 'Desde *' : 'Fecha *'}</label>
                                            <input type="date" value={newException.date} onChange={e => setNewException(p => ({ ...p, date: e.target.value }))}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl text-white px-3 py-2.5 focus:outline-none focus:border-[#F59E0B]/50 [color-scheme:dark]" />
                                        </div>
                                        {newException.isRange && (
                                            <div>
                                                <label className="block text-white/50 text-xs font-semibold uppercase mb-1">Hasta *</label>
                                                <input type="date" value={newException.end} onChange={e => setNewException(p => ({ ...p, end: e.target.value }))}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl text-white px-3 py-2.5 focus:outline-none focus:border-[#F59E0B]/50 [color-scheme:dark]" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-3 pt-2">
                                        <button onClick={() => setShowAddException(false)} className="flex-1 bg-white/5 border border-white/10 text-white/60 font-semibold py-3 rounded-xl hover:bg-white/10 transition-all">
                                            Cancelar
                                        </button>
                                        <button onClick={handleAddException} disabled={!newException.date || !newException.reason || (newException.isRange && !newException.end)}
                                            className="flex-1 bg-[#F59E0B] text-black font-bold py-3 rounded-xl hover:brightness-110 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                                            Agregar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ═══ 4. CAPACITY ═══ */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-white font-bold text-base mb-5 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#F59E0B]">groups</span>
                        Capacidad Operativa
                    </h3>
                    <div className="flex items-center justify-center gap-6 py-4">
                        <button
                            onClick={() => setCapacity(capacity - 1)}
                            disabled={capacity <= 1}
                            className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xl font-bold disabled:opacity-30 transition-all"
                        >−</button>
                        <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-[#F59E0B]/20 to-[#F59E0B]/5 border border-[#F59E0B]/20 rounded-2xl flex items-center justify-center">
                                <span className="text-[#F59E0B] text-4xl font-black">{capacity}</span>
                            </div>
                            <p className="text-white/60 text-sm font-semibold mt-2">vehículos simultáneos</p>
                        </div>
                        <button
                            onClick={() => setCapacity(capacity + 1)}
                            disabled={capacity >= 10}
                            className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xl font-bold disabled:opacity-30 transition-all"
                        >+</button>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 mt-2">
                        <p className="text-blue-400 text-xs flex items-start gap-2">
                            <span className="material-symbols-outlined text-sm mt-0.5">info</span>
                            Modificar la capacidad afectará los cupos disponibles en el calendario a partir de mañana.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
