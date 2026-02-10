import React from 'react';
import { useAdmin } from '../../context/AdminContext';

const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'walkin', label: 'Nuevo Registro', icon: 'add_circle' },
    { id: 'calendar', label: 'Calendario', icon: 'calendar_today' },
    { id: 'settings', label: 'Configuración', icon: 'settings' },
];

const AdminSidebar = () => {
    const { adminView, navigateTo, logout } = useAdmin();

    return (
        <aside className="w-64 bg-[#0a0f1a] border-r border-white/10 flex flex-col min-h-screen">
            {/* Brand */}
            <div className="p-6 border-b border-white/10">
                <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                    <span className="text-[#F59E0B]">✦</span> LuxeDetail
                </h1>
            </div>

            {/* Nav */}
            <nav className="flex-1 p-4 space-y-1">
                {NAV_ITEMS.map(item => (
                    <button
                        key={item.id}
                        onClick={() => navigateTo(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                            ${adminView === item.id
                                ? 'bg-[#F59E0B]/15 text-[#F59E0B] shadow-lg shadow-[#F59E0B]/5'
                                : 'text-white/50 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <span className="material-symbols-outlined text-xl">{item.icon}</span>
                        {item.label}
                    </button>
                ))}
            </nav>

            {/* User + Logout */}
            <div className="p-4 border-t border-white/10 space-y-3">
                <div className="flex items-center gap-3 px-4 py-2">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center text-black font-bold text-sm">
                        A
                    </div>
                    <div>
                        <p className="text-white text-sm font-semibold">Admin</p>
                        <p className="text-white/40 text-xs">Administrador</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-400/10 transition-all"
                >
                    <span className="material-symbols-outlined text-xl">logout</span>
                    Cerrar Sesión
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
