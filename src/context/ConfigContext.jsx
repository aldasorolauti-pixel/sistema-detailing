import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { VEHICLES as DEFAULT_VEHICLES, SERVICES as DEFAULT_SERVICES, TIME_SLOTS, DAYS_OFF, CAPACITY_PER_SLOT } from '../lib/constants';
import { supabase } from '../lib/supabaseClient';

const ConfigContext = createContext();

export const useConfig = () => {
    const context = useContext(ConfigContext);
    if (!context) {
        throw new Error('useConfig must be used within ConfigProvider');
    }
    return context;
};

const KEYS = {
    SERVICES: 'config:services',
    VEHICLES: 'config:vehicles',
    SCHEDULE: 'config:schedule',
    CAPACITY: 'config:capacity',
};

// Build default weekly schedule from constants
const buildDefaultSchedule = () => ({
    weekly: [0, 1, 2, 3, 4, 5, 6].map(day => ({
        day,
        open: !DAYS_OFF.includes(day),
        start: DAYS_OFF.includes(day) ? null : TIME_SLOTS[0]?.time || '09:00',
        end: DAYS_OFF.includes(day) ? null : TIME_SLOTS[TIME_SLOTS.length - 1]?.time || '18:00',
    })),
    exceptions: [],
});

const load = (key, fallback) => {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch {
        return fallback;
    }
};

const save = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};

export const ConfigProvider = ({ children }) => {
    const [services, setServicesState] = useState(DEFAULT_SERVICES);
    const [vehicles, setVehiclesState] = useState(() => load(KEYS.VEHICLES, DEFAULT_VEHICLES));
    const [schedule, setScheduleState] = useState(() => load(KEYS.SCHEDULE, buildDefaultSchedule()));
    const [capacity, setCapacityState] = useState(() => load(KEYS.CAPACITY, CAPACITY_PER_SLOT));

    // Fetch active services from Supabase on mount
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const { data, error } = await supabase
                    .from('services')
                    .select('*')
                    .eq('active', true)
                    .order('created_at', { ascending: true });

                if (error) {
                    console.error('Error loading services from Supabase:', error);
                    return; // Keep DEFAULT_SERVICES as fallback
                }

                if (data && data.length > 0) {
                    // Map DB columns to the shape the app expects
                    const mapped = data.map(s => ({
                        id: s.id,
                        name: s.name,
                        description: s.description,
                        basePrice: s.price,       // DB uses 'price', app uses 'basePrice'
                        duration: s.duration,
                        icon: s.icon || '✨',
                        active: s.active,
                    }));
                    setServicesState(mapped);
                }
            } catch (err) {
                console.error('Unexpected error fetching services:', err);
            }
        };

        fetchServices();
    }, []);

    // Only active services for client-facing views
    const activeServices = services.filter(s => s.active !== false);

    // ── Services CRUD ──
    const setServices = useCallback((newServices) => {
        setServicesState(newServices);
        save(KEYS.SERVICES, newServices);
    }, []);

    const addService = useCallback((service) => {
        const newService = { ...service, id: `svc-${Date.now()}`, active: true };
        setServices([...services, newService]);
        return newService;
    }, [services, setServices]);

    const updateService = useCallback((id, updates) => {
        setServices(services.map(s => s.id === id ? { ...s, ...updates } : s));
    }, [services, setServices]);

    const deleteService = useCallback((id) => {
        // Soft-delete: mark as inactive
        setServices(services.map(s => s.id === id ? { ...s, active: false } : s));
    }, [services, setServices]);

    // ── Vehicles ──
    const setVehicles = useCallback((newVehicles) => {
        setVehiclesState(newVehicles);
        save(KEYS.VEHICLES, newVehicles);
    }, []);

    const updateVehicleMultiplier = useCallback((id, multiplier) => {
        const clamped = Math.min(3.0, Math.max(0.5, Math.round(multiplier * 10) / 10));
        setVehicles(vehicles.map(v => v.id === id ? { ...v, multiplier: clamped } : v));
    }, [vehicles, setVehicles]);

    // ── Schedule ──
    const setSchedule = useCallback((newSchedule) => {
        setScheduleState(newSchedule);
        save(KEYS.SCHEDULE, newSchedule);
    }, []);

    const updateDaySchedule = useCallback((dayIndex, updates) => {
        const newWeekly = [...schedule.weekly];
        newWeekly[dayIndex] = { ...newWeekly[dayIndex], ...updates };
        setSchedule({ ...schedule, weekly: newWeekly });
    }, [schedule, setSchedule]);

    const addException = useCallback((exception) => {
        setSchedule({ ...schedule, exceptions: [...schedule.exceptions, { ...exception, id: `exc-${Date.now()}` }] });
    }, [schedule, setSchedule]);

    const removeException = useCallback((id) => {
        setSchedule({ ...schedule, exceptions: schedule.exceptions.filter(e => e.id !== id) });
    }, [schedule, setSchedule]);

    // ── Capacity ──
    const setCapacity = useCallback((newCapacity) => {
        const clamped = Math.min(10, Math.max(1, newCapacity));
        setCapacityState(clamped);
        save(KEYS.CAPACITY, clamped);
    }, []);

    // ── Availability helpers ──
    const isDateAvailable = useCallback((date) => {
        const dateStr = date.toISOString().split('T')[0];
        // Check exceptions
        const exception = schedule.exceptions.find(e => {
            if (e.date) return e.date === dateStr;
            if (e.start && e.end) return dateStr >= e.start && dateStr <= e.end;
            return false;
        });
        if (exception && exception.closed) return false;
        // Check weekly schedule
        const dayOfWeek = date.getDay();
        const daySchedule = schedule.weekly[dayOfWeek];
        return daySchedule?.open === true;
    }, [schedule]);

    const getAvailableHours = useCallback((date) => {
        if (!isDateAvailable(date)) return [];
        const dayOfWeek = date.getDay();
        const daySchedule = schedule.weekly[dayOfWeek];
        if (!daySchedule?.open || !daySchedule.start || !daySchedule.end) return [];
        // Generate hourly slots between start and end
        const startH = parseInt(daySchedule.start.split(':')[0]);
        const endH = parseInt(daySchedule.end.split(':')[0]);
        const slots = [];
        for (let h = startH; h <= endH; h++) {
            slots.push(`${String(h).padStart(2, '0')}:00`);
        }
        return slots;
    }, [schedule, isDateAvailable]);

    const value = {
        services,
        activeServices,
        vehicles,
        schedule,
        capacity,
        setServices,
        addService,
        updateService,
        deleteService,
        setVehicles,
        updateVehicleMultiplier,
        setSchedule,
        updateDaySchedule,
        addException,
        removeException,
        setCapacity,
        isDateAvailable,
        getAvailableHours,
    };

    return (
        <ConfigContext.Provider value={value}>
            {children}
        </ConfigContext.Provider>
    );
};

ConfigProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
