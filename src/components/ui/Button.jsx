import PropTypes from 'prop-types';

export const Button = ({
    children,
    variant = 'primary',
    className = '',
    onClick,
    type = 'button',
    disabled = false,
    ...props
}) => {
    const baseClasses = 'font-semibold py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-primary hover:bg-primary-600 text-white shadow-md hover:shadow-lg',
        secondary: 'bg-secondary hover:bg-secondary-700 text-white shadow-md hover:shadow-lg',
        outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
        ghost: 'text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-800',
    };

    return (
        <button
            type={type}
            className={`${baseClasses} ${variants[variant]} ${className}`}
            onClick={onClick}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
};

Button.propTypes = {
    children: PropTypes.node.isRequired,
    variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost']),
    className: PropTypes.string,
    onClick: PropTypes.func,
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
    disabled: PropTypes.bool,
};
