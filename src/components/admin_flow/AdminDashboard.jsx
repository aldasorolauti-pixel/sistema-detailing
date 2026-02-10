import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { VEHICLES, SERVICES } from '../../lib/constants';
import { formatDuration } from '../../lib/formatters';

const AdminDashboard = () => {
    const { getBookings, navigateTo } = useAdmin();
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        setBookings(getBookings());
    }, [getBookings]);

    const today = new Date().toISOString().split('T')[0];
    const todayBookings = bookings.filter(b => b.date && b.date.startsWith(today));
    const monthBookings = bookings.filter(b => {
        if (!b.date) return false;
        const d = new Date(b.date);
        const now = new Date();
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const monthRevenue = monthBookings.reduce((sum, b) => sum + (b.price || 0), 0);

    const upcomingBookings = bookings
        .filter(b => b.date && new Date(b.date) >= new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 6);

    const getVehicleName = (vid) => VEHICLES.find(v => v.id === vid)?.name || vid || '—';
    const getServiceNames = (sids) => {
        if (!sids || !Array.isArray(sids)) return [];
        return sids.map(sid => SERVICES.find(s => s.id === sid)?.name || sid);
    };

    const formatBookingDate = (dateStr) => {
        if (!dateStr) return '—';
        const d = new Date(dateStr);
        return d.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' });
    };

    const stats = [
        { label: 'Ingresos del Mes', value: `$${monthRevenue.toLocaleString()}`, icon: 'payments', color: 'from-emerald-500/20 to-emerald-500/5', iconColor: 'text-emerald-400' },
        { label: 'Turnos del Mes', value: monthBookings.length, icon: 'event_available', color: 'from-blue-500/20 to-blue-500/5', iconColor: 'text-blue-400' },
        { label: 'Turnos Hoy', value: todayBookings.length, icon: 'today', color: 'from-[#F59E0B]/20 to-[#F59E0B]/5', iconColor: 'text-[#F59E0B]' },
    ];

    return (
        <div className="flex-1 p-8 overflow-y-auto">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white">Panel de Control</h2>
                <p className="text-white/40 text-sm mt-1">Bienvenido de nuevo, resumen de actividad.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
                {stats.map((stat, i) => (
                    <div key={i} className={`bg-gradient-to-br ${stat.color} border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-white/20 transition-all`}>
                        <div className="absolute top-4 right-4 w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                            <span className={`material-symbols-outlined text-2xl ${stat.iconColor}`}>{stat.icon}</span>
                        </div>
                        <p className="text-white/50 text-xs uppercase font-semibold tracking-wider mb-2">{stat.label}</p>
                        <p className="text-white text-3xl font-black tracking-tight">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Upcoming Bookings */}
            <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#F59E0B]">schedule</span>
                    Próximos Turnos
                </h3>

                {upcomingBookings.length === 0 ? (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                        <span className="material-symbols-outlined text-5xl text-white/20 mb-3 block">event_busy</span>
                        <p className="text-white/40 text-sm">No hay turnos próximos</p>
                        <p className="text-white/25 text-xs mt-1">Los turnos que los clientes reserven aparecerán aquí</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {upcomingBookings.map((booking) => (
                            <button
                                key={booking.id}
                                onClick={() => navigateTo('detail', booking)}
                                className="w-full bg-white/5 hover:bg-white/8 border border-white/10 hover:border-white/20 rounded-2xl p-5 flex items-center justify-between transition-all group text-left"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center shrink-0">
                                        <span className="text-2xl">{VEHICLES.find(v => v.id === booking.vehicle)?.icon || '🚗'}</span>
                                    </div>
                                    <div>
                                        <p className="text-white font-semibold text-sm">
                                            {booking.client?.name || 'Cliente'}
                                        </p>
                                        <p className="text-white/40 text-xs mt-0.5">
                                            {booking.client?.phone || '—'} · {getVehicleName(booking.vehicle)}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            {getServiceNames(booking.services).slice(0, 2).map((name, j) => (
                                                <span key={j} className="text-[10px] bg-white/10 text-white/60 px-2 py-0.5 rounded-full">{name}</span>
                                            ))}
                                            {(booking.services?.length || 0) > 2 && (
                                                <span className="text-[10px] text-white/30">+{booking.services.length - 2}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-white/60 text-xs">{formatBookingDate(booking.date)}</p>
                                    <p className="text-[#F59E0B] font-bold text-sm mt-0.5">{booking.time || '—'}</p>
                                    <span className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full font-semibold
                                        ${booking.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400' :
                                            booking.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                                                'bg-yellow-500/20 text-yellow-400'}`}>
                                        {booking.status === 'confirmed' ? 'Confirmado' : booking.status === 'cancelled' ? 'Cancelado' : 'Pendiente'}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
