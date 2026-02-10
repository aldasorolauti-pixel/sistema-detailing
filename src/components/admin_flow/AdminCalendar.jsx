import React, { useState, useEffect, useMemo } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useConfig } from '../../context/ConfigContext';

const WEEKDAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const STATUS_LABELS = {
    pending: { label: 'Pendiente', color: 'bg-yellow-500/20 text-yellow-400' },
    confirmed: { label: 'Confirmado', color: 'bg-emerald-500/20 text-emerald-400' },
    'in-progress': { label: 'En Curso', color: 'bg-blue-500/20 text-blue-400' },
    completed: { label: 'Terminado', color: 'bg-green-600/20 text-green-400' },
    cancelled: { label: 'Cancelado', color: 'bg-red-500/20 text-red-400' },
};

const AdminCalendar = () => {
    const { getBookings, navigateTo, adminView } = useAdmin();
    const { vehicles } = useConfig();
    const [bookings, setBookings] = useState([]);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [selectedDay, setSelectedDay] = useState(null);

    useEffect(() => {
        setBookings(getBookings());
    }, [getBookings, adminView]);

    const calendarDays = useMemo(() => {
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const days = [];
        for (let i = 0; i < firstDay; i++) days.push(null);
        for (let d = 1; d <= daysInMonth; d++) days.push(d);
        return days;
    }, [currentMonth, currentYear]);

    const getBookingsForDay = (day) => {
        if (!day) return [];
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return bookings.filter(b => b.date && b.date.startsWith(dateStr) && b.status !== 'cancelled');
    };

    const prevMonth = () => {
        if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
        else setCurrentMonth(m => m - 1);
        setSelectedDay(null);
    };

    const nextMonth = () => {
        if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
        else setCurrentMonth(m => m + 1);
        setSelectedDay(null);
    };

    const selectedDayBookings = selectedDay ? getBookingsForDay(selectedDay) : [];
    const today = new Date();
    const isToday = (day) => day && today.getDate() === day && today.getMonth() === currentMonth && today.getFullYear() === currentYear;

    return (
        <div className="flex-1 p-8 overflow-y-auto">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white">Calendario de Turnos</h2>
                <p className="text-white/40 text-sm mt-1">Gestiona las citas y disponibilidad del mes.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <button onClick={prevMonth} className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all">
                            <span className="material-symbols-outlined">chevron_left</span>
                        </button>
                        <h3 className="text-white text-lg font-bold">{MONTHS[currentMonth]} {currentYear}</h3>
                        <button onClick={nextMonth} className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all">
                            <span className="material-symbols-outlined">chevron_right</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {WEEKDAYS.map(d => (
                            <div key={d} className="text-center text-white/30 text-xs font-semibold uppercase tracking-wider py-2">{d}</div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {calendarDays.map((day, i) => {
                            const dayBookings = getBookingsForDay(day);
                            const hasBookings = dayBookings.length > 0;
                            const isSelected = selectedDay === day && day !== null;
                            return (
                                <button
                                    key={i}
                                    onClick={() => day && setSelectedDay(day)}
                                    disabled={!day}
                                    className={`aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all text-sm
                                        ${!day ? 'cursor-default' : 'hover:bg-white/10 cursor-pointer'}
                                        ${isSelected ? 'bg-[#F59E0B]/20 border border-[#F59E0B]/40 ring-1 ring-[#F59E0B]/20' : 'border border-transparent'}
                                        ${isToday(day) ? 'bg-white/10' : ''}`}
                                >
                                    <span className={`font-medium ${isToday(day) ? 'text-[#F59E0B] font-bold' : day ? 'text-white/70' : ''}`}>
                                        {day || ''}
                                    </span>
                                    {hasBookings && (
                                        <div className="flex gap-0.5 mt-1">
                                            {dayBookings.slice(0, 3).map((_, j) => (
                                                <div key={j} className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]"></div>
                                            ))}
                                            {dayBookings.length > 3 && <span className="text-[8px] text-[#F59E0B] ml-0.5">+</span>}
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sticky top-8">
                        <h3 className="text-white font-bold text-base mb-4">
                            {selectedDay ? `${selectedDay} de ${MONTHS[currentMonth]}` : 'Seleccioná un día'}
                        </h3>

                        {!selectedDay ? (
                            <p className="text-white/30 text-sm">Hacé click en un día del calendario para ver sus turnos.</p>
                        ) : selectedDayBookings.length === 0 ? (
                            <div className="text-center py-8">
                                <span className="material-symbols-outlined text-4xl text-white/15 block mb-2">event_busy</span>
                                <p className="text-white/30 text-sm">Sin turnos este día</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {selectedDayBookings.map(booking => {
                                    const statusInfo = STATUS_LABELS[booking.status] || STATUS_LABELS.pending;
                                    return (
                                        <button
                                            key={booking.id}
                                            onClick={() => navigateTo('detail', booking)}
                                            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 text-left transition-all"
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="text-white text-sm font-semibold">{booking.client?.name || 'Cliente'}</p>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${statusInfo.color}`}>
                                                    {statusInfo.label}
                                                </span>
                                            </div>
                                            <p className="text-white/40 text-xs">
                                                {booking.time || '—'} · {vehicles.find(v => v.id === booking.vehicle)?.name || '—'}
                                            </p>
                                            <p className="text-[#F59E0B] text-xs font-semibold mt-1">
                                                ${(booking.price || 0).toLocaleString()}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCalendar;
