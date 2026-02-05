import React from 'react';
import { motion } from 'framer-motion';

const StatsSummaryCard = ({ habits, theme }) => {
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
        },
        dark: {
            cardBg: 'bg-[#2E3944]/80 backdrop-blur-sm',
            cardBorder: 'border-[#748D92]/20',
            primaryText: 'text-[#D3D9D4]',
            secondaryText: 'text-[#748D92]',
            iconBg: 'bg-gradient-to-r from-[#124E66] to-[#748D92]',
            iconColor: 'text-[#D3D9D4]',
            innerCardBg: 'bg-gradient-to-r from-[#212A31] to-[#2E3944]',
        }
    };

    const colors = themeConfig[theme];

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
            className={`${colors.cardBg} rounded-2xl mb-[100px] p-6 border ${colors.cardBorder} shadow-lg`}
        >
            <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-full ${colors.iconBg} flex items-center justify-center`}>
                    <i className={`ri-bar-chart-fill text-xl ${colors.iconColor}`}></i>
                </div>
                <div>
                    <h3 className={`font-['Merriweather'] text-[18px] font-bold ${colors.primaryText}`}>
                        Your Growth
                    </h3>
                    <p className={`font-['Source_Sans_Pro'] ${colors.secondaryText} text-xs mt-1`}>
                        Track your progress
                    </p>
                </div>
            </div>

            <div className="space-y-3">
                {/* Total Completed */}
                <div className={`flex items-center justify-between p-3 rounded-lg ${colors.innerCardBg} border ${colors.cardBorder}`}>
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full ${colors.iconBg} flex items-center justify-center`}>
                            <i className={`ri-check-double-line text-sm ${colors.iconColor}`}></i>
                        </div>
                        <div>
                            <span className={`font-['Source_Sans_Pro'] ${colors.secondaryText} text-sm block`}>Total Completed</span>
                            <span className={`font-['Source_Sans_Pro'] ${colors.secondaryText}/60 text-xs`}>All habits combined</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className={`font-['Montserrat'] font-bold text-lg ${colors.primaryText} block`}>
                            {totalCompleted}
                        </span>
                    </div>
                </div>

                {/* Active Streaks */}
                <div className={`flex items-center justify-between p-3 rounded-lg ${colors.innerCardBg} border ${colors.cardBorder}`}>
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full ${colors.iconBg} flex items-center justify-center`}>
                            <i className={`ri-fire-fill text-sm ${colors.iconColor}`}></i>
                        </div>
                        <div>
                            <span className={`font-['Source_Sans_Pro'] ${colors.secondaryText} text-sm block`}>Active Streaks</span>
                            <span className={`font-['Source_Sans_Pro'] ${colors.secondaryText}/60 text-xs`}>Streaks over 3 days</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className={`font-['Montserrat'] font-bold text-lg ${colors.primaryText} block`}>
                            {activeStreaks}
                        </span>
                    </div>
                </div>

                {/* Growing Habits */}
                <div className={`flex items-center justify-between p-3 rounded-lg ${colors.innerCardBg} border ${colors.cardBorder}`}>
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full ${colors.iconBg} flex items-center justify-center`}>
                            <i className={`ri-leaf-fill text-sm ${colors.iconColor}`}></i>
                        </div>
                        <div>
                            <span className={`font-['Source_Sans_Pro'] ${colors.secondaryText} text-sm block`}>Growing Habits</span>
                            <span className={`font-['Source_Sans_Pro'] ${colors.secondaryText}/60 text-xs`}>Starting streaks</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className={`font-['Montserrat'] font-bold text-lg ${colors.primaryText} block`}>
                            {growingHabits}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default StatsSummaryCard;