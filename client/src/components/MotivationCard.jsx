import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const MotivationCard = ({ theme }) => {
    const [motivation, setMotivation] = useState('');

    // Get theme from localStorage if not provided
    const currentTheme = theme || localStorage.getItem('userTheme') || 'dark';
    const isLight = currentTheme === 'light';

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
            className={`motivation-card ${isLight ? 'motivation-card-light' : 'motivation-card-dark'}`}
        >
            <div className="motivation-header">
                <div className={`motivation-icon-container ${isLight ? 'motivation-icon-container-light' : 'motivation-icon-container-dark'}`}>
                    <i className={`ri-lightbulb-flash-fill motivation-icon ${isLight ? 'motivation-icon-light' : 'motivation-icon-dark'}`}></i>
                </div>
                <div className="motivation-title-section">
                    <h3 className={`motivation-title ${isLight ? 'motivation-title-light' : 'motivation-title-dark'}`}>
                        Daily Wisdom
                    </h3>
                    <p className={`motivation-subtitle ${isLight ? 'motivation-subtitle-light' : 'motivation-subtitle-dark'}`}>
                        Stay inspired on your journey
                    </p>
                </div>
            </div>

            <div className={`quote-container ${isLight ? 'quote-container-light' : 'quote-container-dark'}`}>
                <div className="quote-marks">
                    <i className={`ri-double-quotes-l quote-mark-icon ${isLight ? 'quote-mark-icon-light' : 'quote-mark-icon-dark'}`}></i>
                </div>
                <p className={`quote-text ${isLight ? 'quote-text-light' : 'quote-text-dark'}`}>
                    "{motivation || 'The best time to plant a tree was 20 years ago. The second best time is now.'}"
                </p>
                <div className={`quote-footer ${isLight ? 'quote-footer-light' : 'quote-footer-dark'}`}>
                    <i className={`ri-seedling-line nature-icon ${isLight ? 'nature-icon-light' : 'nature-icon-dark'}`}></i>
                    <p className={`nature-label ${isLight ? 'nature-label-light' : 'nature-label-dark'}`}>
                        Nature-inspired motivation
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default MotivationCard;