import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useConfig } from './ConfigContext';
import { supabase } from '../lib/supabaseClient';

const BookingContext = createContext();

export const useBooking = () => {
    const context = useContext(BookingContext);
    if (!context) {
        throw new Error('useBooking must be used within BookingProvider');
    }
    return context;
};

const STORAGE_KEY = 'detailing_booking_draft';
const BOOKINGS_KEY = 'detailing_bookings';

const initialState = {
    step: 1,
    selectedVehicle: null,
    selectedServices: [],
    selectedDate: null,
    selectedTime: null,
    clientData: {
        name: '',
        phone: '',
        plate: '',
        brand: '',
        model: '',
    },
};

export const BookingProvider = ({ children }) => {
    const { services, activeServices, vehicles, schedule, capacity, isDateAvailable, getAvailableHours } = useConfig();

    const [bookingState, setBookingState] = useState(() => {
        // Cargar desde localStorage si existe
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);

                // Validate that parsed state has all required properties
                const isValid = parsed &&
                    typeof parsed.step === 'number' &&
                    parsed.hasOwnProperty('selectedVehicle') &&
                    Array.isArray(parsed.selectedServices) &&
                    parsed.hasOwnProperty('clientData');

                if (!isValid) {
                    console.warn('Invalid booking data in localStorage, using initial state');
                    localStorage.removeItem(STORAGE_KEY);
                    return initialState;
                }

                // Convertir selectedDate de string a Date si existe
                if (parsed.selectedDate) {
                    parsed.selectedDate = new Date(parsed.selectedDate);
                }
                return parsed;
            }
        } catch (error) {
            console.error('Error loading booking data from localStorage:', error);
            // Clear corrupted data
            localStorage.removeItem(STORAGE_KEY);
        }
        return initialState;
    });

    // Guardar en localStorage cada vez que cambia el estado
    useEffect(() => {
        const toSave = { ...bookingState };
        // Convertir Date a string para localStorage
        if (toSave.selectedDate) {
            toSave.selectedDate = toSave.selectedDate.toISOString();
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    }, [bookingState]);

    const setStep = (step) => {
        setBookingState(prev => ({ ...prev, step }));
    };

    const setSelectedVehicle = (vehicleId) => {
        setBookingState(prev => ({ ...prev, selectedVehicle: vehicleId }));
    };

    const toggleService = (serviceId) => {
        setBookingState(prev => {
            const exists = prev.selectedServices.includes(serviceId);
            const newServices = exists
                ? prev.selectedServices.filter(id => id !== serviceId)
                : [...prev.selectedServices, serviceId];
            return { ...prev, selectedServices: newServices };
        });
    };

    const setSelectedDate = (date) => {
        setBookingState(prev => ({ ...prev, selectedDate: date }));
    };

    const setSelectedTime = (time) => {
        setBookingState(prev => ({ ...prev, selectedTime: time }));
    };

    const setClientData = (data) => {
        setBookingState(prev => ({
            ...prev,
            clientData: typeof data === 'function' ? data(prev.clientData) : data
        }));
    };

    // Use config data for calculations instead of hardcoded constants
    const calculatePrice = useCallback(() => {
        if (!bookingState.selectedVehicle || bookingState.selectedServices.length === 0) {
            return 0;
        }

        const vehicle = vehicles.find(v => v.id === bookingState.selectedVehicle);
        if (!vehicle) return 0;

        return bookingState.selectedServices.reduce((total, serviceId) => {
            const service = services.find(s => s.id === serviceId);
            if (!service) return total;
            return total + (service.basePrice * vehicle.multiplier);
        }, 0);
    }, [bookingState.selectedVehicle, bookingState.selectedServices, vehicles, services]);

    const calculateDuration = useCallback(() => {
        if (bookingState.selectedServices.length === 0) {
            return 0;
        }

        return bookingState.selectedServices.reduce((total, serviceId) => {
            const service = services.find(s => s.id === serviceId);
            if (!service) return total;
            return total + service.duration;
        }, 0);
    }, [bookingState.selectedServices, services]);

    // ── Availability: checks capacity + schedule + duration ──
    const getAvailableSlots = useCallback((date) => {
        if (!date) return [];
        if (!isDateAvailable(date)) return [];

        // Get the configured hours for this day
        const configuredHours = getAvailableHours(date);
        if (configuredHours.length === 0) return [];

        // Parse the hour values
        const hourValues = configuredHours.map(h => parseInt(h.split(':')[0]));
        const minHour = Math.min(...hourValues);
        const maxHour = Math.max(...hourValues);
        // maxHour represents the last slot start; closing time is maxHour + 1
        // But actually getAvailableHours generates slots from startH to endH inclusive
        // The endH from schedule is the closing hour, so the last valid slot depends on duration
        // Let's use the schedule directly for closing hour
        const dayOfWeek = date.getDay();
        const daySchedule = schedule.weekly[dayOfWeek];
        const closingHour = daySchedule?.end ? parseInt(daySchedule.end.split(':')[0]) : maxHour + 1;

        // Calculate duration in hours (rounded up)
        const duration = calculateDuration();
        const hoursNeeded = Math.max(1, Math.ceil(duration / 60));

        // Load existing bookings to check capacity
        let allBookings = [];
        try {
            allBookings = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');
        } catch {
            allBookings = [];
        }

        const dateStr = date.toISOString().split('T')[0];

        const availableSlots = [];
        for (let hour = minHour; hour <= maxHour; hour++) {
            // BUG #4: Check if service fits before closing (Allow exact fit: if closes at 19:00 and ends at 19:00, it's valid)
            if (hour + hoursNeeded > closingHour) {
                continue;
            }

            // BUG #2: Check capacity for each hour the service occupies
            let slotAvailable = true;
            for (let h = 0; h < hoursNeeded; h++) {
                const checkHour = hour + h;
                const hourStr = `${String(checkHour).padStart(2, '0')}:00`;

                // Count bookings that overlap this hour
                const concurrentBookings = allBookings.filter(booking => {
                    if (booking.status === 'cancelled') return false;
                    if (!booking.date) return false;
                    const bookingDateStr = booking.date.split('T')[0];
                    if (bookingDateStr !== dateStr) return false;

                    // Parse booking time and duration
                    const bookingStartHour = parseInt((booking.time || '00:00').split(':')[0]);
                    const bookingDuration = booking.duration || 60;
                    const bookingEndHour = bookingStartHour + Math.ceil(bookingDuration / 60);

                    return checkHour >= bookingStartHour && checkHour < bookingEndHour;
                });

                if (concurrentBookings.length >= capacity) {
                    slotAvailable = false;
                    break;
                }
            }

            if (slotAvailable) {
                availableSlots.push(`${String(hour).padStart(2, '0')}:00`);
            }
        }

        return availableSlots;
    }, [schedule, capacity, calculateDuration, isDateAvailable, getAvailableHours]);

    const resetBooking = () => {
        setBookingState(initialState);
        localStorage.removeItem(STORAGE_KEY);
    };

    const saveBooking = async () => {
        const price = calculatePrice();
        const duration = calculateDuration();
        const dateStr = bookingState.selectedDate?.toISOString().split('T')[0]; // 'YYYY-MM-DD'

        const bookingPayload = {
            vehicle: bookingState.selectedVehicle,
            services: bookingState.selectedServices,
            date: dateStr,
            time: bookingState.selectedTime,
            client: bookingState.clientData,
            price,
            duration,
            status: 'pending',
        };

        try {
            const { data, error } = await supabase
                .from('turnos')
                .insert([bookingPayload])
                .select()
                .single();

            if (error) {
                console.error('Error saving booking to Supabase:', error);
                // Fallback: save to localStorage so the user doesn't lose their booking
                const fallback = { ...bookingPayload, id: `booking-${Date.now()}`, createdAt: new Date().toISOString() };
                const existing = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');
                existing.push(fallback);
                localStorage.setItem(BOOKINGS_KEY, JSON.stringify(existing));
                return fallback;
            }

            // NOTE: Do NOT call resetBooking() here — User6 needs the state to render the success screen.
            // Reset happens when user clicks "Hacer otra reserva" o "Volver al inicio" in User6.
            return data;
        } catch (err) {
            console.error('Unexpected error saving booking:', err);
            return null;
        }
    };

    const value = {
        // State
        step: bookingState.step,
        selectedVehicle: bookingState.selectedVehicle,
        selectedServices: bookingState.selectedServices,
        selectedDate: bookingState.selectedDate,
        selectedTime: bookingState.selectedTime,
        clientData: bookingState.clientData,

        // Setters
        setStep,
        setSelectedVehicle,
        toggleService,
        setSelectedDate,
        setSelectedTime,
        setClientData,

        // Calculations
        calculatePrice,
        calculateDuration,

        // Availability (Bugs #2, #3, #4)
        getAvailableSlots,

        // Actions
        resetBooking,
        saveBooking,
    };

    return (
        <BookingContext.Provider value={value}>
            {children}
        </BookingContext.Provider>
    );
};

BookingProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
