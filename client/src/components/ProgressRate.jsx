import React, { useEffect, useState } from 'react';

const ProgressRate = ({ percentage }) => {
    const radius = 70;
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

                {/* Background circle */}
                <circle
                    stroke="#e5e7eb"
                    fill="transparent"
                    strokeWidth={stroke}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />

                <circle
                    stroke="#4775ff"
                    fill="transparent"
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                    style={{
                        transition: 'stroke-dashoffset 0.9s cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: 'rotate(-90deg)',
                        transformOrigin: '50% 50%',
                    }}
                />

                <text
                    x="50%"
                    y="50%"
                    dominantBaseline="middle"
                    textAnchor="middle"
                    className="fill-gray-600 text-2xl font-semibold"
                >
                    {percentage}%
                </text>
            </svg>
        </div>
    );
};

export default ProgressRate;
