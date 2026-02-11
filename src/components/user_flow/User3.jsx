import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import { useConfig } from '../../context/ConfigContext';
import { formatDuration } from '../../lib/formatters';

const User3 = () => {
    const navigate = useNavigate();
    const {
        selectedDate,
        setSelectedDate,
        selectedTime,
        setSelectedTime,
        calculateDuration,
        getAvailableSlots,
        setStep,
        resetBooking
    } = useBooking();
    const { isDateAvailable } = useConfig();

    const handleClose = () => {
        resetBooking();
        navigate('/');
    };

    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [availableSlots, setAvailableSlots] = useState([]);

    const totalDuration = calculateDuration();
    const isValid = selectedDate && selectedTime;

    // Update available slots when date changes
    useEffect(() => {
        if (selectedDate) {
            const slots = getAvailableSlots(selectedDate);
            setAvailableSlots(slots);
            // If currently selected time is no longer available, reset it
            if (selectedTime && !slots.includes(selectedTime)) {
                setSelectedTime(null);
            }
        } else {
            setAvailableSlots([]);
        }
    }, [selectedDate, getAvailableSlots]);

    // Generate calendar days
    const calendarDays = useMemo(() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];

        // Add empty cells for days before month starts
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        // Add actual days
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(day);
        }

        return days;
    }, [currentMonth]);

    const handleDateSelect = (day) => {
        if (!day) return;

        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (date >= today && isDateAvailable(date)) {
            setSelectedDate(date);
            setSelectedTime(null); // Reset time when date changes
        }
    };

    const isClosedDate = (day) => {
        if (!day) return false;
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        return !isDateAvailable(date);
    };

    const isPastDate = (day) => {
        if (!day) return false;
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    const isDisabledDate = (day) => {
        return isPastDate(day) || isClosedDate(day);
    };

    const isSelectedDate = (day) => {
        if (!day || !selectedDate) return false;
        return (
            selectedDate.getDate() === day &&
            selectedDate.getMonth() === currentMonth.getMonth() &&
            selectedDate.getFullYear() === currentMonth.getFullYear()
        );
    };

    const previousMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    const monthName = currentMonth.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });

    const formatSlotLabel = (slot) => {
        const hour = parseInt(slot.split(':')[0]);
        if (hour === 0) return '12:00 AM';
        if (hour < 12) return `${hour}:00 AM`;
        if (hour === 12) return '12:00 PM';
        return `${hour - 12}:00 PM`;
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
                .delay-200 { animation-delay: 0.2s; }
                `}
            </style>

            <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
            <div className="absolute inset-0 z-0 bg-[#020617]/90 backdrop-blur-sm"></div>

            <div className="relative z-10 w-full max-w-[420px] h-[850px] max-h-[92vh] bg-[#020617] rounded-[16px] shadow-2xl overflow-hidden flex flex-col border border-white/10 ring-1 ring-white/5">
                <header className="bg-[#020617]/95 backdrop-blur border-b border-white/5 sticky top-0 z-30 pb-4">
                    <div className="h-[80px] flex items-center justify-between px-6">
                        <div className="flex items-center gap-2">
                            <span className="text-white font-bold text-[18px]">🚙 Detailing Pro</span>
                        </div>
                        <button
                            onClick={handleClose}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
                        >
                            <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                    </div>
                    <div className="px-6">
                        <h2 className="text-center text-[14px] text-white/50 mb-4">Reservá tu turno</h2>
                        <div className="relative flex justify-between items-center max-w-[200px] mx-auto">
                            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/10 -translate-y-1/2 z-0"></div>
                            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[#F59E0B] -translate-y-1/2 z-0 transition-all duration-300 ease-out"></div>
                            <div className="relative z-10 flex flex-col items-center gap-2 group cursor-pointer">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] transition-all duration-300"></div>
                                <span className="absolute -bottom-5 text-[11px] font-medium text-[#F59E0B] whitespace-nowrap transition-colors duration-300">Vehículo</span>
                            </div>
                            <div className="relative z-10 flex flex-col items-center gap-2 group cursor-pointer">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] transition-all duration-300"></div>
                                <span className="absolute -bottom-5 text-[11px] font-medium text-[#F59E0B] whitespace-nowrap transition-colors duration-300">Servicio</span>
                            </div>
                            <div className="relative z-10 flex flex-col items-center gap-2 group cursor-pointer">
                                <div className="relative flex items-center justify-center">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] z-20"></div>
                                    <div className="absolute w-5 h-5 rounded-full border border-[#F59E0B]/50 animate-pulse z-10"></div>
                                </div>
                                <span className="absolute -bottom-5 text-[11px] font-medium text-[#F59E0B] whitespace-nowrap transition-colors duration-300">Fecha</span>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto hide-scrollbar p-6 space-y-6 pb-32">
                    <section className="animate-fade-in">
                        <h3 className="text-white text-xl font-bold mb-2">3. Fecha y hora</h3>
                        <p className="text-white/50 text-sm mb-6">Elegí cuándo querés venir</p>

                        {/* Calendar Header */}
                        <div className="flex items-center justify-between mb-4">
                            <button
                                onClick={previousMonth}
                                className="p-2 rounded-full hover:bg-white/5 text-white/60 hover:text-white transition-colors"
                            >
                                <span className="material-symbols-outlined">chevron_left</span>
                            </button>
                            <span className="text-white font-bold text-base capitalize">{monthName}</span>
                            <button
                                onClick={nextMonth}
                                className="p-2 rounded-full hover:bg-white/5 text-white/60 hover:text-white transition-colors"
                            >
                                <span className="material-symbols-outlined">chevron_right</span>
                            </button>
                        </div>

                        {/* Day Headers */}
                        <div className="grid grid-cols-7 gap-1 text-center mb-2 text-xs text-white/30 font-medium">
                            {['DO', 'LU', 'MA', 'MI', 'JU', 'VI', 'SA'].map(d => (
                                <span key={d} className="py-2">{d}</span>
                            ))}
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-2">
                            {calendarDays.map((day, index) => {
                                if (!day) {
                                    return <div key={`empty-${index}`} className="aspect-square"></div>;
                                }

                                const disabled = isDisabledDate(day);
                                const closed = isClosedDate(day);
                                const isSelected = isSelectedDate(day);

                                return (
                                    <button
                                        key={day}
                                        onClick={() => handleDateSelect(day)}
                                        disabled={disabled}
                                        title={closed && !isPastDate(day) ? 'Cerrado' : undefined}
                                        className={`aspect-square flex items-center justify-center text-sm rounded-full transition-all ${isSelected
                                            ? 'bg-[#F59E0B] text-[#020617] font-bold ring-4 ring-[#F59E0B]/20 shadow-lg shadow-[#F59E0B]/20 z-10 transform scale-110'
                                            : disabled
                                                ? 'text-white/10 cursor-not-allowed'
                                                : 'text-white hover:bg-white/10 hover:text-[#F59E0B]'
                                            }`}
                                    >
                                        {day}
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    {/* Time Slots */}
                    {selectedDate && (
                        <section className="animate-fade-in delay-200 pt-4 border-t border-white/5">
                            <div className="flex items-center gap-2 mb-5">
                                <h3 className="text-white text-lg font-bold">Horarios Disponibles</h3>
                                <span className="bg-white/10 text-white/60 text-[10px] px-2 py-0.5 rounded-full font-medium">
                                    {selectedDate.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric' })}
                                </span>
                            </div>
                            {availableSlots.length === 0 ? (
                                <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
                                    <span className="material-symbols-outlined text-3xl text-white/20 mb-2 block">event_busy</span>
                                    <p className="text-white/40 text-sm">No hay horarios disponibles para este día</p>
                                    <p className="text-white/25 text-xs mt-1">Probá con otra fecha</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 gap-3">
                                    {availableSlots.map(slot => (
                                        <button
                                            key={slot}
                                            onClick={() => setSelectedTime(slot)}
                                            className={`py-3 px-2 text-sm font-medium rounded-xl transition-all ${selectedTime === slot
                                                ? 'font-bold text-[#020617] bg-[#F59E0B] border-2 border-[#F59E0B] shadow-[0_0_15px_rgba(245,158,11,0.3)] transform scale-105'
                                                : 'text-white bg-[#0f172a] border border-white/10 hover:border-[#F59E0B] hover:text-[#F59E0B] active:scale-95'
                                                }`}
                                        >
                                            {formatSlotLabel(slot)}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </section>
                    )}
                </main>

                <footer className="absolute bottom-0 w-full bg-[#020617]/95 backdrop-blur-md border-t border-white/10 p-6 z-40">
                    {selectedDate && selectedTime && (
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex flex-col">
                                <span className="text-xs text-white/50 mb-1 font-medium">Fecha y Hora elegida</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-bold text-white tracking-tight">
                                        {selectedDate.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' })} • {selectedTime}
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="block text-xs font-medium text-white/50 mb-1">Duración total</span>
                                <span className="block text-sm font-bold text-[#F59E0B]">{formatDuration(totalDuration)}</span>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3">
                        <button
                            onClick={() => setStep(2)}
                            className="flex-1 bg-[#0f172a] hover:bg-white/5 border border-white/10 text-white/70 hover:text-white font-semibold text-sm py-4 px-4 rounded-[16px] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined text-lg">arrow_back</span>
                            <span>Volver</span>
                        </button>
                        <button
                            onClick={() => setStep(4)}
                            disabled={!isValid}
                            className="flex-[2] bg-gradient-to-r from-[#FBBF24] to-[#D97706] disabled:from-gray-700 disabled:to-gray-800 disabled:text-white/20 disabled:shadow-none hover:brightness-110 text-[#020617] font-bold text-base py-4 px-4 rounded-[16px] shadow-[0_8px_20px_-5px_rgba(245,158,11,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                        >
                            <span>Siguiente</span>
                            <span className="material-symbols-outlined text-xl">arrow_forward</span>
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default User3;
