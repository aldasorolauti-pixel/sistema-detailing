import PropTypes from 'prop-types';
import { X } from 'lucide-react';

export const StepIndicator = ({ currentStep, steps }) => {
    return (
        <div className="bg-bg-navy border-b border-card-border sticky top-0 z-30">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-2">
                    <span className="text-[18px] font-bold text-white tracking-tight">
                        🚙 Detailing Pro
                    </span>
                </div>
                <button className="text-gray-400 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Subtitle */}
            <div className="px-6 pb-3">
                <p className="text-[13px] text-gray-400 font-medium">
                    Reservá tu turno
                </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-8 px-6 border-b border-card-border">
                {steps.slice(0, 3).map((step, index) => {
                    const stepNumber = index + 1;
                    const isActive = stepNumber === currentStep;
                    const isCompleted = stepNumber < currentStep;

                    return (
                        <button
                            key={step.id}
                            className={`
                pb-3 text-[14px] font-medium transition-colors relative
                ${isActive || isCompleted ? 'text-primary' : 'text-text-inactive'}
              `}
                        >
                            {step.name}
                            {isActive && (
                                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

StepIndicator.propTypes = {
    currentStep: PropTypes.number.isRequired,
    steps: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
        })
    ).isRequired,
};
