import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { useHabits } from '../context/HabitContext'
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../context/UserContext';

const HabitList = () => {
    const { habits, setHabits } = useHabits();
    const { user } = useUser();
    const filters = ['All', 'Daily', 'Weekly', 'Monthly'];

    const [active, setActive] = useState('All');
    const [search, setSearch] = useState('');
    const [habitID, setHabitID] = useState('');

    const navigate = useNavigate();
    const today = new Date().toISOString().split('T')[0];

    // Get current theme from user context
    const storedTheme = localStorage.getItem('userTheme');
    const currentTheme = storedTheme === 'dark' ? 'dark' : 'light';
    const themeClass = currentTheme === 'light' ? 'light-theme' : 'dark-theme';

    // Get category icon based on habit title
    const getHabitCategory = (title) => {
        const lowerTitle = title.toLowerCase();
        if (lowerTitle.includes('run') || lowerTitle.includes('exercise') || lowerTitle.includes('workout') || lowerTitle.includes('gym')) {
            return 'ri-heart-pulse-line';
        } else if (lowerTitle.includes('meditate') || lowerTitle.includes('read') || lowerTitle.includes('journal') || lowerTitle.includes('pray')) {
            return 'ri-brain-line';
        } else if (lowerTitle.includes('study') || lowerTitle.includes('learn') || lowerTitle.includes('practice')) {
            return 'ri-book-line';
        } else if (lowerTitle.includes('water') || lowerTitle.includes('sleep') || lowerTitle.includes('eat') || lowerTitle.includes('fruit')) {
            return 'ri-heart-line';
        } else {
            return 'ri-leaf-line';
        }
    };

    // Get category class
    const getCategoryClass = (title) => {
        const lowerTitle = title.toLowerCase();
        if (lowerTitle.includes('run') || lowerTitle.includes('exercise') || lowerTitle.includes('workout') || lowerTitle.includes('gym')) {
            return 'habit-list-category-fitness';
        } else if (lowerTitle.includes('meditate') || lowerTitle.includes('read') || lowerTitle.includes('journal') || lowerTitle.includes('pray')) {
            return 'habit-list-category-mental';
        } else if (lowerTitle.includes('study') || lowerTitle.includes('learn') || lowerTitle.includes('practice')) {
            return 'habit-list-category-study';
        } else if (lowerTitle.includes('water') || lowerTitle.includes('sleep') || lowerTitle.includes('eat') || lowerTitle.includes('fruit')) {
            return 'habit-list-category-health';
        } else {
            return 'habit-list-category-default';
        }
    };

    // Get streak icon based on streak length
    const getStreakIcon = (streak) => {
        if (streak === 0) return 'ri-seedling-line';
        if (streak < 3) return 'ri-leaf-line';
        if (streak < 7) return 'ri-plant-line';
        if (streak < 14) return 'ri-tree-line';
        return 'ri-fire-fill';
    };

    // Get streak color class
    const getStreakColorClass = (streak) => {
        if (streak === 0) return 'habit-list-streak-0';
        if (streak < 3) return 'habit-list-streak-1';
        if (streak < 7) return 'habit-list-streak-2';
        if (streak < 14) return 'habit-list-streak-3';
        return 'habit-list-streak-4';
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token || token === '') {
            navigate('/login');
        }
    }, [navigate]);

    // Filter and search habits
    const filteredHabits = habits.filter((habit) => {
        const typeMatch =
            active === 'All' ||
            habit.frequency?.toLowerCase() === active.toLowerCase();

        const searchMatch = habit.title
            ?.toLowerCase()
            .includes(search.toLowerCase());

        return typeMatch && searchMatch;
    });

    // Get habit completion percentage
    const getHabitPercentage = (habit) => {
        const total = habit.history?.length || 0;
        const completed = habit.history?.filter((h) => h.completed).length || 0;
        if (total === 0) return 0;
        return Math.round((completed / total) * 100);
    };

    // Get filter button class
    const getFilterClass = (label) => {
        const baseClass = `habit-list-filter-btn habit-list-filter-${label.toLowerCase()}`;
        return active === label ? `${baseClass} selected ${themeClass}` : `${baseClass} ${themeClass}`;
    };

    // Capitalize first letter
    const capitalizeFirst = (str) => {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className={`habit-list-container ${themeClass}`}
        >
            <div className="habit-list-main">

                {/* Header */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className={`habit-list-header ${themeClass}`}
                >
                    <div className="habit-list-header-content">
                        <div className={`habit-list-header-icon ${themeClass}`}>
                            <i className="ri-list-check-3"></i>
                        </div>
                        <div className='habit-list-flex habit-list-flex-col habit-list-justify-start habit-list-items-start'>
                            <h2 className={`habit-list-title ${themeClass}`}>
                                Your Rituals
                            </h2>
                            <p className={`habit-list-subtitle ${themeClass} habit-list-mt-1`}>
                                Cultivate your habits, grow your life
                            </p>
                        </div>
                    </div>

                    {/* Filter Buttons */}
                    <div className="habit-list-filters habit-list-no-scrollbar">
                        {filters.map((label) => (
                            <motion.button
                                key={label}
                                onClick={() => setActive(label)}
                                whileTap={{ scale: 0.95 }}
                                className={getFilterClass(label)}
                            >
                                {active === label && (
                                    <motion.div
                                        layoutId="activeFilter"
                                        className={`habit-list-filter-active ${themeClass}`}
                                        initial={false}
                                    />
                                )}
                                <span className="habit-list-filter-text">
                                    {label}
                                    {active === label && (
                                        <i className="ri-check-line habit-list-text-sm"></i>
                                    )}
                                </span>
                            </motion.button>
                        ))}
                    </div>

                    {/* Search Bar */}
                    <div className="habit-list-search-container">
                        <div className={`habit-list-search-bar ${themeClass}`}>
                            <i className={`habit-list-search-icon ri-search-line ${themeClass}`}></i>
                            <input
                                type="text"
                                placeholder="Search your habits..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className={`habit-list-search-input ${themeClass}`}
                            />
                            {search && (
                                <button
                                    onClick={() => setSearch('')}
                                    className={`habit-list-search-clear ${themeClass}`}
                                >
                                    <i className="ri-close-line"></i>
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Stats Summary */}
                <div className="habit-list-stats">
                    <div className="habit-list-stats-grid">
                        <div className={`habit-list-stat-card ${themeClass}`}>
                            <p className={`habit-list-stat-label ${themeClass}`}>Total Habits</p>
                            <p className={`habit-list-stat-value ${themeClass}`}>{habits.length}</p>
                        </div>
                        <div className={`habit-list-stat-card ${themeClass}`}>
                            <p className={`habit-list-stat-label ${themeClass}`}>Active Today</p>
                            <p className={`habit-list-stat-value ${themeClass}`}>
                                {habits.filter(h => h.history?.some(hh => hh.date === today && hh.completed)).length}
                            </p>
                        </div>
                        <div className={`habit-list-stat-card ${themeClass}`}>
                            <p className={`habit-list-stat-label ${themeClass}`}>Streaks</p>
                            <p className={`habit-list-stat-value ${themeClass}`}>
                                {habits.filter(h => h.streak > 0).length}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Scrollable Habits */}
                <div className="habit-list-scrollable habit-list-no-scrollbar">
                    {filteredHabits.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="habit-list-empty-state"
                        >
                            <div className={`habit-list-empty-icon ${themeClass}`}>
                                <i className="ri-seedling-line"></i>
                            </div>
                            <p className={`habit-list-empty-title ${themeClass}`}>No habits found</p>
                            <p className={`habit-list-empty-text ${themeClass}`}>
                                {search ? 'Try a different search term' : 'Start cultivating your habits garden'}
                            </p>
                            {!search && (
                                <Link
                                    to="/add-habit"
                                    className={`habit-list-empty-btn ${themeClass}`}
                                >
                                    <i className="ri-add-line"></i>
                                    Add First Habit
                                </Link>
                            )}
                        </motion.div>
                    ) : (
                        <AnimatePresence>
                            <div className="habit-list-grid">
                                {filteredHabits.map((habit, index) => {
                                    const todayHistory = habit.history?.find((h) => h.date === today);
                                    const percentage = getHabitPercentage(habit);

                                    return (
                                        <motion.div
                                            key={habit._id}
                                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9, y: -10 }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                            whileHover={{ y: -2 }}
                                            onClick={() => {
                                                setHabitID(habit._id);
                                                navigate(`/habit-details/${habit._id}`);
                                            }}
                                            className={`habit-list-card ${themeClass} habit-list-cursor-pointer`}
                                        >
                                            {/* Progress Background */}
                                            <div
                                                className={`habit-list-progress-bg ${themeClass}`}
                                                style={{ width: `${percentage}%` }}
                                            />

                                            <div className="habit-list-card-content">
                                                {/* Category Icon */}
                                                <div className={`habit-list-category-icon ${getCategoryClass(habit.title)} ${themeClass}`}>
                                                    <i className={`${getHabitCategory(habit.title)}`}></i>
                                                </div>

                                                {/* Habit Details */}
                                                <div className="habit-list-details">
                                                    <div className="habit-list-details-header">
                                                        <h2 className={`habit-list-habit-title ${themeClass}`}>
                                                            {habit.title}
                                                        </h2>
                                                        <div className="habit-list-streak-display">
                                                            <i className={`${getStreakIcon(habit.streak)} habit-list-streak-icon ${getStreakColorClass(habit.streak)} ${themeClass}`}></i>
                                                            <span className={`habit-list-streak-value ${getStreakColorClass(habit.streak)} ${themeClass}`}>
                                                                {habit.streak}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <p className={`habit-list-description ${themeClass} habit-list-mb-3`}>
                                                        {habit.description || "No description provided"}
                                                    </p>

                                                    <div className="habit-list-metadata">
                                                        <div className="habit-list-metadata-left">
                                                            <div className="habit-list-meta-item">
                                                                <i className={`ri-repeat-line habit-list-meta-icon ${themeClass}`}></i>
                                                                <span className={`habit-list-meta-text ${themeClass}`}>
                                                                    {habit.frequency}
                                                                </span>
                                                            </div>
                                                            <div className="habit-list-meta-item">
                                                                <i className={`ri-target-line habit-list-meta-icon ${themeClass}`}></i>
                                                                <span className={`habit-list-meta-text ${themeClass}`}>
                                                                    {habit.targetPerWeek || 0}/week
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="habit-list-progress-display">
                                                            <span className={`habit-list-progress-percent ${themeClass}`}>
                                                                {percentage}%
                                                            </span>
                                                            <div className={`habit-list-progress-bar-container ${themeClass}`}>
                                                                <div
                                                                    className={`habit-list-progress-bar ${themeClass}`}
                                                                    style={{ width: `${percentage}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Completion Status */}
                                                <div className={`habit-list-status-icon ${todayHistory?.completed ? 'completed' : 'incomplete'} ${themeClass}`}>
                                                    {todayHistory?.completed ? (
                                                        <i className="ri-check-line"></i>
                                                    ) : (
                                                        <i className="ri-time-line"></i>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Hover Arrow */}
                                            <div className="habit-list-hover-arrow">
                                                <i className={`ri-arrow-right-s-line ${themeClass}`}></i>
                                            </div>

                                            {/* Today's Status Badge */}
                                            {todayHistory?.completed && (
                                                <div className="habit-list-today-badge">
                                                    <span className={themeClass}>Done Today</span>
                                                </div>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </AnimatePresence>
                    )}
                </div>

                {/* Fixed Bottom Navbar */}
                <div className="habit-list-navbar">
                    <Navbar />
                </div>
            </div>
        </motion.div>
    )
}

export default HabitList;