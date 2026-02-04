import React, { useEffect, useState } from 'react';

const ProgressRate = ({ percentage }) => {
    const radius = 65;
    const stroke = 12;
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
                {/* Background circle - using your colors */}
                <circle
                    stroke="#2E3944" // Dark blue-gray for background
                    fill="transparent"
                    strokeWidth={stroke}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />

                {/* Progress circle - using your gradient colors */}
                <circle
                    stroke="url(#progressGradient)" // Using gradient
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
                        <stop offset="0%" stopColor="#124E66" />
                        <stop offset="50%" stopColor="#748D92" />
                        <stop offset="100%" stopColor="#D3D9D4" />
                    </linearGradient>
                </defs>

                {/* Percentage text */}
                <text
                    x="50%"
                    y="50%"
                    dominantBaseline="middle"
                    textAnchor="middle"
                    className="fill-[#D3D9D4] text-2xl font-semibold font-['Montserrat']"
                >
                    {percentage}%
                </text>
            </svg>
        </div>
    );
};

export default ProgressRate;