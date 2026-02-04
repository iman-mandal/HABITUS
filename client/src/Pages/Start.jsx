import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppLogo from '../Assets/HabitTrackerLogo.png'
import { motion } from 'framer-motion'

const Start = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/home');
        }
    }, [navigate]);

    return (
        <div className="h-screen bg-gradient-to-br from-[#212A31] via-[#2E3944] to-[#124E66] overflow-hidden relative">
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-[#748D92]/10 to-[#124E66]/10 blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-gradient-to-r from-[#D3D9D4]/5 to-[#748D92]/5 blur-3xl"></div>
            </div>

            <div className="relative z-10 h-full flex flex-col px-6 py-8">
                {/* Logo Section - Top 1/3 */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className='flex-1 flex flex-col items-center justify-end'
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className='relative mb-4'
                    >
                        <div className='absolute inset-0 bg-gradient-to-r from-[#124E66] to-[#2E3944] rounded-full blur-xl opacity-50'></div>
                        <img
                            className='relative h-[120px] w-[120px] object-contain'
                            src={AppLogo}
                            alt="app logo"
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className='text-center mb-2'
                    >
                        <h1 className='text-[28px] text-[#D3D9D4] font-bold font-["Merriweather"]'>
                            HABITUS
                        </h1>
                        <p className='text-[14px] text-[#748D92] font-["Source_Sans_Pro"] font-medium mt-1'>
                            Track. Grow. Achieve
                        </p>
                    </motion.div>
                </motion.div>

                {/* Welcome Section - Middle 1/3 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className='flex-1 flex flex-col justify-center'
                >
                    <div className='text-center mb-4'>
                        <h2 className='text-[32px] font-bold text-[#D3D9D4] font-["Merriweather"] leading-tight'>
                            Build Better<br />Habits Daily
                        </h2>
                    </div>

                    <div className='mb-6 px-2'>
                        <p className='text-[15px] text-[#748D92] font-["Source_Sans_Pro"] font-medium text-center leading-relaxed'>
                            Your daily companion for building positive habits through consistent tracking.
                        </p>
                    </div>

                    {/* Compact Features */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className='grid grid-cols-3 gap-3 px-2 mb-4'
                    >
                        <div className='flex flex-col items-center'>
                            <div className='w-12 h-12 rounded-full bg-gradient-to-r from-[#124E66] to-[#2E3944] flex items-center justify-center mb-2'>
                                <span className='text-[#D3D9D4] text-lg'>✓</span>
                            </div>
                            <p className='text-[12px] text-[#D3D9D4] font-["Source_Sans_Pro"] text-center'>Track</p>
                        </div>

                        <div className='flex flex-col items-center'>
                            <div className='w-12 h-12 rounded-full bg-gradient-to-r from-[#124E66] to-[#2E3944] flex items-center justify-center mb-2'>
                                <span className='text-[#D3D9D4] text-lg'>📈</span>
                            </div>
                            <p className='text-[12px] text-[#D3D9D4] font-["Source_Sans_Pro"] text-center'>Grow</p>
                        </div>

                        <div className='flex flex-col items-center'>
                            <div className='w-12 h-12 rounded-full bg-gradient-to-r from-[#124E66] to-[#2E3944] flex items-center justify-center mb-2'>
                                <span className='text-[#D3D9D4] text-lg'>🎯</span>
                            </div>
                            <p className='text-[12px] text-[#D3D9D4] font-["Source_Sans_Pro"] text-center'>Achieve</p>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Start Button - Bottom 1/3 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    className='flex-1 flex flex-col justify-end'
                >
                    <Link
                        to='/login'
                        className='flex items-center justify-center w-full font-lg py-4 rounded-xl bg-gradient-to-r from-[#124E66] to-[#212A31] text-[#D3D9D4] font-["Source_Sans_Pro"] font-semibold shadow-xl hover:shadow-2xl hover:shadow-[#124E66]/30 transition-all duration-300 active:scale-95 group mb-4'
                    >
                        <span>Let's Start</span>
                        <span className='ml-2 text-lg group-hover:translate-x-1 transition-transform'>→</span>
                    </Link>

                    {/* Footer */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9 }}
                        className='text-center pt-2'
                    >
                        <p className='text-[11px] text-[#748D92] font-["Source_Sans_Pro"]'>
                            Join thousands transforming their lives
                        </p>
                        <div className='flex items-center justify-center gap-1 mt-1'>
                            <div className='w-1 h-1 rounded-full bg-[#748D92]/30'></div>
                            <div className='w-1 h-1 rounded-full bg-[#748D92]/30'></div>
                            <div className='w-1 h-1 rounded-full bg-[#748D92]/30'></div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}

export default Start