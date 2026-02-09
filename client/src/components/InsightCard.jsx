import React from 'react';
import { motion } from 'framer-motion';

const InsightCard = ({ icon, title, description, color = 'blue', theme = 'dark' }) => {
    const themeColors = {
        light: {
            cardGlow: "shadow-lg shadow-[#89A8B2]/10",
            cardBorder: "border-white/40",
            cardBg: "from-white/40 to-white/20",
            textPrimary: "#2E3944",
            textSecondary: "#5A6D77",
        },
        dark: {
            cardGlow: "shadow-xl shadow-[#124E66]/15",
            cardBorder: "border-[#2E3944]/40",
            cardBg: "from-[#1A2832]/80 to-[#0F1A23]/80",
            textPrimary: "#E8F0F7",
            textSecondary: "#A3B8C8",
        }
    };

    const colors = themeColors[theme];

    const getColorStyles = (color) => {
        switch (color) {
            case 'green':
                return 'from-emerald-500/20 to-teal-500/20';
            case 'blue':
                return 'from-blue-500/20 to-cyan-500/20';
            case 'purple':
                return 'from-purple-500/20 to-pink-500/20';
            case 'orange':
                return 'from-amber-500/20 to-orange-500/20';
            default:
                return 'from-blue-500/20 to-cyan-500/20';
        }
    };

    const bgGradient = getColorStyles(color);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -3 }}
            className={`relative overflow-hidden rounded-2xl p-5 backdrop-blur-sm ${colors.cardGlow} border ${colors.cardBorder}
        bg-gradient-to-br ${colors.cardBg} transition-all duration-300`}
        >
            {/* Decorative corner */}
            <div className={`absolute top-0 right-0 w-20 h-20 opacity-5
        ${color === 'blue' ? 'bg-gradient-to-br from-blue-400 to-cyan-400' :
                    color === 'green' ? 'bg-gradient-to-br from-emerald-400 to-teal-400' :
                        color === 'purple' ? 'bg-gradient-to-br from-purple-400 to-pink-400' :
                            'bg-gradient-to-br from-amber-400 to-orange-400'}`}
            />

            <div className="relative z-10 flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
          ${bgGradient}`}
                >
                    <i className={`${icon} text-xl ${colors.textPrimary}`}></i>
                </div>

                <div className="flex-1">
                    <h4 className={`font-['Merriweather'] font-bold text-lg mb-2 ${colors.textPrimary}`}>
                        {title}
                    </h4>
                    <p className={`font-['Source_Sans_Pro'] text-sm ${colors.textSecondary}`}>
                        {description}
                    </p>
                </div>

                {/* Arrow indicator */}
                <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-lg opacity-60"
                >
                    <i className={`ri-arrow-right-up-line ${colors.textSecondary}`}></i>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default InsightCard;