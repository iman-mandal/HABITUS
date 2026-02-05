import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ icon, label, value, subtext, progress, color = 'primary', theme = 'dark' }) => {
    const themeColors = {
        light: {
            cardGlow: "shadow-lg shadow-[#89A8B2]/10",
            cardBorder: "border-white/40",
            cardBg: "from-white/40 to-white/20",
            textPrimary: "#2E3944",
            textSecondary: "#5A6D77",
        },
        dark: {
            cardGlow: "shadow-xl shadow-[#212A31]/30",
            cardBorder: "border-[#124E66]/30",
            cardBg: "from-[#212A31]/90 to-[#2E3944]/80",
            textPrimary: "#D3D9D4",
            textSecondary: "#748D92",
        }
    };

    const colors = themeColors[theme];

    const getColorStyles = (color) => {
        switch (color) {
            case 'success':
                return {
                    bg: 'from-emerald-500/20 to-teal-500/20',
                    text: 'text-emerald-300',
                    progressFrom: 'from-emerald-400',
                    progressTo: 'to-teal-400',
                    progressBg: 'from-emerald-400 to-teal-400'
                };
            case 'warning':
                return {
                    bg: 'from-amber-500/20 to-orange-500/20',
                    text: 'text-amber-300',
                    progressFrom: 'from-amber-400',
                    progressTo: 'to-orange-400',
                    progressBg: 'from-amber-400 to-orange-400'
                };
            case 'danger':
                return {
                    bg: 'from-rose-500/20 to-pink-500/20',
                    text: 'text-rose-300',
                    progressFrom: 'from-rose-400',
                    progressTo: 'to-pink-400',
                    progressBg: 'from-rose-400 to-pink-400'
                };
            default: // primary
                return {
                    bg: 'from-[#124E66]/30 to-[#2E3944]/30',
                    text: 'text-[#748D92]',
                    progressFrom: 'from-[#124E66]',
                    progressTo: 'to-[#748D92]',
                    progressBg: 'from-[#124E66] to-[#748D92]'
                };
        }
    };

    const colorStyles = getColorStyles(color);

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
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full opacity-15 blur-xl 
        bg-gradient-to-r ${colorStyles.progressFrom} ${colorStyles.progressTo}`}
            />

            <div className="relative z-10 flex items-start justify-between">
                <div>
                    <div className={`w-14 h-14 rounded-2xl mb-4 flex items-center justify-center
            bg-gradient-to-br ${colorStyles.bg} border border-[#124E66]/20`}
                    >
                        <i className={`${icon} text-2xl ${colors.textPrimary}`}></i>
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
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
              ${progress >= 70 ? 'bg-[#124E66]/30 text-[#748D92]' :
                                progress >= 40 ? 'bg-[#748D92]/20 text-[#D3D9D4]' :
                                    'bg-rose-500/20 text-rose-300'}`}
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
                        <span className={`font-semibold ${progress >= 70 ? 'text-[#748D92]' :
                            progress >= 40 ? 'text-[#D3D9D4]' : 'text-rose-300'}`}
                        >
                            {progress}%
                        </span>
                    </div>
                    <div className={`h-2 rounded-full ${theme === 'light' ? 'bg-white/60' : 'bg-[#212A31]/80'} overflow-hidden`}>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className={`h-full rounded-full bg-gradient-to-r ${progress >= 70 ? colorStyles.progressBg :
                                progress >= 40 ? 'from-[#748D92] to-[#D3D9D4]' :
                                    'from-rose-400 to-pink-400'
                                } shadow-inner`}
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