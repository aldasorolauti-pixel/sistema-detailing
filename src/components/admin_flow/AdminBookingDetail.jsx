import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import { VEHICLES, SERVICES } from '../../lib/constants';
import { formatDuration } from '../../lib/formatters';

const AdminBookingDetail = () => {
    const { selectedBooking, navigateTo, updateBookingStatus } = useAdmin();

    if (!selectedBooking) return null;

    const booking = selectedBooking;
    const vehicle = VEHICLES.find(v => v.id === booking.vehicle);
    const services = (booking.services || []).map(sid => SERVICES.find(s => s.id === sid)).filter(Boolean);
    const totalPrice = booking.price || services.reduce((sum, s) => sum + (s.basePrice * (vehicle?.multiplier || 1)), 0);
    const totalDuration = booking.duration || services.reduce((sum, s) => sum + s.duration, 0);

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        const d = new Date(dateStr);
        return d.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    };

    const handleConfirm = () => {
        updateBookingStatus(booking.id, 'confirmed');
        navigateTo('dashboard');
    };

    const handleCancel = () => {
        updateBookingStatus(booking.id, 'cancelled');
        navigateTo('dashboard');
    };

    return (
        <div className="flex-1 p-8 overflow-y-auto">
            {/* Back button */}
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
                        Turno #{booking.id?.split('-')[1]?.slice(0, 5) || '00000'}
                        <span className={`text-xs px-3 py-1 rounded-full font-semibold
                            ${booking.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400' :
                                booking.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                                    'bg-yellow-500/20 text-yellow-400'}`}>
                            {booking.status === 'confirmed' ? 'Confirmado' : booking.status === 'cancelled' ? 'Cancelado' : 'Pendiente'}
                        </span>
                    </h2>
                    <p className="text-white/40 text-sm mt-1">
                        Creado el {new Date(booking.createdAt).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column: Client + Vehicle + DateTime */}
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
                        {booking.client?.brand && (
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

                {/* Right Column: Services + Total + Actions */}
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
                                <p className="text-white/40 text-xs uppercase font-semibold tracking-wider">Total Estimado</p>
                                <p className="text-[#F59E0B] text-3xl font-black mt-1">${totalPrice.toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-white/40 text-xs uppercase font-semibold tracking-wider">Duración</p>
                                <p className="text-white text-lg font-bold mt-1">{formatDuration(totalDuration)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    {booking.status === 'pending' && (
                        <div className="flex gap-3">
                            <button
                                onClick={handleConfirm}
                                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-xl">check_circle</span>
                                Confirmar
                            </button>
                            <button
                                onClick={handleCancel}
                                className="flex-1 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 text-white/60 hover:text-red-400 font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-xl">cancel</span>
                                Cancelar
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminBookingDetail;
