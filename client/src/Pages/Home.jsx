import React, { useCallback, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar';
import ProgressRate from '../components/ProgressRate';
import Habits from '../components/Habits';
import HabitDistributionCard from '../components/HabitDistributionCard';
import MotivationCard from '../components/MotivationCard';
import StatsSummaryCard from '../components/StatsSummaryCard';
import { useHabits } from '../context/HabitContext'
import { useUser } from '../context/UserContext';
import { motion } from 'framer-motion';
import '../global.css';
import HabitChat from '../components/HabitChat';

const Home = () => {
    const { habits, setHabits } = useHabits()
    const [maxHabit, setMaxHabit] = useState('')
    const [minHabit, setMinHabit] = useState('')
    const [openChat, setOpenChat] = useState(false)
    const { user, setUser } = useUser();

    // Get current theme from user or default to 'dark'
    const currentTheme = user?.theme || 'dark';
    const themeClass = currentTheme === 'light' ? 'light-theme' : 'dark-theme';

    const date = new Date();
    const formattedDate = date.toLocaleDateString('en-IN', {
        month: 'long',
        day: 'numeric',
    });
    const week = date.toLocaleDateString('en-IN', {
        weekday: 'long',
    })

    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token || token == '') {
            navigate('/login');
        }
    }, [navigate]);

    // Greeting based on time with accurate ranges
    const hour = date.getHours();
    let greeting = 'Good Morning 🌅';
    let greetingClass = 'morning-gradient';

    if (hour >= 4 && hour < 12) {
        // Morning (4 AM - 11:59 AM)
        greeting = 'Good Morning 🌅';
        greetingClass = 'morning-gradient';
    } else if (hour >= 12 && hour < 17) {
        // Afternoon (12 PM - 4:59 PM)
        greeting = 'Good Afternoon 🌞';
        greetingClass = 'afternoon-gradient';
    } else if (hour >= 17 && hour < 21) {
        // Evening (5 PM - 8:59 PM)
        greeting = 'Good Evening 🌇';
        greetingClass = 'evening-gradient';
    } else {
        // Night (9 PM - 3:59 AM)
        greeting = 'Good Night 🌙';
        greetingClass = 'night-gradient';
    }

    const today = new Date().toISOString().split('T')[0];

    const completedToday = habits.filter((habit) =>
        habit.history?.some(
            (h) => h.date === today && h.completed
        )
    ).length;

    const percentage =
        habits.length === 0
            ? 0
            : Math.round((completedToday / habits.length) * 100);

    // last 30 days progress
    const calculateLast30DaysProgress = (habits) => {
        if (!habits || habits.length === 0) return 0;

        const today = new Date();
        const last30Days = new Date();
        last30Days.setDate(today.getDate() - 29);

        let completed = 0;
        let total = 0;

        habits.forEach(habit => {
            habit.history?.forEach(h => {
                const date = new Date(h.date);
                if (date >= last30Days && date <= today) {
                    total++;
                    if (h.completed) completed++;
                }
            });
        });

        if (total === 0) return 0;
        return Math.round((completed / total) * 100);
    };

    return (
        <div className={`home-container ${themeClass} home-overflow-hidden`}>
            {/* ================= HEADER ================= */}
            <div className={`home-header ${greetingClass} ${themeClass}`}>
                {/* Left Section */}
                <div className="home-header-left">
                    <div className="home-header-icon">
                        <i className="ri-leaf-fill"></i>
                    </div>

                    <div>
                        <h2 className="home-header-greeting">
                            {greeting}
                        </h2>
                        <p className="home-header-username home-mt-1">
                            {user?.fullname?.firstname || 'Nature Lover'}
                        </p>
                    </div>
                </div>

                {/* Right Section */}
                <div className="home-header-right">
                    <div className="home-header-icon">
                        <i className="ri-calendar-event-fill"></i>
                    </div>

                    <div className="home-header-date">
                        <p className="home-header-weekday">
                            {week},
                        </p>
                        <p className="home-header-formatted-date">
                            {formattedDate}
                        </p>
                    </div>
                </div>
            </div>

            {/* ================= MAIN ================= */}
            <div className="home-main-content">

                {/* -------- LEFT COLUMN -------- */}
                <div className="home-left-column">

                    {/* PROGRESS SECTION */}
                    <div className="home-progress-section">
                        {/* Today's Progress Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`home-card home-today-progress-card ${themeClass}`}
                        >
                            <div className="home-card-header">
                                <div className={`home-card-icon ${themeClass}`}>
                                    <i className="ri-sun-fill"></i>
                                </div>
                                <h3 className={`home-card-title ${themeClass}`}>
                                    Today's Progress
                                </h3>
                            </div>

                            <div className="home-progress-content">
                                <div className="home-progress-stats">
                                    <div className="home-mb-4">
                                        <p className={`home-progress-label ${themeClass} home-mb-2`}>
                                            {completedToday} out of {habits.length} habits completed
                                        </p>
                                        <div className={`home-progress-bar-container ${themeClass}`}>
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${percentage}%` }}
                                                transition={{ duration: 0.9, type: "spring" }}
                                                className={`home-progress-bar ${themeClass}`}
                                            />
                                        </div>
                                        <p className={`home-progress-percentage ${themeClass} home-text-right home-mt-2`}>
                                            {percentage}%
                                        </p>
                                    </div>
                                </div>
                                <ProgressRate percentage={percentage} size="lg" theme={currentTheme} />
                            </div>
                        </motion.div>

                        {/* 30 Days Progress Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className={`home-card home-30days-card ${themeClass}`}
                        >
                            <div className='home-30days-header'>
                                <div className={`home-30days-icon ${themeClass}`}>
                                    <i className="ri-calendar-2-fill"></i>
                                </div>
                                <h3 className={`home-30days-title ${themeClass} home-mb-2`}>
                                    Last 30 Days
                                </h3>
                            </div>
                            <ProgressRate
                                percentage={calculateLast30DaysProgress(habits)}
                                size="md"
                                theme={currentTheme}
                            />
                            <p className={`home-30days-subtitle ${themeClass} home-mt-2`}>
                                Monthly consistency
                            </p>
                        </motion.div>
                    </div>

                    {/* BEST & NEEDS FOCUS HABITS */}
                    <div className="home-habits-comparison home-mb-6">
                        {/* Best Habit Card */}
                        {maxHabit && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className={`home-card ${themeClass}`}
                            >
                                <div className="home-card-header home-mb-4">
                                    <div className={`home-best-habit-icon ${themeClass}`}>
                                        <i className="ri-trophy-fill"></i>
                                    </div>
                                    <div>
                                        <h3 className={`home-card-title ${themeClass}`}>
                                            Your Best Habit
                                        </h3>
                                        <p className={`home-card-subtitle ${themeClass}`}>
                                            Keep up the great work!
                                        </p>
                                    </div>
                                </div>

                                <div className="home-mb-3">
                                    <p className={`home-habit-name ${themeClass} home-mb-1`}>
                                        {maxHabit.name}
                                    </p>
                                    <div className="home-flex home-justify-between home-items-center home-mb-2">
                                        <span className={`home-habit-percentage ${themeClass}`}>
                                            {maxHabit.percentage}%
                                        </span>
                                    </div>
                                    <div className={`home-habit-progress-bar ${themeClass}`}>
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${maxHabit.percentage}%` }}
                                            transition={{ duration: 1, type: "spring" }}
                                            className={`home-habit-progress-fill ${themeClass}`}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Needs Focus Card */}
                        {minHabit && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className={`home-card ${themeClass}`}
                            >
                                <div className="home-card-header home-mb-4">
                                    <div className={`home-focus-habit-icon ${themeClass}`}>
                                        <i className="ri-refresh-fill"></i>
                                    </div>
                                    <div>
                                        <h3 className={`home-card-title ${themeClass}`}>
                                            Needs Focus
                                        </h3>
                                        <p className={`home-card-subtitle ${themeClass}`}>
                                            Small steps lead to big changes
                                        </p>
                                    </div>
                                </div>

                                <div className="home-mb-3">
                                    <p className={`home-habit-name ${themeClass} home-mb-1`}>
                                        {minHabit.name}
                                    </p>
                                    <div className="home-flex home-justify-between home-items-center home-mb-2">
                                        <span className={`home-habit-percentage ${themeClass}`}>
                                            {minHabit.percentage}%
                                        </span>
                                    </div>
                                    <div className={`home-habit-progress-bar ${themeClass}`}>
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${minHabit.percentage}%` }}
                                            transition={{ duration: 1, type: "spring" }}
                                            className={`home-focus-habit-progress-fill ${themeClass}`}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* HABITS LIST */}
                    <div className="home-habits-section">
                        <div className="home-habits-header">
                            <div className={`home-habits-icon ${themeClass}`}>
                                <i className="ri-list-check-2"></i>
                            </div>
                            <h2 className={`home-habits-title ${themeClass}`}>
                                Your Habits
                            </h2>
                        </div>
                        <Habits
                            habits={habits}
                            setHabits={setHabits}
                            setMaxHabit={setMaxHabit}
                            setMinHabit={setMinHabit}
                            theme={currentTheme}
                        />
                    </div>
                </div>

                {/* -------- RIGHT COLUMN -------- */}
                <div className="home-right-column">
                    {/* Use the new components */}
                    <HabitDistributionCard habits={habits} timeRange={'overall'} theme={currentTheme} />
                    <MotivationCard theme={currentTheme} />
                    <StatsSummaryCard habits={habits} theme={currentTheme} />
                </div>
            </div>

            {/* AI COACH BUTTON - Moved outside the main content */}
            <button
                onClick={() => setOpenChat(true)}
                className="home-ai-coach-btn"
            >
                <span>🤖</span>
                <span>AI Coach</span>
            </button>

            {/* AI CHAT MODAL */}
            {openChat && (
                <HabitChat
                    onClose={() => setOpenChat(false)}
                    theme={currentTheme}
                />
            )}

            {/* NAVBAR */}
            <div className="home-navbar">
                <Navbar user={user} setUser={setUser} />
            </div>
        </div>
    )
}

export default Home;