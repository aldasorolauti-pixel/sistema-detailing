import React from 'react';
import { useNavigate } from 'react-router-dom';

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
                        Premium Detailing
                    </h1>
                    <p className="text-lg md:text-2xl text-gray-400 font-light mb-12 max-w-2xl">
                        Cuidado profesional para tu vehículo
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
                                Lun - Vie: 09:00 - 19:00<br />
                                Sábados: 09:00 - 14:00
                            </p>
                        </div>
                        <div className="glass-card p-8 rounded-2xl flex flex-col items-center text-center hover:bg-white/5 transition-colors duration-300 group">
                            <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-[#F59E0B]/20 transition-colors">
                                <span className="material-symbols-outlined text-3xl text-[#F59E0B]">call</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Contacto</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                +54 11 1234-5678<br />
                                info@premiumdetailing.com
                            </p>
                        </div>
                        <div className="glass-card p-8 rounded-2xl flex flex-col items-center text-center hover:bg-white/5 transition-colors duration-300 group">
                            <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-[#F59E0B]/20 transition-colors">
                                <span className="material-symbols-outlined text-3xl text-[#F59E0B]">location_on</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Ubicación</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Av. del Libertador 1234<br />
                                Buenos Aires, Argentina
                            </p>
                        </div>
                    </div>
                </main>

                <footer className="mt-20 text-gray-600 text-sm font-medium">
                    © 2024 Premium Detailing. Todos los derechos reservados.
                </footer>
            </div>

            <a className="fixed bottom-8 right-8 z-50 animate-float group" href="#">
                <div className="bg-[#25D366] hover:bg-[#20bd5a] text-white p-4 rounded-full shadow-[0_4px_14px_rgba(37,211,102,0.4)] transition-all duration-300 flex items-center justify-center transform group-hover:scale-110">
                    <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path>
                    </svg>
                </div>
            </a>
        </div>
    );
};

export default Lobby;
