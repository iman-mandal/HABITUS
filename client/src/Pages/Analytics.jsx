import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import HabitAreaChatGraph from '../components/HabitAreaChatGraph'
import StatCard from '../components/StatCard'
import InsightCard from '../components/InsightCard'
import { useHabits } from '../context/HabitContext'
import { useUser } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import HabitDistributionCard from '../components/HabitDistributionCard'

const Analytics = () => {
    const navigate = useNavigate()
    const { user, setUser } = useUser();
    const { habits, setHabits, toggleTheme } = useHabits()
    const [timeRange, setTimeRange] = useState('week')
    const [bestHabit, setBestHabit] = useState(null)
    const [worstHabit, setWorstHabit] = useState(null)

    const totalHabits = habits?.length || 0
    const currentTheme = localStorage.getItem('userTheme') || 'dark'
    const themeClass = currentTheme === 'light' ? 'light-theme' : 'dark-theme'

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) navigate('/login')
    }, [navigate])

    // Helper function to get date range based on timeRange
    const getDateRange = (range) => {
        const now = new Date();

        switch (range) {
            case 'week': {
                const day = now.getDay();
                const diffToMonday = day === 0 ? -6 : 1 - day;
                const startDate = new Date(now);
                startDate.setDate(now.getDate() + diffToMonday);
                startDate.setHours(0, 0, 0, 0);

                const endDate = new Date(startDate);
                endDate.setDate(startDate.getDate() + 6);
                endDate.setHours(23, 59, 59, 999);

                return { startDate, endDate };
            }

            case 'month': {
                const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                startDate.setHours(0, 0, 0, 0);

                const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                endDate.setHours(23, 59, 59, 999);

                return { startDate, endDate };
            }

            case 'quarter': {
                const currentMonth = now.getMonth();
                const quarter = Math.floor(currentMonth / 3);
                const startDate = new Date(now.getFullYear(), quarter * 3, 1);
                startDate.setHours(0, 0, 0, 0);

                const endDate = new Date(now.getFullYear(), (quarter * 3) + 3, 0);
                endDate.setHours(23, 59, 59, 999);

                return { startDate, endDate };
            }

            case 'year': {
                const startDate = new Date(now.getFullYear(), 0, 1);
                startDate.setHours(0, 0, 0, 0);

                const endDate = new Date(now.getFullYear(), 11, 31);
                endDate.setHours(23, 59, 59, 999);

                return { startDate, endDate };
            }

            default:
                return { startDate: now, endDate: now };
        }
    };

    // Calculate completion rate for selected time range
    const calculateCompletionRate = () => {
        if (!habits || habits.length === 0) return 0;

        const { startDate, endDate } = getDateRange(timeRange);

        let totalCompleted = 0;
        let totalTarget = 0;

        habits.forEach(habit => {
            const completedCount = habit.history?.filter(h => {
                const date = new Date(h.date);
                return h.completed && date >= startDate && date <= endDate;
            }).length || 0;

            const targetCount = habit.history?.filter(h => {
                const date = new Date(h.date);
                return date >= startDate && date <= endDate;
            }).length || 0;

            totalCompleted += completedCount;
            totalTarget += targetCount;
        });

        if (totalTarget === 0) return 0;
        return Math.round((totalCompleted / totalTarget) * 100);
    };

    // Calculate active streaks for selected time range
    const calculateActiveStreaks = () => {
        if (!habits || habits.length === 0) return 0;

        const { startDate, endDate } = getDateRange(timeRange);

        return habits.filter(habit => {
            // Filter history within date range
            const filteredHistory = habit.history?.filter(h => {
                const date = new Date(h.date);
                return date >= startDate && date <= endDate;
            }) || [];

            if (filteredHistory.length === 0) return false;

            // Calculate current streak within date range
            let currentStreak = 0;

            // Sort by date descending (most recent first)
            filteredHistory.sort((a, b) => new Date(b.date) - new Date(a.date));

            for (let i = 0; i < filteredHistory.length; i++) {
                if (filteredHistory[i].completed) {
                    currentStreak++;
                } else {
                    break;
                }
            }

            return currentStreak >= 3; // Consider streak "active" if >= 3
        }).length;
    };

    // Calculate habits tracked in current time range
    const calculateActiveHabits = () => {
        if (!habits || habits.length === 0) return 0;

        const { startDate, endDate } = getDateRange(timeRange);

        return habits.filter(habit => {
            return habit.history?.some(hist => {
                const date = new Date(hist.date);
                return date >= startDate && date <= endDate;
            });
        }).length;
    };

    // Function to calculate best habit (highest completion rate)
    const getBestHabit = () => {
        if (!habits || habits.length === 0) return null;

        const { startDate, endDate } = getDateRange(timeRange);

        const habitsWithStats = habits.map(habit => {
            // Filter history for current time range
            const historyInRange = habit.history?.filter(h => {
                try {
                    const historyDate = new Date(h.date);
                    return historyDate >= startDate && historyDate <= endDate;
                } catch (error) {
                    return false;
                }
            }) || [];

            const completedInRange = historyInRange.filter(h => h.completed).length;
            const totalInRange = historyInRange.length;
            const completionRate = totalInRange > 0 ? Math.round((completedInRange / totalInRange) * 100) : 0;

            // Calculate current streak in range
            let currentStreak = 0;
            let maxStreakInRange = 0;

            // Sort by date ascending
            historyInRange.sort((a, b) => new Date(a.date) - new Date(b.date));

            for (let i = 0; i < historyInRange.length; i++) {
                if (historyInRange[i].completed) {
                    currentStreak++;
                    maxStreakInRange = Math.max(maxStreakInRange, currentStreak);
                } else {
                    currentStreak = 0;
                }
            }

            return {
                ...habit,
                completionRate,
                completedInRange,
                totalInRange,
                currentStreak: maxStreakInRange,
                hasDataInRange: historyInRange.length > 0
            };
        });

        // Filter habits that have data in the current time range
        const habitsWithData = habitsWithStats.filter(h => h.hasDataInRange);

        if (habitsWithData.length === 0) return null;

        // Find habit with highest completion rate
        return habitsWithData.reduce((best, current) =>
            current.completionRate > best.completionRate ? current : best
        );
    };

    // Function to calculate worst habit (lowest completion rate)
    const getWorstHabit = () => {
        if (!habits || habits.length === 0) return null;

        const { startDate, endDate } = getDateRange(timeRange);

        const habitsWithStats = habits.map(habit => {
            const historyInRange = habit.history?.filter(h => {
                try {
                    const historyDate = new Date(h.date);
                    return historyDate >= startDate && historyDate <= endDate;
                } catch (error) {
                    return false;
                }
            }) || [];

            const completedInRange = historyInRange.filter(h => h.completed).length;
            const totalInRange = historyInRange.length;
            const completionRate = totalInRange > 0 ? Math.round((completedInRange / totalInRange) * 100) : 0;

            return {
                ...habit,
                completionRate,
                completedInRange,
                totalInRange,
                hasDataInRange: historyInRange.length > 0
            };
        });

        const habitsWithData = habitsWithStats.filter(h => h.hasDataInRange);

        if (habitsWithData.length === 0) return null;

        // Find habit with lowest completion rate (but only if they have some completion)
        const habitsWithSomeCompletion = habitsWithData.filter(h => h.completedInRange > 0);
        if (habitsWithSomeCompletion.length > 0) {
            return habitsWithSomeCompletion.reduce((worst, current) =>
                current.completionRate < worst.completionRate ? current : worst
            );
        }

        // If no habits have completion, return the first one
        return habitsWithData[0];
    };

    // Update stats when habits or timeRange changes
    useEffect(() => {
        if (habits.length > 0) {
            const bestHabit = getBestHabit();
            const worstHabit = getWorstHabit();
            setBestHabit(bestHabit);
            setWorstHabit(worstHabit);
        } else {
            setBestHabit(null);
            setWorstHabit(null);
        }
    }, [habits, timeRange, currentTheme]);

    const completionRate = calculateCompletionRate();
    const activeStreaks = calculateActiveStreaks();
    const activeHabits = calculateActiveHabits();

    // Format habit name for display
    const formatHabitName = (name) => {
        if (!name) return 'None';
        return name.length > 12 ? name.substring(0, 12) + '...' : name;
    };

    const capitalizeFirst = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className={`analytics-container ${themeClass}`}
        >
            {/* Floating Theme Toggle */}
            <motion.button
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className={`analytics-theme-toggle ${themeClass}`}
            >
                {currentTheme === 'light' ? '🌙' : '☀️'}
            </motion.button>

            {/* Enhanced HEADER */}
            <div className={`analytics-header ${themeClass}`}>
                {/* Animated background particles */}
                <div className="analytics-header-particles">
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ y: -100, x: Math.random() * 100 }}
                            animate={{
                                y: [0, 1000],
                                x: [Math.random() * 100, Math.random() * 100 + 50]
                            }}
                            transition={{
                                duration: 20 + Math.random() * 10,
                                repeat: Infinity,
                                delay: Math.random() * 5
                            }}
                            className={`analytics-particle ${themeClass}`}
                            style={{ left: `${Math.random() * 100}%` }}
                        />
                    ))}
                </div>

                <div className="analytics-header-content">
                    <div className='analytics-flex analytics-flex-row analytics-gap-3'>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", damping: 15 }}
                            className={`analytics-header-icon ${themeClass}`}
                        >
                            <i className="ri-bar-chart-2-fill"></i>
                        </motion.div>
                        <div className='analytics-flex analytics-flex-col analytics-items-center'>
                            <motion.h2
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="analytics-title"
                            >
                                Habit Analytics
                            </motion.h2>

                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="analytics-subtitle"
                            >
                                Track your growth, nurture your progress
                            </motion.p>
                        </div>
                    </div>
                    {/* Enhanced Time Range Selector */}
                    <div className="analytics-time-range-selector analytics-no-scrollbar">
                        {['week', 'month', 'quarter', 'year'].map((range) => (
                            <motion.button
                                key={range}
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setTimeRange(range)}
                                className={`analytics-time-range-btn ${themeClass} ${timeRange === range ? 'selected' : ''}`}
                            >
                                {capitalizeFirst(range)}
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>

            {/* STATS OVERVIEW - Time-based stats */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="analytics-stats-section"
            >
                {/* Stats Header with Time Range */}
                <div className="analytics-stats-header">
                    <div className="analytics-flex analytics-items-center analytics-gap-3">
                        <div className={`analytics-stats-icon ${themeClass}`}>
                            <i className="ri-dashboard-fill"></i>
                        </div>
                        <div>
                            <h3 className={`analytics-stats-title ${themeClass}`}>
                                {capitalizeFirst(timeRange)} Performance
                            </h3>
                            <p className={`analytics-stats-subtitle ${themeClass}`}>
                                Key metrics for the selected period
                            </p>
                        </div>
                    </div>

                    {/* Time Range Indicator */}
                    <div className={`analytics-time-indicator ${themeClass}`}>
                        <i className="ri-calendar-line"></i>
                        <span>{capitalizeFirst(timeRange)}</span>
                    </div>
                </div>

                <div className="analytics-stats-grid">
                    {/* BEST HABIT */}
                    <StatCard
                        icon="ri-trophy-fill"
                        label="Best Habit"
                        value={formatHabitName(bestHabit?.title)}
                        subtext={`${bestHabit?.completionRate || 0}% completion`}
                        color="success"
                        theme={currentTheme}
                    />

                    <StatCard
                        icon="ri-check-double-line"
                        label="Completion Rate"
                        value={`${completionRate}%`}
                        progress={completionRate}
                        subtext={`${capitalizeFirst(timeRange)} performance`}
                        color={completionRate >= 70 ? 'success' : completionRate >= 40 ? 'warning' : 'danger'}
                        theme={currentTheme}
                    />

                    <StatCard
                        icon="ri-leaf-fill"
                        label="Active Habits"
                        value={activeHabits}
                        subtext={`${activeStreaks} strong streaks`}
                        color="primary"
                        theme={currentTheme}
                    />

                    {/* NEEDS ATTENTION HABIT */}
                    <StatCard
                        icon="ri-alert-fill"
                        label="Needs Attention"
                        value={formatHabitName(worstHabit?.title)}
                        subtext={`${worstHabit?.completionRate || 0}% completion`}
                        color="danger"
                        theme={currentTheme}
                    />
                </div>

                {/* Habit Distribution Card */}
                <div className="analytics-distribution-container">
                    <HabitDistributionCard timeRange={timeRange} user={user} habits={habits} theme={currentTheme} />
                </div>

                {/* PERFORMANCE GRAPH */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="analytics-performance-graph"
                >
                    <div className="analytics-flex analytics-items-center analytics-justify-between analytics-mb-6">
                        <div className="analytics-flex analytics-items-center analytics-gap-4">
                            <div className={`analytics-graph-icon ${themeClass}`}>
                                <i className="ri-line-chart-fill"></i>
                            </div>
                            <div>
                                <h3 className={`analytics-stats-title ${themeClass}`}>
                                    Performance Trend
                                </h3>
                                <p className={`analytics-stats-subtitle ${themeClass}`}>
                                    Visualize your habit completion over time
                                </p>
                            </div>
                        </div>

                        <div className={`analytics-time-indicator ${themeClass}`}>
                            <i className="ri-calendar-line"></i>
                            <span>{capitalizeFirst(timeRange)}</span>
                        </div>
                    </div>

                    <div className={`analytics-graph-container ${themeClass}`}>
                        <HabitAreaChatGraph
                            habits={habits}
                            setHabits={setHabits}
                            timeRange={timeRange}
                            theme={currentTheme}
                        />
                    </div>
                </motion.div>

                {/* GROWTH INSIGHTS using InsightCard component */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="analytics-insights-section"
                >
                    <div className="analytics-flex analytics-items-center analytics-gap-4 analytics-mb-6">
                        <div className={`analytics-insights-icon ${themeClass}`}>
                            <i className="ri-lightbulb-flash-fill"></i>
                        </div>
                        <div>
                            <h3 className={`analytics-stats-title ${themeClass}`}>
                                Growth Insights
                            </h3>
                            <p className={`analytics-stats-subtitle ${themeClass}`}>
                                Personalized recommendations based on your {timeRange} data
                            </p>
                        </div>
                    </div>

                    <div className="analytics-insights-grid">
                        <InsightCard
                            icon="ri-bar-chart-line"
                            title={`${capitalizeFirst(timeRange)} Consistency`}
                            description={`You've maintained ${activeStreaks} active streaks this ${timeRange}. Try to keep at least 3 habits consistently active.`}
                            color="green"
                            theme={currentTheme}
                        />

                        <InsightCard
                            icon="ri-timer-line"
                            title="Focus Area"
                            description={`Your ${bestHabit?.title ? bestHabit.title.toLowerCase() : ''} habit has ${bestHabit?.completionRate || 0}% completion rate. Focus here for ${timeRange === 'week' ? 'this week' : timeRange === 'month' ? 'this month' : 'optimal'} growth.`}
                            color="blue"
                            theme={currentTheme}
                        />

                        <InsightCard
                            icon="ri-seedling-line"
                            title="Next Growth Phase"
                            description={`Aim for ${completionRate < 70 ? '70%' : completionRate < 80 ? '80%' : '90%'} ${timeRange} completion rate to unlock your next level of habit mastery.`}
                            color="purple"
                            theme={currentTheme}
                        />
                    </div>
                </motion.div>
            </motion.div>

            {/* NAVBAR */}
            <div className="analytics-navbar">
                <Navbar />
            </div>
        </motion.div>
    )
}

export default Analytics