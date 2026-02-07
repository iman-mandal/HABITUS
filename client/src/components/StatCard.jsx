import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ icon, label, value, subtext, progress, color = 'primary', theme = 'dark' }) => {
    const themeColors = {
        light: {
            // Backgrounds
            cardGlow: "shadow-lg shadow-[#89A8B2]/10",
            cardBorder: "border-[#B3C8CF]/40",
            cardBg: "from-white/40 to-[#F1F0E8]/20",

            // Text colors
            textPrimary: "text-[#2E3944]",
            textSecondary: "text-[#5A6D77]",
            textWhite: "text-white",

            // Progress backgrounds
            progressBg: "bg-white/60",
            progressEmpty: "bg-[#E5E1DA]",

            // Borders
            iconBorder: "border-[#B3C8CF]/30",
            badgeBorder: "border-[#89A8B2]/20",

            // Specific colors
            success: {
                bg: "from-emerald-500/20 to-teal-500/20",
                text: "text-emerald-600",
                progress: "from-emerald-400 to-teal-400",
                badge: "bg-emerald-500/30 text-emerald-700"
            },
            warning: {
                bg: "from-amber-500/20 to-orange-500/20",
                text: "text-amber-600",
                progress: "from-amber-400 to-orange-400",
                badge: "bg-amber-500/30 text-amber-700"
            },
            danger: {
                bg: "from-rose-500/20 to-pink-500/20",
                text: "text-rose-600",
                progress: "from-rose-400 to-pink-400",
                badge: "bg-rose-500/30 text-rose-700"
            },
            primary: {
                bg: "from-[#89A8B2]/30 to-[#B3C8CF]/30",
                text: "text-[#2E3944]",
                progress: "from-[#89A8B2] to-[#5A6D74]",
                badge: "bg-[#89A8B2]/30 text-[#2E3944]"
            }
        },
        dark: {
            // Backgrounds
            cardGlow: "shadow-xl shadow-black/30",
            cardBorder: "border-[#2E3944]/50",
            cardBg: "from-[#1A2832]/90 to-[#212A31]/80",

            // Text colors
            textPrimary: "text-[#D3D9D4]",
            textSecondary: "text-[#748D92]",
            textWhite: "text-white",

            // Progress backgrounds
            progressBg: "bg-[#212A31]/80",
            progressEmpty: "bg-[#2E3944]",

            // Borders
            iconBorder: "border-[#124E66]/30",
            badgeBorder: "border-[#124E66]/30",

            // Specific colors
            success: {
                bg: "from-emerald-600/20 to-teal-600/20",
                text: "text-emerald-300",
                progress: "from-emerald-500 to-teal-500",
                badge: "bg-emerald-600/30 text-emerald-300"
            },
            warning: {
                bg: "from-amber-600/20 to-orange-600/20",
                text: "text-amber-300",
                progress: "from-amber-500 to-orange-500",
                badge: "bg-amber-600/30 text-amber-300"
            },
            danger: {
                bg: "from-rose-600/20 to-pink-600/20",
                text: "text-rose-300",
                progress: "from-rose-500 to-pink-500",
                badge: "bg-rose-600/30 text-rose-300"
            },
            primary: {
                bg: "from-[#124E66]/30 to-[#1E3A52]/30",
                text: "text-[#D3D9D4]",
                progress: "from-[#124E66] to-[#748D92]",
                badge: "bg-[#124E66]/30 text-[#D3D9D4]"
            }
        }
    };

    const colors = themeColors[theme];
    const colorStyles = colors[color] || colors.primary;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className={`relative overflow-hidden rounded-3xl p-6 backdrop-blur-sm ${colors.cardGlow} border ${colors.cardBorder} 
        bg-gradient-to-br ${colors.cardBg} hover:shadow-2xl transition-all duration-300`}
        >
            {/* Background accent */}
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 blur-xl 
        bg-gradient-to-r ${colorStyles.progress}`}
            />

            <div className="relative z-10 flex items-start justify-between">
                <div>
                    <div className={`w-14 h-14 rounded-2xl mb-4 flex items-center justify-center
            bg-gradient-to-br ${colorStyles.bg} border ${colors.iconBorder}`}
                    >
                        <i className={`${icon} text-2xl ${colorStyles.text}`}></i>
                    </div>
                    <p className={`font-['Source_Sans_Pro'] text-sm ${colors.textSecondary} mb-1`}>
                        {label}
                    </p>
                    <h2 className={`font-['Montserrat'] font-bold text-3xl ${colors.textPrimary}`}>
                        {value}
                    </h2>
                </div>

                {progress !== undefined && (
                    <div className="text-right">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${colors.badgeBorder}
              ${progress >= 70 ? colorStyles.badge :
                                progress >= 40 ? colors.warning.badge :
                                    colors.danger.badge}`}
                        >
                            <i className={`ri-${progress >= 70 ? 'trending-up' : progress >= 40 ? 'trending-neutral' : 'trending-down'}-line mr-1`}></i>
                            {progress}%
                        </div>
                    </div>
                )}
            </div>

            {progress !== undefined && (
                <div className="relative z-10 mt-4">
                    <div className="flex justify-between text-xs mb-1">
                        <span className={colors.textSecondary}>Progress</span>
                        <span className={`font-semibold ${progress >= 70 ? colorStyles.text :
                            progress >= 40 ? colors.warning.text : colors.danger.text}`}
                        >
                            {progress}%
                        </span>
                    </div>
                    <div className={`h-2 rounded-full ${colors.progressEmpty} overflow-hidden`}>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className={`h-full rounded-full bg-gradient-to-r ${progress >= 70 ? colorStyles.progress :
                                progress >= 40 ? colors.warning.progress :
                                    colors.danger.progress} shadow-inner`}
                        />
                    </div>
                </div>
            )}

            {subtext && (
                <p className={`relative z-10 mt-3 font-['Source_Sans_Pro'] text-xs ${colors.textSecondary}`}>
                    {subtext}
                </p>
            )}
        </motion.div>
    );
};

export default StatCard;