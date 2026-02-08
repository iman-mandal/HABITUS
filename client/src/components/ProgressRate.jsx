import React, { useEffect, useState } from 'react';

const ProgressRate = ({ percentage, size = 'lg', theme = 'dark' }) => {
    // Get theme from localStorage if not provided
    const currentTheme = theme || localStorage.getItem('userTheme') || 'dark';
    const isLight = currentTheme === 'light';

    // Size configuration
    const sizeConfig = {
        lg: 'progress-size-lg',
        md: 'progress-size-md',
        sm: 'progress-size-sm'
    };

    const sizeClass = sizeConfig[size] || 'progress-size-lg';

    // Calculate circle properties
    const radius = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--progress-radius')) || 65;
    const strokeWidth = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--progress-stroke-width')) || 12;

    const normalizedRadius = radius - strokeWidth / 2;
    const circumference = normalizedRadius * 2 * Math.PI;

    const [offset, setOffset] = useState(circumference);

    useEffect(() => {
        const progressOffset = circumference - (percentage / 100) * circumference;
        setOffset(progressOffset);
    }, [percentage, circumference]);

    // Set CSS variables for circle calculations
    useEffect(() => {
        document.documentElement.style.setProperty('--progress-circumference', circumference.toString());
        document.documentElement.style.setProperty('--progress-offset', offset.toString());
        document.documentElement.style.setProperty('--progress-normalized-radius', normalizedRadius.toString());
    }, [circumference, offset, normalizedRadius]);

    return (
        <div className="progress-rate-container">
            <svg className={`progress-svg ${sizeClass}`}>
                {/* Background circle - using theme colors */}
                <circle
                    className={`progress-bg-circle ${isLight ? 'progress-bg-circle-light' : 'progress-bg-circle-dark'}`}
                />

                {/* Progress circle - using theme gradient */}
                <circle
                    className="progress-circle circle-transition circle-transform"
                    stroke="url(#progressGradient)"
                />

                {/* Gradient definition */}
                <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" className={isLight ? 'progress-gradient-light-start' : 'progress-gradient-dark-start'} />
                        <stop offset="50%" className={isLight ? 'progress-gradient-light-middle' : 'progress-gradient-dark-middle'} />
                        <stop offset="100%" className={isLight ? 'progress-gradient-light-end' : 'progress-gradient-dark-end'} />
                    </linearGradient>
                </defs>

                {/* Percentage text */}
                <text
                    x="50%"
                    y="50%"
                    className={`progress-text ${isLight ? 'progress-text-light' : 'progress-text-dark'}`}
                >
                    {percentage}%
                </text>
            </svg>
        </div>
    );
};

export default ProgressRate;