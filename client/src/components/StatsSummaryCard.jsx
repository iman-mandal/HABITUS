import React from 'react';
import { motion } from 'framer-motion';

const StatsSummaryCard = ({ habits, theme }) => {
    // Get theme from localStorage if not provided
    const currentTheme = theme || localStorage.getItem('userTheme') || 'dark';
    const isLight = currentTheme === 'light';

    // Calculate stats
    const totalCompleted = habits.reduce((acc, habit) =>
        acc + (habit.history?.filter(h => h.completed).length || 0), 0);

    const activeStreaks = habits.filter(h => h.streak > 3).length;
    const growingHabits = habits.filter(h => h.streak > 0 && h.streak <= 3).length;

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className={`stats-summary-card ${isLight ? 'stats-summary-card-light' : 'stats-summary-card-dark'}`}
        >
            <div className="summary-card-header">
                <div className={`header-icon-container ${isLight ? 'header-icon-container-light' : 'header-icon-container-dark'}`}>
                    <i className={`ri-bar-chart-fill header-icon ${isLight ? 'header-icon-light' : 'header-icon-dark'}`}></i>
                </div>
                <div className="header-title-section">
                    <h3 className={`header-title ${isLight ? 'header-title-light' : 'header-title-dark'}`}>
                        Your Growth
                    </h3>
                    <p className={`header-subtitle ${isLight ? 'header-subtitle-light' : 'header-subtitle-dark'}`}>
                        Track your progress
                    </p>
                </div>
            </div>

            <div className="stats-list">
                {/* Total Completed */}
                <div className={`stat-item ${isLight ? 'stat-item-light' : 'stat-item-dark'}`}>
                    <div className="stat-left">
                        <div className={`stat-icon-container ${isLight ? 'stat-icon-container-light' : 'stat-icon-container-dark'}`}>
                            <i className={`ri-check-double-line stat-icon ${isLight ? 'stat-icon-light' : 'stat-icon-dark'}`}></i>
                        </div>
                        <div className="stat-info">
                            <span className={`stat-label ${isLight ? 'stat-label-light' : 'stat-label-dark'}`}>
                                Total Completed
                            </span>
                            <span className={`stat-description ${isLight ? 'stat-description-light' : 'stat-description-dark'}`}>
                                All habits combined
                            </span>
                        </div>
                    </div>
                    <div className="stat-value">
                        <span className={`stat-value-number ${isLight ? 'stat-value-number-light' : 'stat-value-number-dark'}`}>
                            {totalCompleted}
                        </span>
                    </div>
                </div>

                {/* Active Streaks */}
                <div className={`stat-item ${isLight ? 'stat-item-light' : 'stat-item-dark'}`}>
                    <div className="stat-left">
                        <div className={`stat-icon-container ${isLight ? 'stat-icon-container-light' : 'stat-icon-container-dark'}`}>
                            <i className={`ri-fire-fill stat-icon ${isLight ? 'stat-icon-light' : 'stat-icon-dark'}`}></i>
                        </div>
                        <div className="stat-info">
                            <span className={`stat-label ${isLight ? 'stat-label-light' : 'stat-label-dark'}`}>
                                Active Streaks
                            </span>
                            <span className={`stat-description ${isLight ? 'stat-description-light' : 'stat-description-dark'}`}>
                                Streaks over 3 days
                            </span>
                        </div>
                    </div>
                    <div className="stat-value">
                        <span className={`stat-value-number ${isLight ? 'stat-value-number-light' : 'stat-value-number-dark'}`}>
                            {activeStreaks}
                        </span>
                    </div>
                </div>

                {/* Growing Habits */}
                <div className={`stat-item ${isLight ? 'stat-item-light' : 'stat-item-dark'}`}>
                    <div className="stat-left">
                        <div className={`stat-icon-container ${isLight ? 'stat-icon-container-light' : 'stat-icon-container-dark'}`}>
                            <i className={`ri-leaf-fill stat-icon ${isLight ? 'stat-icon-light' : 'stat-icon-dark'}`}></i>
                        </div>
                        <div className="stat-info">
                            <span className={`stat-label ${isLight ? 'stat-label-light' : 'stat-label-dark'}`}>
                                Growing Habits
                            </span>
                            <span className={`stat-description ${isLight ? 'stat-description-light' : 'stat-description-dark'}`}>
                                Starting streaks
                            </span>
                        </div>
                    </div>
                    <div className="stat-value">
                        <span className={`stat-value-number ${isLight ? 'stat-value-number-light' : 'stat-value-number-dark'}`}>
                            {growingHabits}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default StatsSummaryCard;