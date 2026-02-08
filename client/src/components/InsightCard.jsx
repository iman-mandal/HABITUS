import React from 'react';
import { motion } from 'framer-motion';

const InsightCard = ({ icon, title, description, color = 'blue', theme = 'dark' }) => {
    // Get theme from localStorage if not provided
    const currentTheme = theme || localStorage.getItem('userTheme') || 'dark';
    const isLight = currentTheme === 'light';

    // Get color styles based on color prop
    const getColorClass = (type, color) => {
        switch (color) {
            case 'green':
                return type === 'icon' ? 'icon-container-green' : 'decorative-corner-green';
            case 'blue':
                return type === 'icon' ? 'icon-container-blue' : 'decorative-corner-blue';
            case 'purple':
                return type === 'icon' ? 'icon-container-purple' : 'decorative-corner-purple';
            case 'orange':
                return type === 'icon' ? 'icon-container-orange' : 'decorative-corner-orange';
            default:
                return type === 'icon' ? 'icon-container-blue' : 'decorative-corner-blue';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -3 }}
            className={`insight-card ${isLight ? 'insight-card-light' : 'insight-card-dark'}`}
        >
            {/* Decorative corner */}
            <div className={`decorative-corner ${getColorClass('decorative', color)}`} />

            <div className="card-content">
                <div className={`icon-container ${getColorClass('icon', color)}`}>
                    <i className={`${icon} icon ${isLight ? 'icon-light' : 'icon-dark'}`}></i>
                </div>

                <div className="text-content">
                    <h4 className={`card-title ${isLight ? 'card-title-light' : 'card-title-dark'}`}>
                        {title}
                    </h4>
                    <p className={`card-description ${isLight ? 'card-description-light' : 'card-description-dark'}`}>
                        {description}
                    </p>
                </div>

                {/* Arrow indicator */}
                <div className="arrow-indicator arrow-bounce">
                    <i className={`ri-arrow-right-up-line ${isLight ? 'arrow-indicator-light' : 'arrow-indicator-dark'}`}></i>
                </div>
            </div>
        </motion.div>
    );
};

export default InsightCard;