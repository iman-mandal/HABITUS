import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PieChart } from '@mui/x-charts/PieChart';

const HabitDistributionCard = ({ habits, theme, timeRange, user }) => {
    const [pieData, setPieData] = useState([]);

    // Get theme from localStorage if not provided
    const currentTheme = theme || localStorage.getItem('userTheme') || 'dark';
    const isLight = currentTheme === 'light';

    // Set pie colors based on theme
    const pieColors = isLight
        ? ['#89A8B2', '#B3C8CF', '#5A6D74', '#F1F0E8', '#E5E1DA']
        : ['#124E66', '#748D92', '#2E3944', '#D3D9D4', '#212A31'];

    // Set CSS variables for legend hover
    useEffect(() => {
        if (isLight) {
            document.documentElement.style.setProperty('--legend-hover-border', 'rgba(179, 200, 207, 0.4)');
        } else {
            document.documentElement.style.setProperty('--legend-hover-border', 'rgba(116, 141, 146, 0.4)');
        }
    }, [isLight]);

    // Function to get date range for different time periods
    const getDateRange = (range) => {
        const now = new Date();

        switch (range) {
            case 'overall':
                return getAllTimeRange();
            case 'week':
                return getWeeklyRange();
            case 'month':
                return getMonthlyRange();
            case 'quarter':
                return getQuarterlyRange();
            case 'year':
                return getYearlyRange();
            default:
                return { startDate: now, endDate: now };
        }
    };

    // Helper functions for each range
    const getAllTimeRange = () => {
        const now = new Date();

        // Try to get user's createdAt date
        let startDate;

        if (user?.createdAt) {
            // If createdAt exists, use it
            if (typeof user.createdAt === 'string') {
                startDate = new Date(user.createdAt);
            } else if (user.createdAt instanceof Date) {
                startDate = new Date(user.createdAt);
            } else if (user.createdAt?.seconds) {
                // Handle Firebase timestamp
                startDate = new Date(user.createdAt.seconds * 1000);
            } else {
                // Default to account creation date (30 days ago)
                startDate = new Date(now);
                startDate.setDate(now.getDate() - 30);
            }
        } else {
            // Default to 30 days ago if no createdAt
            startDate = new Date(now);
            startDate.setDate(now.getDate() - 30);
        }

        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(now);
        endDate.setHours(23, 59, 59, 999);

        return { startDate, endDate };
    };

    const getWeeklyRange = () => {
        const now = new Date();
        const day = now.getDay();
        const diffToMonday = day === 0 ? -6 : 1 - day;
        const startDate = new Date(now);
        startDate.setDate(now.getDate() + diffToMonday);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);

        return { startDate, endDate };
    };

    const getMonthlyRange = () => {
        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        endDate.setHours(23, 59, 59, 999);

        return { startDate, endDate };
    };

    const getQuarterlyRange = () => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const quarter = Math.floor(currentMonth / 3);
        const startDate = new Date(now.getFullYear(), quarter * 3, 1);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(now.getFullYear(), (quarter * 3) + 3, 0);
        endDate.setHours(23, 59, 59, 999);

        return { startDate, endDate };
    };

    const getYearlyRange = () => {
        const now = new Date();
        const startDate = new Date(now.getFullYear(), 0, 1);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(now.getFullYear(), 11, 31);
        endDate.setHours(23, 59, 59, 999);

        return { startDate, endDate };
    };

    // Get formatted date range text
    const getDateRangeText = (range) => {
        const { startDate, endDate } = getDateRange(range);

        const formatDate = (date) => {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
            });
        };

        return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    };

    // Calculate pie data based on time range
    const calculatePieData = (range) => {
        if (!habits || habits.length === 0) return [];

        const { startDate, endDate } = getDateRange(range);

        // Calculate total completed within date range
        const totalCompleted = habits.reduce((acc, habit) => {
            const completedInRange = habit.history?.filter(h => {
                const habitDate = new Date(h.date);
                return h.completed && habitDate >= startDate && habitDate <= endDate;
            }).length || 0;
            return acc + completedInRange;
        }, 0);

        // Map habits with their completion percentage
        return habits
            .map((habit, index) => {
                const completedInRange = habit.history?.filter(h => {
                    const habitDate = new Date(h.date);
                    return h.completed && habitDate >= startDate && habitDate <= endDate;
                }).length || 0;

                const percentageOfTotal = totalCompleted === 0 ? 0 : (completedInRange / totalCompleted) * 100;

                return {
                    id: index,
                    label: habit.title,
                    value: Math.round(percentageOfTotal),
                    completed: completedInRange,
                    color: pieColors[index % pieColors.length],
                };
            })
            .filter(item => item.value > 0); // Only show habits with data
    };

    // Update pie data when timeRange prop changes
    useEffect(() => {
        if (timeRange) {
            const data = calculatePieData(timeRange);
            setPieData(data);
        }
    }, [timeRange, habits, isLight]);

    // Get display label for time range
    const getTimeRangeLabel = () => {
        switch (timeRange) {
            case 'overall':
                return 'Overall';
            case 'week':
                return 'Weekly';
            case 'month':
                return 'Monthly';
            case 'quarter':
                return 'Quarterly';
            case 'year':
                return 'Yearly';
            default:
                return 'Weekly';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className={`habit-distribution-card ${isLight ? 'habit-distribution-card-light' : 'habit-distribution-card-dark'}`}
        >
            {/* Header with time range info */}
            <div className="card-header">
                <div className="header-left">
                    <div className={`icon-container ${isLight ? 'icon-container-light' : 'icon-container-dark'}`}>
                        <i className={`ri-pie-chart-2-fill icon ${isLight ? 'icon-light' : 'icon-dark'}`}></i>
                    </div>
                    <div>
                        <h3 className={`card-title ${isLight ? 'card-title-light' : 'card-title-dark'}`}>
                            Habit Distribution
                        </h3>
                        <div className="time-range-info">
                            <span className={`time-range-badge ${isLight ? 'time-range-badge-light' : 'time-range-badge-dark'}`}>
                                {getTimeRangeLabel()}
                            </span>
                            <p className={`time-range-text ${isLight ? 'time-range-text-light' : 'time-range-text-dark'}`}>
                                {getDateRangeText(timeRange || 'week')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {habits.length > 0 ? (
                <div className="content-container">
                    {/* Pie Chart - Show only if there's data */}
                    {pieData.length > 0 ? (
                        <>
                            <div className="chart-container">
                                <PieChart
                                    series={[
                                        {
                                            data: pieData,
                                            highlightScope: { fade: 'global', highlight: 'item' },
                                            faded: { innerRadius: 50, additionalRadius: -50, color: 'gray' },
                                            formatter: ({ value }) => `${value}%`,
                                        },
                                    ]}
                                    height={250}
                                    width={250}
                                    className="pie-chart-legend-hidden"
                                    sx={{
                                        '& .MuiChartsLegend-label': { fontSize: '16px' },
                                    }}
                                />
                            </div>

                            {/* Custom Compact Legend */}
                            <div className="legend-container">
                                <div className="legend-grid">
                                    {pieData.map((item, index) => (
                                        <div
                                            key={index}
                                            className={`legend-item ${isLight ? 'legend-item-light' : 'legend-item-dark'}`}
                                        >
                                            <div
                                                className="color-indicator"
                                                style={{ backgroundColor: item.color }}
                                            />
                                            <div className="legend-content">
                                                <span className={`legend-label ${isLight ? 'legend-label-light' : 'legend-label-dark'}`}>
                                                    {item.label}
                                                </span>
                                                <div className="legend-stats">
                                                    <span className={`legend-completed ${isLight ? 'legend-completed-light' : 'legend-completed-dark'}`}>
                                                        {item.completed} completed
                                                    </span>
                                                    <span className={`legend-percentage ${isLight ? 'legend-percentage-light' : 'legend-percentage-dark'}`}>
                                                        {item.value}%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="no-data-container">
                            <div className={`no-data-icon-container ${isLight ? 'no-data-icon-container-light' : 'no-data-icon-container-dark'}`}>
                                <i className={`ri-line-chart-line no-data-icon ${isLight ? 'no-data-icon-light' : 'no-data-icon-dark'}`}></i>
                            </div>
                            <p className={`no-data-text ${isLight ? 'no-data-text-light' : 'no-data-text-dark'}`}>
                                No data available for {getTimeRangeLabel().toLowerCase()} period
                            </p>
                            <p className={`no-data-subtext ${isLight ? 'no-data-subtext-light' : 'no-data-subtext-dark'}`}>
                                Complete habits to see your distribution
                            </p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="empty-habits-container">
                    <div className={`empty-habits-icon-container ${isLight ? 'empty-habits-icon-container-light' : 'empty-habits-icon-container-dark'}`}>
                        <i className={`ri-leaf-line empty-habits-icon ${isLight ? 'empty-habits-icon-light' : 'empty-habits-icon-dark'}`}></i>
                    </div>
                    <p className={`empty-habits-text ${isLight ? 'empty-habits-text-light' : 'empty-habits-text-dark'}`}>
                        Start adding habits to see your progress chart!
                    </p>
                </div>
            )}
        </motion.div>
    );
};

export default HabitDistributionCard;