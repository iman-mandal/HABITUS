import React from 'react';
import { motion } from 'framer-motion';

const EmptyStateCard = ({ theme = 'dark', onAddHabit }) => {
    const themeColors = {
        light: {
            cardGlow: "shadow-lg shadow-[#89A8B2]/10",
            cardBorder: "border-white/40",
            cardBg: "from-white/40 to-white/20",
            textPrimary: "#2E3944",
            textSecondary: "#5A6D77",
            buttonBg: "from-[#89A8B2] to-[#B3C8CF]",
            buttonText: "text-white"
        },
        dark: {
            cardGlow: "shadow-xl shadow-[#124E66]/15",
            cardBorder: "border-[#2E3944]/40",
            cardBg: "from-[#1A2832]/80 to-[#0F1A23]/80",
            textPrimary: "#E8F0F7",
            textSecondary: "#A3B8C8",
            buttonBg: "from-[#124E66] to-[#1E3A52]",
            buttonText: "text-white"
        }
    };

    const colors = themeColors[theme];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`rounded-3xl p-12 backdrop-blur-sm ${colors.cardGlow} border ${colors.cardBorder}
        bg-gradient-to-br ${colors.cardBg} flex flex-col items-center justify-center text-center`}
        >
            <div className={`w-24 h-24 rounded-full mb-6 flex items-center justify-center
        ${theme === 'light'
                    ? 'bg-gradient-to-br from-[#F1F0E8]/30 to-[#E5E1DA]/30'
                    : 'bg-gradient-to-br from-[#212A31]/30 to-[#2E3944]/30'}`}
            >
                <i className={`ri-pie-chart-2-line text-4xl ${colors.textSecondary}`}></i>
            </div>
            <h3 className={`font-['Merriweather'] text-2xl font-bold ${colors.textPrimary} mb-3`}>
                No Data Available
            </h3>
            <p className={`font-['Source_Sans_Pro'] ${colors.textSecondary} max-w-md mb-6`}>
                Start tracking your habits to see beautiful insights and statistics about your progress.
            </p>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onAddHabit}
                className={`px-6 py-3 rounded-xl font-semibold bg-gradient-to-r ${colors.buttonBg} ${colors.buttonText}
          flex items-center gap-2 transition-all duration-300`}
            >
                <i className="ri-add-circle-line"></i>
                Add Your First Habit
            </motion.button>
        </motion.div>
    );
};

export default EmptyStateCard;