import PropTypes from 'prop-types';

export const Input = ({
    label,
    error,
    className = '',
    id,
    type = 'text',
    ...props
}) => {
    return (
        <div className={`mb-4 ${className}`}>
            {label && (
                <label
                    htmlFor={id}
                    className="block text-sm font-medium mb-2 text-secondary-700 dark:text-secondary-300"
                >
                    {label}
                </label>
            )}
            <input
                id={id}
                type={type}
                className={`input-field ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
        </div>
    );
};

Input.propTypes = {
    label: PropTypes.string,
    error: PropTypes.string,
    className: PropTypes.string,
    id: PropTypes.string,
    type: PropTypes.string,
};
