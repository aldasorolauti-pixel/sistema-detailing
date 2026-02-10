import React, { useState, useEffect, useMemo } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useConfig } from '../../context/ConfigContext';
import { formatDuration } from '../../lib/formatters';

const STATUS_LABELS = {
    pending: { label: 'Pendiente', color: 'bg-yellow-500/20 text-yellow-400' },
    confirmed: { label: 'Confirmado', color: 'bg-emerald-500/20 text-emerald-400' },
    'in-progress': { label: 'En Curso', color: 'bg-blue-500/20 text-blue-400' },
    completed: { label: 'Terminado', color: 'bg-green-600/20 text-green-400' },
    cancelled: { label: 'Cancelado', color: 'bg-red-500/20 text-red-400' },
};

const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const isSameDay = (d1, d2) => d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();

const AdminDashboard = () => {
    const { getBookings, navigateTo, adminView } = useAdmin();
    const { vehicles, activeServices } = useConfig();
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        setBookings(getBookings());
    }, [getBookings, adminView]);

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    // ── Dynamic Metrics ──
    const monthlyRevenue = useMemo(() => {
        return bookings
            .filter(b => {
                if (!b.date) return false;
                const d = new Date(b.date);
                return b.status === 'completed' && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            })
            .reduce((sum, b) => sum + (b.price || 0), 0);
    }, [bookings]);

    const monthlyBookings = useMemo(() => {
        return bookings.filter(b => {
            if (!b.date) return false;
            const d = new Date(b.date);
            return b.status !== 'cancelled' && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        }).length;
    }, [bookings]);

    const todayBookings = useMemo(() => {
        return bookings.filter(b => {
            if (!b.date) return false;
            return b.date.startsWith(todayStr) && b.status !== 'cancelled';
        }).length;
    }, [bookings, todayStr]);

    // ── Group bookings by day ──
    const groupedBookings = useMemo(() => {
        const upcoming = bookings
            .filter(b => b.date && new Date(b.date) >= new Date(todayStr) && b.status !== 'cancelled')
            .sort((a, b) => {
                const da = new Date(a.date).getTime();
                const db = new Date(b.date).getTime();
                if (da !== db) return da - db;
                return (a.time || '').localeCompare(b.time || '');
            });

        const grouped = {};
        upcoming.forEach(booking => {
            const dateKey = new Date(booking.date).toISOString().split('T')[0];
            if (!grouped[dateKey]) grouped[dateKey] = [];
            grouped[dateKey].push(booking);
        });

        return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b));
    }, [bookings, todayStr]);

    const formatDayHeader = (dateStr) => {
        const date = new Date(dateStr + 'T12:00:00');
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (isSameDay(date, today)) return 'HOY';
        if (isSameDay(date, tomorrow)) return 'MAÑANA';

        return `${DAYS[date.getDay()]} ${date.getDate()} de ${MONTHS[date.getMonth()]}`;
    };

    const getVehicleName = (vid) => vehicles.find(v => v.id === vid)?.name || vid || '—';
    const getVehicleIcon = (vid) => vehicles.find(v => v.id === vid)?.icon || '🚗';
    const getServiceNames = (sids) => {
        if (!sids || !Array.isArray(sids)) return [];
        return sids.map(sid => activeServices.find(s => s.id === sid)?.name || sid);
    };

    const stats = [
        { label: 'Ingresos del Mes', value: `$${monthlyRevenue.toLocaleString()}`, icon: 'payments', color: 'from-emerald-500/20 to-emerald-500/5', iconColor: 'text-emerald-400', subtitle: 'Solo turnos completados' },
        { label: 'Turnos del Mes', value: monthlyBookings, icon: 'event_available', color: 'from-blue-500/20 to-blue-500/5', iconColor: 'text-blue-400', subtitle: 'Excluyendo cancelados' },
        { label: 'Turnos Hoy', value: todayBookings, icon: 'today', color: 'from-[#F59E0B]/20 to-[#F59E0B]/5', iconColor: 'text-[#F59E0B]', subtitle: 'Activos hoy' },
    ];

    return (
        <div className="flex-1 p-8 overflow-y-auto">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white">Panel de Control</h2>
                <p className="text-white/40 text-sm mt-1">Bienvenido de nuevo, resumen de actividad.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
                {stats.map((stat, i) => (
                    <div key={i} className={`bg-gradient-to-br ${stat.color} border border-white/10 rounded-2xl p-6 relative overflow-hidden hover:border-white/20 transition-all`}>
                        <div className="absolute top-4 right-4 w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                            <span className={`material-symbols-outlined text-2xl ${stat.iconColor}`}>{stat.icon}</span>
                        </div>
                        <p className="text-white/50 text-xs uppercase font-semibold tracking-wider mb-2">{stat.label}</p>
                        <p className="text-white text-3xl font-black tracking-tight">{stat.value}</p>
                        <p className="text-white/25 text-[10px] mt-1">{stat.subtitle}</p>
                    </div>
                ))}
            </div>

            {/* Grouped Bookings */}
            <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#F59E0B]">schedule</span>
                    Próximos Turnos
                </h3>

                {groupedBookings.length === 0 ? (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                        <span className="material-symbols-outlined text-5xl text-white/20 mb-3 block">event_busy</span>
                        <p className="text-white/40 text-sm">No hay turnos próximos</p>
                        <p className="text-white/25 text-xs mt-1">Los turnos reservados aparecerán aquí</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {groupedBookings.map(([dateStr, dayBookings]) => (
                            <div key={dateStr}>
                                {/* Day Divider */}
                                <div className="flex items-center gap-3 py-3 mt-2 first:mt-0">
                                    <div className="h-px flex-1 bg-white/10"></div>
                                    <span className={`text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full
                                        ${formatDayHeader(dateStr) === 'HOY' ? 'bg-[#F59E0B]/20 text-[#F59E0B]' :
                                            formatDayHeader(dateStr) === 'MAÑANA' ? 'bg-blue-500/20 text-blue-400' :
                                                'bg-white/5 text-white/40'}`}>
                                        {formatDayHeader(dateStr)}
                                    </span>
                                    <div className="h-px flex-1 bg-white/10"></div>
                                </div>

                                {/* Bookings for this day */}
                                <div className="space-y-2">
                                    {dayBookings.map(booking => {
                                        const statusInfo = STATUS_LABELS[booking.status] || STATUS_LABELS.pending;
                                        return (
                                            <button
                                                key={booking.id}
                                                onClick={() => navigateTo('detail', booking)}
                                                className="w-full bg-white/5 hover:bg-white/8 border border-white/10 hover:border-white/20 rounded-2xl p-4 flex items-center justify-between transition-all text-left"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-11 h-11 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center shrink-0">
                                                        <span className="text-xl">{getVehicleIcon(booking.vehicle)}</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-semibold text-sm">
                                                            {booking.client?.name || 'Cliente'}
                                                            <span className="text-white/30 font-normal ml-2">· {getVehicleName(booking.vehicle)}</span>
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                            {getServiceNames(booking.services).slice(0, 2).map((name, j) => (
                                                                <span key={j} className="text-[10px] bg-white/10 text-white/50 px-2 py-0.5 rounded-full">{name}</span>
                                                            ))}
                                                            {(booking.services?.length || 0) > 2 && (
                                                                <span className="text-[10px] text-white/30">+{booking.services.length - 2}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right shrink-0 flex items-center gap-3">
                                                    <div>
                                                        <p className="text-[#F59E0B] font-bold text-sm">{booking.time || '—'}</p>
                                                        <p className="text-white/30 text-xs">${(booking.price || 0).toLocaleString()}</p>
                                                    </div>
                                                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ${statusInfo.color}`}>
                                                        {statusInfo.label}
                                                    </span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
