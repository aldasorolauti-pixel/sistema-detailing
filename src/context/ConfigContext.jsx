import { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { VEHICLES as DEFAULT_VEHICLES, SERVICES as DEFAULT_SERVICES, TIME_SLOTS, DAYS_OFF, CAPACITY_PER_SLOT } from '../lib/constants';
import { supabase } from '../lib/supabaseClient';
import { ConfigContext } from './ConfigContextObject';

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

    // ── Fetch services + schedule from Supabase ──
    const refreshConfig = useCallback(async () => {
        try {
            // 1. Services
            const { data: svcData, error: svcError } = await supabase
                .from('services')
                .select('*')
                .eq('active', true)
                .order('created_at', { ascending: true });

            if (!svcError && svcData) {
                setServicesState(svcData.map(s => ({
                    id: s.id,
                    name: s.name,
                    description: s.description,
                    basePrice: s.price,
                    duration: s.duration,
                    icon: s.icon || '✨',
                    active: s.active,
                })));
            }

            // 2. Business hours (weekly schedule)
            const { data: hoursData, error: hoursError } = await supabase
                .from('business_hours')
                .select('*')
                .order('day_of_week', { ascending: true });

            if (!hoursError && hoursData && hoursData.length > 0) {
                const weekly = [0, 1, 2, 3, 4, 5, 6].map(i => {
                    const row = hoursData.find(h => h.day_of_week === i);
                    return row
                        ? { day: i, open: row.is_open, start: row.open_time?.slice(0, 5) || '09:00', end: row.close_time?.slice(0, 5) || '18:00' }
                        : { day: i, open: false, start: '09:00', end: '18:00' };
                });
                // Preserve local exceptions (not yet in Supabase)
                setScheduleState(prev => ({ ...prev, weekly }));
            }

            // 3. Exceptions from Supabase
            const { data: excData, error: excError } = await supabase
                .from('business_exceptions')
                .select('*')
                .order('created_at', { ascending: true });

            if (!excError && excData) {
                const exceptions = excData.map(e => ({
                    id: e.id,
                    date: e.date,
                    start: e.start_date,
                    end: e.end_date,
                    closed: e.closed,
                    reason: e.reason,
                }));
                setScheduleState(prev => ({ ...prev, exceptions }));
            }
        } catch (err) {
            console.error('Unexpected error in refreshConfig:', err);
        }
    }, []);

    // Load on mount
    useEffect(() => {
        refreshConfig();
    }, [refreshConfig]);

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
        save(KEYS.SCHEDULE, newSchedule); // localStorage backup
    }, []);

    const updateDaySchedule = useCallback(async (dayIndex, updates) => {
        // 1. Optimistic local update
        const newWeekly = [...schedule.weekly];
        newWeekly[dayIndex] = { ...newWeekly[dayIndex], ...updates };
        setSchedule({ ...schedule, weekly: newWeekly });

        // 2. Persist to Supabase business_hours
        const dbUpdates = {};
        if (updates.open !== undefined) dbUpdates.is_open = updates.open;
        if (updates.start !== undefined) dbUpdates.open_time = updates.start;
        if (updates.end !== undefined) dbUpdates.close_time = updates.end;

        const { error } = await supabase
            .from('business_hours')
            .update(dbUpdates)
            .eq('day_of_week', dayIndex);

        if (error) console.error('Error updating business_hours:', error);
    }, [schedule, setSchedule]);

    const addException = useCallback(async (exception) => {
        // 1. Insert into Supabase
        const { data, error } = await supabase
            .from('business_exceptions')
            .insert([{
                date: exception.date || null,
                start_date: exception.start || null,
                end_date: exception.end || null,
                closed: exception.closed ?? true,
                reason: exception.reason,
            }])
            .select()
            .single();

        if (error) {
            console.error('Error adding exception:', error);
            // Fallback: add locally with temp id
            setSchedule({ ...schedule, exceptions: [...schedule.exceptions, { ...exception, id: `exc-${Date.now()}` }] });
            return;
        }

        // 2. Add to local state with real DB id
        const newException = { id: data.id, date: data.date, start: data.start_date, end: data.end_date, closed: data.closed, reason: data.reason };
        setSchedule({ ...schedule, exceptions: [...schedule.exceptions, newException] });
    }, [schedule, setSchedule]);

    const removeException = useCallback(async (id) => {
        // 1. Optimistic local remove
        setSchedule({ ...schedule, exceptions: schedule.exceptions.filter(e => e.id !== id) });

        // 2. Delete from Supabase
        const { error } = await supabase
            .from('business_exceptions')
            .delete()
            .eq('id', id);

        if (error) console.error('Error removing exception:', error);
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
        refreshConfig,
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
