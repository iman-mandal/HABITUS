import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PieChart } from '@mui/x-charts/PieChart';

const HabitDistributionCard = ({ habits, theme, timeRange, user }) => {
    // Theme configuration
    const themeConfig = {
        light: {
            cardBg: 'bg-white/90 backdrop-blur-sm',
            cardBorder: 'border-[#B3C8CF]/50',
            primaryText: 'text-[#2E3944]',
            secondaryText: 'text-[#5A6D74]',
            iconBg: 'bg-gradient-to-r from-[#89A8B2] to-[#B3C8CF]',
            iconColor: 'text-[#2E3944]',
            innerCardBg: 'bg-gradient-to-r from-[#F1F0E8] to-[#E5E1DA]',
            pieColors: ['#89A8B2', '#B3C8CF', '#5A6D74', '#F1F0E8', '#E5E1DA'],
            timeRangeActive: 'bg-gradient-to-r from-[#89A8B2] to-[#B3C8CF]',
            timeRangeInactive: 'bg-white/80',
            timeRangeTextActive: 'text-white',
            timeRangeTextInactive: 'text-[#5A6D74]',
        },
        dark: {
            cardBg: 'bg-[#2E3944]/80 backdrop-blur-sm',
            cardBorder: 'border-[#748D92]/20',
            primaryText: 'text-[#D3D9D4]',
            secondaryText: 'text-[#748D92]',
            iconBg: 'bg-gradient-to-r from-[#124E66] to-[#748D92]',
            iconColor: 'text-[#D3D9D4]',
            innerCardBg: 'bg-gradient-to-r from-[#212A31] to-[#2E3944]',
            pieColors: ['#124E66', '#748D92', '#2E3944', '#D3D9D4', '#212A31'],
            timeRangeActive: 'bg-gradient-to-r from-[#124E66] to-[#748D92]',
            timeRangeInactive: 'bg-[#212A31]/80',
            timeRangeTextActive: 'text-[#D3D9D4]',
            timeRangeTextInactive: 'text-[#748D92]',
        }
    };
    const colors = themeConfig[theme];

    // REMOVED the internal state for activeTimeRange
    // Instead, use the timeRange prop directly

    const [pieData, setPieData] = useState([]);

    // Function to get date range for different time periods
    const getDateRange = (range) => {
        const now = new Date();

        switch (range) {
            case 'overall':
                // For overall, return the earliest date to today
                return getAllTimeRange();
            case 'week':  // Changed from 'weekly' to match Analytics component
                return getWeeklyRange();
            case 'month': // Changed from 'monthly' to match Analytics component
                return getMonthlyRange();
            case 'quarter': // Changed from 'quarterly' to match Analytics component
                return getQuarterlyRange();
            case 'year': // Changed from 'yearly' to match Analytics component
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
                    color: colors.pieColors[index % colors.pieColors.length],
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
    }, [timeRange, habits, theme]);

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
            className={`${colors.cardBg} rounded-2xl w-full p-6 border ${colors.cardBorder} shadow-lg`}
        >
            {/* Header with time range info */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${colors.iconBg} flex items-center justify-center`}>
                        <i className={`ri-pie-chart-2-fill text-xl ${colors.iconColor}`}></i>
                    </div>
                    <div>
                        <h3 className={`font-['Merriweather'] text-[18px] font-bold ${colors.primaryText}`}>
                            Habit Distribution
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-['Source_Sans_Pro'] font-medium ${colors.timeRangeActive} ${colors.timeRangeTextActive}`}>
                                {getTimeRangeLabel()}
                            </span>
                            <p className={`font-['Source_Sans_Pro'] ${colors.secondaryText} text-xs`}>
                                {getDateRangeText(timeRange || 'week')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {habits.length > 0 ? (
                <div className="relative min-h-[260px] flex flex-col items-center">
                    {/* Pie Chart - Show only if there's data */}
                    {pieData.length > 0 ? (
                        <>
                            <div className="h-[220px] w-full -mt-2">
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
                                    sx={{
                                        '& .MuiChartsLegend-root': { display: 'none' },
                                        '& .MuiChartsLegend-label': { fontSize: '16px' },
                                    }}
                                />
                            </div>

                            {/* Custom Compact Legend */}
                            <div className="mt-10 w-full">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {pieData.map((item, index) => (
                                        <div
                                            key={index}
                                            className={`flex items-center gap-2 p-2 rounded-lg ${colors.innerCardBg} border ${colors.cardBorder} hover:border-[#748D92]/40 transition`}
                                        >
                                            <div
                                                className="w-3 h-3 rounded-full flex-shrink-0"
                                                style={{ backgroundColor: item.color }}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <span className={`font-['Source_Sans_Pro'] text-xs ${colors.primaryText} truncate`}>
                                                    {item.label}
                                                </span>
                                                <div className="flex justify-between items-center mt-0.5">
                                                    <span className={`font-['Source_Sans_Pro'] text-xs ${colors.secondaryText}`}>
                                                        {item.completed} completed
                                                    </span>
                                                    <span className={`font-['Source_Sans_Pro'] text-xs ${colors.primaryText} font-semibold`}>
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
                        <div className="flex flex-col items-center justify-center py-10">
                            <div className={`w-16 h-16 rounded-full ${colors.innerCardBg} flex items-center justify-center mb-4`}>
                                <i className={`ri-line-chart-line text-2xl ${colors.secondaryText}`}></i>
                            </div>
                            <p className={`font-['Source_Sans_Pro'] ${colors.secondaryText} text-center max-w-xs`}>
                                No data available for {getTimeRangeLabel().toLowerCase()} period
                            </p>
                            <p className={`font-['Source_Sans_Pro'] ${colors.secondaryText} text-xs text-center mt-2`}>
                                Complete habits to see your distribution
                            </p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-10">
                    <div className={`w-20 h-20 rounded-full ${colors.innerCardBg} flex items-center justify-center mb-4`}>
                        <i className={`ri-leaf-line text-3xl ${colors.secondaryText}`}></i>
                    </div>
                    <p className={`font-['Source_Sans_Pro'] ${colors.secondaryText} text-center`}>
                        Start adding habits to see your progress chart!
                    </p>
                </div>
            )}
        </motion.div>
    );
};

export default HabitDistributionCard;

