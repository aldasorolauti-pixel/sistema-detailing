import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { VEHICLES, SERVICES } from '../lib/constants';

const BookingContext = createContext();

export const useBooking = () => {
    const context = useContext(BookingContext);
    if (!context) {
        throw new Error('useBooking must be used within BookingProvider');
    }
    return context;
};

const STORAGE_KEY = 'detailing_booking_draft';

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

    const calculatePrice = () => {
        if (!bookingState.selectedVehicle || bookingState.selectedServices.length === 0) {
            return 0;
        }

        const vehicle = VEHICLES.find(v => v.id === bookingState.selectedVehicle);
        if (!vehicle) return 0;

        return bookingState.selectedServices.reduce((total, serviceId) => {
            const service = SERVICES.find(s => s.id === serviceId);
            if (!service) return total;
            return total + (service.basePrice * vehicle.multiplier);
        }, 0);
    };

    const calculateDuration = () => {
        if (bookingState.selectedServices.length === 0) {
            return 0;
        }

        return bookingState.selectedServices.reduce((total, serviceId) => {
            const service = SERVICES.find(s => s.id === serviceId);
            if (!service) return total;
            return total + service.duration;
        }, 0);
    };

    const resetBooking = () => {
        setBookingState(initialState);
        localStorage.removeItem(STORAGE_KEY);
    };

    const saveBooking = () => {
        const bookings = JSON.parse(localStorage.getItem('detailing_bookings') || '[]');
        const newBooking = {
            id: `booking-${Date.now()}`,
            vehicle: bookingState.selectedVehicle,
            services: bookingState.selectedServices,
            date: bookingState.selectedDate?.toISOString(),
            time: bookingState.selectedTime,
            client: bookingState.clientData,
            price: calculatePrice(),
            duration: calculateDuration(),
            status: 'pending',
            createdAt: new Date().toISOString(),
        };
        bookings.push(newBooking);
        localStorage.setItem('detailing_bookings', JSON.stringify(bookings));
        // NOTE: Do NOT call resetBooking() here — User6 needs the state to render the success screen.
        // Reset happens when user clicks "Hacer otra reserva" or "Volver al inicio" in User6.
        return newBooking;
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
