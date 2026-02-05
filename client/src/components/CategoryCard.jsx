import React from 'react';
import { motion } from 'framer-motion';

const CategoryCard = ({ category, isSelected, onClick, theme = 'dark' }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onClick(category)}
            className={`relative cursor-pointer rounded-2xl p-4 backdrop-blur-sm border transition-all duration-300
        ${isSelected ? 'border-white/30 shadow-xl scale-105' :
                    theme === 'light' ? 'border-white/40' : 'border-[#2E3944]/40'} 
        ${theme === 'light' ? 'shadow-lg shadow-[#89A8B2]/10' : 'shadow-xl shadow-[#124E66]/15'}`}
            style={{ background: category.color }}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                        <i className={`${category.icon} text-xl text-white`}></i>
                    </div>
                    <div>
                        <h4 className="font-['Montserrat'] font-bold text-white text-lg">
                            {category.label}
                        </h4>
                        <p className="font-['Source_Sans_Pro'] text-white/80 text-sm">
                            {category.value} habits
                        </p>
                    </div>
                </div>

                <div className="text-right">
                    <div className="text-white font-bold text-2xl">
                        {category.percentage}%
                    </div>
                    <div className="text-white/60 text-xs mt-1">
                        Completion
                    </div>
                </div>
            </div>

            {/* Sparkle effect on selection */}
            {isSelected && (
                <>
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-2 -right-2 w-6 h-6"
                    >
                        <i className="ri-sparkling-2-fill text-yellow-300"></i>
                    </motion.div>
                    <div className="absolute inset-0 rounded-2xl border-2 border-white/20 pointer-events-none" />
                </>
            )}
        </motion.div>
    );
};

export default CategoryCard;