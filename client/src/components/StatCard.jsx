import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ icon, label, value, subtext, progress, color = 'primary', theme = 'dark' }) => {
    // Get theme from localStorage if not provided
    const currentTheme = theme || localStorage.getItem('userTheme') || 'dark';
    const isLight = currentTheme === 'light';

    // Determine progress level for icon selection
    const getProgressIcon = () => {
        if (progress >= 70) return 'trending-up';
        if (progress >= 40) return 'trending-neutral';
        return 'trending-down';
    };

    // Get color type based on progress
    const getProgressColorType = () => {
        if (progress >= 70) return color;
        if (progress >= 40) return 'warning';
        return 'danger';
    };

    const progressColorType = progress !== undefined ? getProgressColorType() : color;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className={`stat-card ${isLight ? 'stat-card-light' : 'stat-card-dark'}`}
        >
            {/* Background accent */}
            <div className={`background-accent background-accent-${color}-${isLight ? 'light' : 'dark'}`} />

            <div className="card-content">
                <div>
                    <div className={`icon-container icon-container-${color}-${isLight ? 'light' : 'dark'}`}>
                        <i className={`${icon} card-icon icon-${color}-${isLight ? 'light' : 'dark'}`}></i>
                    </div>
                    <p className={`card-label ${isLight ? 'label-light' : 'label-dark'}`}>
                        {label}
                    </p>
                    <h2 className={`card-value ${isLight ? 'value-light' : 'value-dark'}`}>
                        {value}
                    </h2>
                </div>

                {progress !== undefined && (
                    <div className="text-right">
                        <div className={`progress-badge badge-${progressColorType}-${isLight ? 'light' : 'dark'}`}>
                            <i className={`ri-${getProgressIcon()}-line badge-icon`}></i>
                            {progress}%
                        </div>
                    </div>
                )}
            </div>

            {progress !== undefined && (
                <div className="progress-container">
                    <div className="progress-header">
                        <span className={`progress-label ${isLight ? 'progress-label-light' : 'progress-label-dark'}`}>
                            Progress
                        </span>
                        <span className={`progress-value progress-value-${progressColorType}-${isLight ? 'light' : 'dark'}`}>
                            {progress}%
                        </span>
                    </div>
                    <div className={`progress-bar ${isLight ? 'progress-bar-light' : 'progress-bar-dark'}`}>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className={`progress-fill progress-fill-${progressColorType}-${isLight ? 'light' : 'dark'}`}
                        />
                    </div>
                </div>
            )}

            {subtext && (
                <p className={`card-subtext ${isLight ? 'subtext-light' : 'subtext-dark'}`}>
                    {subtext}
                </p>
            )}
        </motion.div>
    );
};

export default StatCard;