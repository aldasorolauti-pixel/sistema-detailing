import PropTypes from 'prop-types';
import { Car, Truck, Bus, TruckIcon } from 'lucide-react';
import { VEHICLES } from '../../lib/constants';

const vehicleIcons = {
    citycar: Car,
    sedan: Car,
    suv: Bus,
    pickup: TruckIcon,
};

export const VehicleSelector = ({ selectedVehicle, onSelect }) => {
    return (
        <>
            {/* Title */}
            <div className="px-6 pt-6 pb-4">
                <h2 className="text-white text-[18px] font-semibold">
                    1. Seleccioná tu vehículo
                </h2>
            </div>

            {/* Vehicle grid */}
            <main className="flex-1 overflow-y-auto px-6 pb-8">
                <div className="grid grid-cols-2 gap-3">
                    {VEHICLES.map((vehicle) => {
                        const isSelected = selectedVehicle?.id === vehicle.id;
                        const Icon = vehicleIcons[vehicle.id];

                        return (
                            <label
                                key={vehicle.id}
                                className={`
                  relative flex flex-col items-center justify-center p-5
                  rounded-lg border-2 cursor-pointer transition-all duration-200
                  h-[140px] bg-card-bg
                  ${isSelected
                                        ? 'border-primary'
                                        : 'border-card-border hover:border-gray-600'
                                    }
                `}
                            >
                                <input
                                    type="radio"
                                    name="vehicle"
                                    value={vehicle.id}
                                    checked={isSelected}
                                    onChange={() => onSelect(vehicle)}
                                    className="sr-only"
                                />

                                {/* Content */}
                                <div className="flex flex-col items-center gap-2 text-center">
                                    {/* Icon */}
                                    <div className="text-gray-400">
                                        <Icon className="w-10 h-10" strokeWidth={1.5} />
                                    </div>

                                    {/* Vehicle name */}
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-white font-semibold text-[15px]">
                                            {vehicle.name}
                                        </span>
                                        <span className="text-gray-500 text-[12px]">
                                            x{vehicle.multiplier.toFixed(1)}
                                        </span>
                                    </div>
                                </div>
                            </label>
                        );
                    })}
                </div>
            </main>
        </>
    );
};

VehicleSelector.propTypes = {
    selectedVehicle: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        multiplier: PropTypes.number.isRequired,
    }),
    onSelect: PropTypes.func.isRequired,
};
