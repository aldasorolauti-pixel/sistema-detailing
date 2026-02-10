import { createContext, useContext, useState, useCallback } from 'react';
import PropTypes from 'prop-types';

const AdminContext = createContext();

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error('useAdmin must be used within AdminProvider');
    }
    return context;
};

const ADMIN_CREDENTIALS = { username: 'admin', password: 'admin123' };
const BOOKINGS_KEY = 'detailing_bookings';

export const AdminProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [adminView, setAdminView] = useState('login');
    const [selectedBooking, setSelectedBooking] = useState(null);

    const login = useCallback((username, password) => {
        if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
            setIsAuthenticated(true);
            setAdminView('dashboard');
            return true;
        }
        return false;
    }, []);

    const logout = useCallback(() => {
        setIsAuthenticated(false);
        setAdminView('login');
        setSelectedBooking(null);
    }, []);

    const getBookings = useCallback(() => {
        try {
            return JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');
        } catch {
            return [];
        }
    }, []);

    const addWalkInBooking = useCallback((bookingData) => {
        const bookings = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');
        const newBooking = {
            id: `walkin-${Date.now()}`,
            ...bookingData,
            source: 'walkin',
            status: 'confirmed',
            createdAt: new Date().toISOString(),
        };
        bookings.push(newBooking);
        localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
        return newBooking;
    }, []);

    const updateBookingStatus = useCallback((bookingId, newStatus) => {
        const bookings = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');
        const updated = bookings.map(b => {
            if (b.id !== bookingId) return b;
            const update = { ...b, status: newStatus, updatedAt: new Date().toISOString() };
            if (newStatus === 'completed') update.completedAt = new Date().toISOString();
            return update;
        });
        localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updated));
    }, []);

    const navigateTo = useCallback((view, booking = null) => {
        setAdminView(view);
        if (booking) setSelectedBooking(booking);
    }, []);

    const value = {
        isAuthenticated,
        adminView,
        selectedBooking,
        login,
        logout,
        getBookings,
        addWalkInBooking,
        updateBookingStatus,
        navigateTo,
        setSelectedBooking,
    };

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    );
};

AdminProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
