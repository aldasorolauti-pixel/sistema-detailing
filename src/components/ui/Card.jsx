import PropTypes from 'prop-types';

export const Card = ({ children, className = '', title, ...props }) => {
    return (
        <div className={`card ${className}`} {...props}>
            {title && (
                <h3 className="text-xl font-bold mb-4 text-secondary-900 dark:text-white">
                    {title}
                </h3>
            )}
            {children}
        </div>
    );
};

Card.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    title: PropTypes.string,
};
