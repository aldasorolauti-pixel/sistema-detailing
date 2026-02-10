import PropTypes from 'prop-types';
import { Calendar, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';

export const Header = () => {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        // Check if user has a preference
        const isDark = localStorage.getItem('darkMode') === 'true';
        setDarkMode(isDark);
        if (isDark) {
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem('darkMode', newMode);
        if (newMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    return (
        <header className="bg-white dark:bg-secondary-800 shadow-md border-b border-secondary-200 dark:border-secondary-700">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary p-2 rounded-lg">
                            <Calendar className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
                                Detailing Booking
                            </h1>
                            <p className="text-sm text-secondary-600 dark:text-secondary-400">
                                Sistema de Reservas
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
                        aria-label="Toggle dark mode"
                    >
                        {darkMode ? (
                            <Sun className="w-6 h-6 text-primary" />
                        ) : (
                            <Moon className="w-6 h-6 text-secondary-600" />
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
};

export const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
            <Header />
            <main className="container mx-auto px-4 py-8">
                {children}
            </main>
            <footer className="bg-white dark:bg-secondary-800 border-t border-secondary-200 dark:border-secondary-700 mt-auto">
                <div className="container mx-auto px-4 py-6 text-center text-secondary-600 dark:text-secondary-400">
                    <p>&copy; 2026 Detailing Booking. Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    );
};

Layout.propTypes = {
    children: PropTypes.node.isRequired,
};
