import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useConfig } from '../../context/ConfigContext';
import { formatDuration } from '../../lib/formatters';

const STATUS_CONFIG = {
    pending: { label: 'Pendiente', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20', dot: 'bg-yellow-400' },
    confirmed: { label: 'Confirmado', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20', dot: 'bg-emerald-400' },
    'in-progress': { label: 'En Curso', color: 'bg-blue-500/20 text-blue-400 border-blue-500/20', dot: 'bg-blue-400' },
    completed: { label: 'Terminado', color: 'bg-green-600/20 text-green-400 border-green-600/20', dot: 'bg-green-400' },
    cancelled: { label: 'Cancelado', color: 'bg-red-500/20 text-red-400 border-red-500/20', dot: 'bg-red-400' },
};

const AdminBookingDetail = () => {
    const { selectedBooking, navigateTo, updateBookingStatus } = useAdmin();
    const { vehicles, services: allServices } = useConfig();
    const [updating, setUpdating] = useState(false);

    if (!selectedBooking) return null;

    const booking = selectedBooking;
    const vehicle = vehicles.find(v => v.id === booking.vehicle);
    const services = (booking.services || []).map(sid => allServices.find(s => s.id === sid)).filter(Boolean);
    const totalPrice = booking.price || services.reduce((sum, s) => sum + (s.basePrice * (vehicle?.multiplier || 1)), 0);
    const totalDuration = booking.duration || services.reduce((sum, s) => sum + s.duration, 0);
    const statusInfo = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending;

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        const d = new Date(dateStr);
        return d.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    };

    const handleStatusChange = (newStatus) => {
        setUpdating(true);
        updateBookingStatus(booking.id, newStatus);
        setTimeout(() => {
            navigateTo('dashboard');
        }, 400);
    };

    const isReadOnly = booking.status === 'completed' || booking.status === 'cancelled';

    return (
        <div className="flex-1 p-8 overflow-y-auto">
            {/* Back */}
            <button
                onClick={() => navigateTo('dashboard')}
                className="flex items-center gap-2 text-white/50 hover:text-white text-sm mb-6 transition-colors"
            >
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                Volver al Dashboard
            </button>

            {/* Header */}
            <div className="flex items-start justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        Turno #{booking.id?.split('-')[1]?.slice(0, 6) || '000000'}
                    </h2>
                    <p className="text-white/40 text-sm mt-1">
                        Creado el {new Date(booking.createdAt).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })}
                        {booking.source === 'walkin' && <span className="ml-2 text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-semibold">Walk-in</span>}
                    </p>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold ${statusInfo.color}`}>
                    <div className={`w-2 h-2 rounded-full ${statusInfo.dot} animate-pulse`}></div>
                    {statusInfo.label}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-5">
                    {/* Client */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <h3 className="text-white/40 text-xs uppercase font-semibold tracking-wider mb-3">Cliente</h3>
                        <p className="text-white text-xl font-bold">{booking.client?.name || 'Sin nombre'}</p>
                        <p className="text-white/50 text-sm mt-1 flex items-center gap-2">
                            <span className="material-symbols-outlined text-base text-[#F59E0B]">phone</span>
                            {booking.client?.phone || '—'}
                        </p>
                        {booking.client?.plate && (
                            <p className="text-white/50 text-sm mt-1 flex items-center gap-2">
                                <span className="material-symbols-outlined text-base text-[#F59E0B]">badge</span>
                                Patente: {booking.client.plate}
                            </p>
                        )}
                    </div>

                    {/* Vehicle */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <h3 className="text-white/40 text-xs uppercase font-semibold tracking-wider mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined text-base text-[#F59E0B]">directions_car</span>
                            Vehículo
                        </h3>
                        <p className="text-white text-lg font-bold flex items-center gap-2">
                            <span className="text-2xl">{vehicle?.icon || '🚗'}</span>
                            {vehicle?.name || booking.vehicle || '—'}
                        </p>
                        {(booking.client?.brand || booking.client?.model) && (
                            <p className="text-white/40 text-sm mt-1">{booking.client.brand} {booking.client.model}</p>
                        )}
                    </div>

                    {/* Date & Time */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <h3 className="text-white/40 text-xs uppercase font-semibold tracking-wider mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined text-base text-[#F59E0B]">calendar_today</span>
                            Fecha y Hora
                        </h3>
                        <p className="text-white text-lg font-bold">{formatDate(booking.date)}</p>
                        <p className="text-white/50 text-sm mt-1">
                            {booking.time || '—'} · Duración: {formatDuration(totalDuration)}
                        </p>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-5">
                    {/* Services */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <h3 className="text-white/40 text-xs uppercase font-semibold tracking-wider mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-base text-[#F59E0B]">layers</span>
                            Servicios Solicitados
                        </h3>
                        <div className="space-y-3">
                            {services.map(service => (
                                <div key={service.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">{service.icon}</span>
                                        <div>
                                            <p className="text-white text-sm font-medium">{service.name}</p>
                                            <p className="text-white/30 text-xs">{service.description}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-white/60 text-sm font-medium">
                                            ${(service.basePrice * (vehicle?.multiplier || 1)).toLocaleString()}
                                        </p>
                                        <p className="text-white/30 text-xs">{formatDuration(service.duration)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Total */}
                    <div className="bg-gradient-to-br from-[#F59E0B]/10 to-transparent border border-[#F59E0B]/20 rounded-2xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/40 text-xs uppercase font-semibold tracking-wider">Total</p>
                                <p className="text-[#F59E0B] text-3xl font-black mt-1">${totalPrice.toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-white/40 text-xs uppercase font-semibold tracking-wider">Duración</p>
                                <p className="text-white text-lg font-bold mt-1">{formatDuration(totalDuration)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Contextual Actions */}
                    {!isReadOnly && (
                        <div className="space-y-3">
                            {booking.status === 'pending' && (
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleStatusChange('cancelled')}
                                        disabled={updating}
                                        className="flex-1 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 text-white/60 hover:text-red-400 font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        <span className="material-symbols-outlined text-xl">cancel</span>
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={() => handleStatusChange('confirmed')}
                                        disabled={updating}
                                        className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        <span className="material-symbols-outlined text-xl">check_circle</span>
                                        Confirmar Turno
                                    </button>
                                </div>
                            )}

                            {booking.status === 'confirmed' && (
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleStatusChange('cancelled')}
                                        disabled={updating}
                                        className="flex-1 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 text-white/60 hover:text-red-400 font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        <span className="material-symbols-outlined text-xl">cancel</span>
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={() => handleStatusChange('in-progress')}
                                        disabled={updating}
                                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        <span className="material-symbols-outlined text-xl">play_arrow</span>
                                        Iniciar Servicio
                                    </button>
                                </div>
                            )}

                            {booking.status === 'in-progress' && (
                                <button
                                    onClick={() => handleStatusChange('completed')}
                                    disabled={updating}
                                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:brightness-110 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-green-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    <span className="material-symbols-outlined text-xl">task_alt</span>
                                    Marcar como Terminado
                                </button>
                            )}
                        </div>
                    )}

                    {isReadOnly && (
                        <div className={`p-4 rounded-xl border text-sm flex items-center gap-2 ${statusInfo.color}`}>
                            <span className="material-symbols-outlined text-lg">
                                {booking.status === 'completed' ? 'check_circle' : 'cancel'}
                            </span>
                            Este turno está {statusInfo.label.toLowerCase()}.
                            {booking.completedAt && (
                                <span className="text-xs ml-auto opacity-60">
                                    {new Date(booking.completedAt).toLocaleDateString('es-AR')}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminBookingDetail;
