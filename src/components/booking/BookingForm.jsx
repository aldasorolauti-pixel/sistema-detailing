import { useState } from 'react';
import { Calendar, Clock, Car, User } from 'lucide-react';
import { Card, Button, Input } from '../ui';

export const BookingForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        vehicle: '',
        date: '',
        time: '',
        service: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Booking submitted:', formData);
        // Aquí irá la lógica de envío
    };

    return (
        <Card title="Nueva Reserva" className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" />
                        <Input
                            id="name"
                            name="name"
                            label="Nombre Completo"
                            placeholder="Juan Pérez"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <Input
                        id="email"
                        name="email"
                        type="email"
                        label="Email"
                        placeholder="juan@ejemplo.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        label="Teléfono"
                        placeholder="+54 9 11 1234-5678"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />

                    <div className="flex items-center gap-2">
                        <Car className="w-5 h-5 text-primary" />
                        <Input
                            id="vehicle"
                            name="vehicle"
                            label="Vehículo"
                            placeholder="Toyota Corolla 2020"
                            value={formData.vehicle}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        <Input
                            id="date"
                            name="date"
                            type="date"
                            label="Fecha"
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary" />
                        <Input
                            id="time"
                            name="time"
                            type="time"
                            label="Hora"
                            value={formData.time}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div>
                    <label
                        htmlFor="service"
                        className="block text-sm font-medium mb-2 text-secondary-700 dark:text-secondary-300"
                    >
                        Servicio
                    </label>
                    <select
                        id="service"
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        className="input-field"
                        required
                    >
                        <option value="">Seleccionar servicio...</option>
                        <option value="basic">Lavado Básico</option>
                        <option value="complete">Lavado Completo</option>
                        <option value="premium">Detailing Premium</option>
                        <option value="ceramic">Tratamiento Cerámico</option>
                    </select>
                </div>

                <div className="flex gap-3 pt-4">
                    <Button type="submit" variant="primary" className="flex-1">
                        Confirmar Reserva
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setFormData({
                            name: '', email: '', phone: '', vehicle: '', date: '', time: '', service: ''
                        })}
                    >
                        Limpiar
                    </Button>
                </div>
            </form>
        </Card>
    );
};
