import React, { useEffect, useState } from 'react';

const ProgressRate = ({ percentage, size = 'lg', theme = 'dark' }) => {
    // Theme configuration
    const themeConfig = {
        light: {
            // Colors
            bgCircleStroke: '#E5E1DA',
            progressGradient: {
                start: '#89A8B2',
                middle: '#B3C8CF',
                end: '#5A6D74'
            },
            textColor: 'text-[#2E3944]',
            percentageTextSize: {
                lg: 'text-2xl',
                md: 'text-xl',
                sm: 'text-lg'
            }
        },
        dark: {
            // Colors
            bgCircleStroke: '#2E3944',
            progressGradient: {
                start: '#124E66',
                middle: '#748D92',
                end: '#D3D9D4'
            },
            textColor: 'text-[#D3D9D4]',
            percentageTextSize: {
                lg: 'text-2xl',
                md: 'text-xl',
                sm: 'text-lg'
            }
        }
    };

    const currentTheme = themeConfig[theme];
    
    // Size configuration
    const sizeConfig = {
        lg: {
            radius: 65,
            stroke: 12,
            textSize: currentTheme.percentageTextSize.lg
        },
        md: {
            radius: 50,
            stroke: 10,
            textSize: currentTheme.percentageTextSize.md
        },
        sm: {
            radius: 35,
            stroke: 8,
            textSize: currentTheme.percentageTextSize.sm
        }
    };

    const { radius, stroke, textSize } = sizeConfig[size] || sizeConfig.lg;
    const normalizedRadius = radius - stroke / 2;
    const circumference = normalizedRadius * 2 * Math.PI;

    const [offset, setOffset] = useState(circumference);

    useEffect(() => {
        const progressOffset =
            circumference - (percentage / 100) * circumference;
        setOffset(progressOffset);
    }, [percentage, circumference]);

    return (
        <div className="flex flex-col gap-3 items-center justify-center">
            <svg height={radius * 2} width={radius * 2}>
                {/* Background circle - using theme colors */}
                <circle
                    stroke={currentTheme.bgCircleStroke}
                    fill="transparent"
                    strokeWidth={stroke}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />

                {/* Progress circle - using theme gradient colors */}
                <circle
                    stroke="url(#progressGradient)"
                    fill="transparent"
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                    style={{
                        transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: 'rotate(-90deg)',
                        transformOrigin: '50% 50%',
                    }}
                />

                {/* Gradient definition */}
                <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={currentTheme.progressGradient.start} />
                        <stop offset="50%" stopColor={currentTheme.progressGradient.middle} />
                        <stop offset="100%" stopColor={currentTheme.progressGradient.end} />
                    </linearGradient>
                </defs>

                {/* Percentage text */}
                <text
                    x="50%"
                    y="50%"
                    dominantBaseline="middle"
                    textAnchor="middle"
                    className={`${currentTheme.textColor} ${textSize} font-semibold font-['Montserrat']`}
                >
                    {percentage}%
                </text>
            </svg>
        </div>
    );
};

export default ProgressRate;