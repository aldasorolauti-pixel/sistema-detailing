import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BUSINESS_CONFIG, formatPhone } from '../../utils/constants';
import WhatsAppButton from '../layout/WhatsAppButton';

const Lobby = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-[#020617] font-sans text-white min-h-screen relative overflow-x-hidden">
            {/* Styles and Animations */}
            <style>
                {`
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }
                .animate-float {
                    animation: float 4s ease-in-out infinite;
                }
                .glass-card {
                    background: rgba(15, 23, 42, 0.6);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                .hero-pattern {
                    background-image: radial-gradient(circle at top center, rgba(245, 158, 11, 0.15) 0%, rgba(2, 6, 23, 0) 50%);
                }
                `}
            </style>

            <div className="fixed inset-0 z-0 hero-pattern pointer-events-none"></div>
            <div className="absolute inset-0 z-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>

            <button
                onClick={() => window.location.href = '/admin'}
                className="absolute top-6 right-6 z-50 flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#F59E0B] border border-[#F59E0B]/50 rounded-full hover:bg-[#F59E0B]/10 transition-colors duration-300"
            >
                <span className="material-symbols-outlined text-lg">lock</span>
                Soy Admin
            </button>

            <div className="relative z-10 container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[90vh]">
                <header className="w-full flex justify-center mb-12">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#F59E0B] text-5xl">local_car_wash</span>
                    </div>
                </header>

                <main className="w-full max-w-4xl text-center flex flex-col items-center">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-gray-500">
                        {BUSINESS_CONFIG.name}
                    </h1>
                    <p className="text-lg md:text-2xl text-gray-400 font-light mb-12 max-w-2xl">
                        {BUSINESS_CONFIG.tagline}
                    </p>

                    <button
                        onClick={() => navigate('/booking')}
                        className="group relative px-8 py-5 rounded-full bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-[#020617] font-bold text-xl shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:shadow-[0_0_50px_rgba(245,158,11,0.5)] transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
                    >
                        <span className="material-symbols-outlined text-2xl group-hover:animate-pulse">calendar_month</span>
                        Reservar Ahora
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-24">
                        <div className="glass-card p-8 rounded-2xl flex flex-col items-center text-center hover:bg-white/5 transition-colors duration-300 group">
                            <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-[#F59E0B]/20 transition-colors">
                                <span className="material-symbols-outlined text-3xl text-[#F59E0B]">schedule</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Horarios</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                {BUSINESS_CONFIG.schedule.weekdays}<br />
                                {BUSINESS_CONFIG.schedule.saturday}
                            </p>
                        </div>
                        <div className="glass-card p-8 rounded-2xl flex flex-col items-center text-center hover:bg-white/5 transition-colors duration-300 group">
                            <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-[#F59E0B]/20 transition-colors">
                                <span className="material-symbols-outlined text-3xl text-[#F59E0B]">call</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Contacto</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                {formatPhone(BUSINESS_CONFIG.phone)}<br />
                                {BUSINESS_CONFIG.email}
                            </p>
                        </div>
                        <div className="glass-card p-8 rounded-2xl flex flex-col items-center text-center hover:bg-white/5 transition-colors duration-300 group">
                            <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-[#F59E0B]/20 transition-colors">
                                <span className="material-symbols-outlined text-3xl text-[#F59E0B]">location_on</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Ubicación</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                {BUSINESS_CONFIG.address}<br />
                                {BUSINESS_CONFIG.city}, {BUSINESS_CONFIG.country}
                            </p>
                        </div>
                    </div>
                </main>

                <footer className="mt-20 text-gray-600 text-sm font-medium">
                    © {new Date().getFullYear()} {BUSINESS_CONFIG.name}. Todos los derechos reservados.
                </footer>
            </div>


            <WhatsAppButton />
        </div >
    );
};

export default Lobby;
