import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';

const AdminLogin = () => {
    const { login } = useAdmin();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Simulate async
        await new Promise(r => setTimeout(r, 600));

        const success = login(username, password);
        if (!success) {
            setError('Credenciales incorrectas');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Close button */}
            <button
                onClick={() => navigate('/')}
                className="absolute top-4 right-4 z-20 p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
                <span className="material-symbols-outlined text-white/60 hover:text-white text-2xl">close</span>
            </button>

            {/* Background effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#F59E0B]/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#F59E0B]/5 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 w-full max-w-md">
                {/* Brand */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-2xl mb-6 shadow-lg shadow-[#F59E0B]/20">
                        <span className="material-symbols-outlined text-3xl text-black">auto_awesome</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Detailing Pro</h1>
                    <p className="text-white/40 text-sm mt-2">Portal Administrativo</p>
                </div>

                {/* Login Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">
                                Usuario
                            </label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-xl">person</span>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    placeholder="Ingresá tu usuario"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 pl-12 pr-4 py-3.5 focus:outline-none focus:border-[#F59E0B]/50 focus:ring-1 focus:ring-[#F59E0B]/20 transition-all"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">
                                Contraseña
                            </label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-xl">lock</span>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="Ingresá tu contraseña"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 pl-12 pr-4 py-3.5 focus:outline-none focus:border-[#F59E0B]/50 focus:ring-1 focus:ring-[#F59E0B]/20 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg">error</span>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:brightness-110 text-black font-bold py-4 px-6 rounded-xl shadow-lg shadow-[#F59E0B]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                                    Ingresando...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-xl">login</span>
                                    Iniciar Sesión
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-white/20 text-xs mt-8">
                    © 2026 Detailing Pro System. Todos los derechos reservados.
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;
