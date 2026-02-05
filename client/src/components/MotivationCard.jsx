import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const MotivationCard = ({ theme }) => {
    const [motivation, setMotivation] = useState('');

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

    useEffect(() => {
        const fetchMotivation = async () => {
            try {
                const res = await fetch(
                    'https://api.adviceslip.com/advice',
                    { cache: 'no-cache' }
                );
                const data = await res.json();
                setMotivation(data.slip.advice);
            } catch (err) {
                console.error('Failed to fetch motivation', err);
                setMotivation("Every day is a fresh start. Plant the seeds of good habits.");
            }
        };

        fetchMotivation();

        const interval = setInterval(fetchMotivation, 60 * 60 * 1000); // 1 hour

        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className={`${colors.cardBg} rounded-2xl p-6 border ${colors.cardBorder} shadow-lg`}
        >
            <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-full ${colors.iconBg} flex items-center justify-center`}>
                    <i className={`ri-lightbulb-flash-fill text-xl ${colors.iconColor}`}></i>
                </div>
                <div>
                    <h3 className={`font-['Merriweather'] text-[18px] font-bold ${colors.primaryText}`}>
                        Daily Wisdom
                    </h3>
                    <p className={`font-['Source_Sans_Pro'] ${colors.secondaryText} text-xs mt-1`}>
                        Stay inspired on your journey
                    </p>
                </div>
            </div>

            <div className={`relative p-4 rounded-lg ${colors.innerCardBg} border ${colors.cardBorder}`}>
                <div className="absolute -top-2 -left-2">
                    <i className={`ri-double-quotes-l text-xl ${colors.secondaryText} opacity-50`}></i>
                </div>
                <p className={`font-['Merriweather'] italic text-[16px] ${colors.primaryText} leading-relaxed pl-4`}>
                    "{motivation || 'The best time to plant a tree was 20 years ago. The second best time is now.'}"
                </p>
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#748D92]/20">
                    <i className="ri-seedling-line" style={{
                        color: theme === 'light' ? '#89A8B2' : '#124E66'
                    }}></i>
                    <p className={`font-['Source_Sans_Pro'] ${colors.secondaryText} text-xs`}>
                        Nature-inspired motivation
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default MotivationCard;