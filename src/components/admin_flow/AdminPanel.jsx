import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import AdminSidebar from './AdminSidebar';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import AdminBookingDetail from './AdminBookingDetail';
import AdminWalkIn from './AdminWalkIn';
import AdminCalendar from './AdminCalendar';
import AdminSettings from './AdminSettings';

const AdminPanel = () => {
    const { isAuthenticated, adminView } = useAdmin();

    if (!isAuthenticated) {
        return <AdminLogin />;
    }

    const renderView = () => {
        switch (adminView) {
            case 'dashboard':
                return <AdminDashboard />;
            case 'detail':
                return <AdminBookingDetail />;
            case 'walkin':
                return <AdminWalkIn />;
            case 'calendar':
                return <AdminCalendar />;
            case 'settings':
                return <AdminSettings />;
            default:
                return <AdminDashboard />;
        }
    };

    return (
        <div className="flex min-h-screen bg-[#020617]">
            <AdminSidebar />
            {renderView()}
        </div>
    );
};

export default AdminPanel;
