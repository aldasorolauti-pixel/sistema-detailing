import { useBooking } from '../../context/useBooking';
import { StepIndicator } from './StepIndicator';
import { VehicleSelector } from './VehicleSelector';
import { WIZARD_STEPS } from '../../lib/constants';

export const BookingWizard = () => {
    const {
        currentStep,
        vehicle,
        services,
        dateTime,
        customer,
        setCurrentStep,
        setVehicle,
    } = useBooking();

    const canGoNext = () => {
        switch (currentStep) {
            case 1:
                return vehicle !== null;
            case 2:
                return services.length > 0;
            case 3:
                return dateTime.date !== null && dateTime.timeSlot !== null;
            default:
                return false;
        }
    };

    const handleNext = () => {
        if (canGoNext() && currentStep < 5) {
            setCurrentStep(currentStep + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <VehicleSelector
                        selectedVehicle={vehicle}
                        onSelect={setVehicle}
                    />
                );
            case 2:
                return (
                    <div className="p-8 text-center text-gray-400">
                        Paso 2: Selección de Servicios (próximamente)
                    </div>
                );
            case 3:
                return (
                    <div className="p-8 text-center text-gray-400">
                        Paso 3: Fecha y Hora (próximamente)
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center p-4">
            {/* Widget container */}
            <div className="w-full max-w-[440px] h-[700px] bg-bg-navy rounded-xl shadow-2xl overflow-hidden flex flex-col border border-gray-800">
                {/* Step Indicator */}
                <StepIndicator
                    currentStep={currentStep}
                    steps={WIZARD_STEPS}
                />

                {/* Step Content */}
                <div className="flex-1 overflow-y-auto">
                    {renderStep()}
                </div>

                {/* Navigation Buttons */}
                <div className="border-t border-card-border p-4 bg-bg-navy">
                    <div className="flex gap-3">
                        {currentStep > 1 && (
                            <button
                                onClick={handleBack}
                                className="flex-1 px-4 py-2.5 rounded-lg border border-card-border text-white hover:bg-card-bg transition-all duration-200 font-medium text-[14px]"
                            >
                                Atrás
                            </button>
                        )}

                        <button
                            onClick={handleNext}
                            disabled={!canGoNext()}
                            className={`
                flex-1 px-4 py-2.5 rounded-lg font-medium text-[14px] transition-all duration-200
                ${canGoNext()
                                    ? 'bg-primary text-gray-900 hover:bg-primary/90'
                                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                }
              `}
                        >
                            Continuar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
