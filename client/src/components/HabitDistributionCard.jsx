import React from 'react';
import { motion } from 'framer-motion';
import { PieChart } from '@mui/x-charts/PieChart';

const HabitDistributionCard = ({ habits, theme, timeRange }) => {
    // Theme configuration (same as in Home component)
    const themeConfig = {
        light: {
            cardBg: 'bg-white/90 backdrop-blur-sm',
            cardBorder: 'border-[#B3C8CF]/50',
            primaryText: 'text-[#2E3944]',
            secondaryText: 'text-[#5A6D74]',
            iconBg: 'bg-gradient-to-r from-[#89A8B2] to-[#B3C8CF]',
            iconColor: 'text-[#2E3944]',
            innerCardBg: 'bg-gradient-to-r from-[#F1F0E8] to-[#E5E1DA]',
            pieColors: [
                '#89A8B2', '#B3C8CF', '#5A6D74', '#F1F0E8', '#E5E1DA',
            ],
        },
        dark: {
            cardBg: 'bg-[#2E3944]/80 backdrop-blur-sm',
            cardBorder: 'border-[#748D92]/20',
            primaryText: 'text-[#D3D9D4]',
            secondaryText: 'text-[#748D92]',
            iconBg: 'bg-gradient-to-r from-[#124E66] to-[#748D92]',
            iconColor: 'text-[#D3D9D4]',
            innerCardBg: 'bg-gradient-to-r from-[#212A31] to-[#2E3944]',
            pieColors: [
                '#124E66', '#748D92', '#2E3944', '#D3D9D4', '#212A31',
            ],
        }
    };

    const colors = themeConfig[theme];

    // Get overall Pie chart Data with theme colors
    const getOverallPieData = (habits) => {
        if (!habits || habits.length === 0) return [];

        const totalCompleted = habits.reduce((acc, habit) => {
            const completed = habit.history?.filter(h => h.completed).length || 0;
            return acc + completed;
        }, 0);

        return habits.map((habit, index) => {
            const completed = habit.history?.filter(h => h.completed).length || 0;
            const percentageOfTotal = totalCompleted === 0 ? 0 : (completed / totalCompleted) * 100;

            return {
                id: index,
                label: habit.title,
                value: Math.round(percentageOfTotal),
                completed,
                color: colors.pieColors[index % colors.pieColors.length],
            };
        });
    };

    const pieData = getOverallPieData(habits);

    const getCurrentWeekRange = () => {
        const now = new Date();
        const day = now.getDay(); // 0 = Sun, 1 = Mon
        const diffToMonday = day === 0 ? -6 : 1 - day;

        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() + diffToMonday);
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        return { startOfWeek, endOfWeek };
    };

    const getWeeklyPieData = (habits) => {
        if (!habits || habits.length === 0) return [];

        const { startOfWeek, endOfWeek } = getCurrentWeekRange();

        const totalCompleted = habits.reduce((acc, habit) => {
            const weeklyCompleted =
                habit.history?.filter(h => {
                    const date = new Date(h.date);
                    return h.completed && date >= startOfWeek && date <= endOfWeek;
                }).length || 0;

            return acc + weeklyCompleted;
        }, 0);

        return habits.map((habit, index) => {
            const weeklyCompleted =
                habit.history?.filter(h => {
                    const date = new Date(h.date);
                    return h.completed && date >= startOfWeek && date <= endOfWeek;
                }).length || 0;

            const percentageOfTotal =
                totalCompleted === 0 ? 0 : (weeklyCompleted / totalCompleted) * 100;

            return {
                id: index,
                label: habit.title,
                value: Math.round(percentageOfTotal),
                completed: weeklyCompleted,
                color: colors.pieColors[index % colors.pieColors.length],
            };
        });
    };

    

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className={`${colors.cardBg} rounded-2xl w-full p-6 border ${colors.cardBorder} shadow-lg`}
        >
            <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-full ${colors.iconBg} flex items-center justify-center`}>
                    <i className={`ri-pie-chart-2-fill text-xl ${colors.iconColor}`}></i>
                </div>
                <div>
                    <h3 className={`font-['Merriweather'] text-[18px] font-bold ${colors.primaryText}`}>
                        Habit Distribution
                    </h3>
                    <p className={`font-['Source_Sans_Pro'] ${colors.secondaryText} text-xs mt-1`}>
                        By completion status
                    </p>
                </div>
            </div>

            {habits.length > 0 ? (
                <div className="relative min-h-[260px] flex flex-col items-center">
                    {/* Pie Chart */}
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
                                '& .MuiChartsLegend-root': {
                                    display: 'none',
                                },
                                '& .MuiChartsLegend-label': {
                                    fontSize: '16px',
                                },
                            }}
                        />
                    </div>

                    {/* Custom Compact Legend */}
                    <div className="mt-10 w-full">
                        <div className="grid grid-cols-2 gap-2">
                            {pieData.map((item, index) => (
                                <div
                                    key={index}
                                    className={`flex items-center gap-2 p-2 rounded-lg ${colors.innerCardBg} border ${colors.cardBorder} hover:border-[#748D92]/40 transition`}
                                >
                                    <div
                                        className="w-3 h-3 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: item.color }} />
                                    <div className="flex-1 flex flex-row min-w-0">
                                        <span className={`font-['Source_Sans_Pro'] text-xs ${colors.primaryText} truncate block`}>
                                            {item.label}
                                        </span>
                                        <span className={`font-['Source_Sans_Pro'] text-xs ${colors.secondaryText}`}>
                                            : {item.value}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
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