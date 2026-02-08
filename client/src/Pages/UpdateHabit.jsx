import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { useHabits } from '../context/HabitContext'
import { motion, AnimatePresence } from 'framer-motion'

const UpdateHabit = () => {
    const { id } = useParams()
    const { habits, theme, toggleTheme } = useHabits() // Assuming theme context exists
    const habit = habits.find(h => h._id === id)

    const [description, setDescription] = useState('')
    const [frequency, setFrequency] = useState('')
    const [targetPerWeek, setTargetPerWeek] = useState(0)
    const [category, setCategory] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const navigate = useNavigate()

    // Get current theme
    const currentTheme = localStorage.getItem('userTheme');
    const themeClass = currentTheme === 'light' ? 'light-theme' : 'dark-theme';

    // Habit categories with icons
    const categories = [
        {
            id: 'health',
            label: 'Health & Fitness',
            icon: '💪',
            lightColor: 'from-[#89A8B2] to-[#B3C8CF]',
            darkColor: 'from-[#124E66] to-[#2E3944]'
        },
        {
            id: 'mind',
            label: 'Mind & Wellness',
            icon: '🧠',
            lightColor: 'from-[#B3C8CF] to-[#89A8B2]',
            darkColor: 'from-[#748D92] to-[#124E66]'
        },
        {
            id: 'learning',
            label: 'Learning',
            icon: '📚',
            lightColor: 'from-[#E5E1DA] to-[#B3C8CF]',
            darkColor: 'from-[#D3D9D4] to-[#748D92]'
        },
        {
            id: 'productivity',
            label: 'Productivity',
            icon: '⚡',
            lightColor: 'from-[#F1F0E8] to-[#E5E1DA]',
            darkColor: 'from-[#2E3944] to-[#124E66]'
        },
        {
            id: 'social',
            label: 'Social & Relationships',
            icon: '👥',
            lightColor: 'from-[#FFB6B6] to-[#FF6B6B]',
            darkColor: 'from-[#FF6B6B] to-[#E74C3C]'
        },
        {
            id: 'other',
            label: 'Other',
            icon: '🌿',
            lightColor: 'from-[#B3C8CF] to-[#89A8B2]',
            darkColor: 'from-[#124E66] to-[#212A31]'
        },
    ]

    // Frequency options
    const frequencyOptions = [
        { value: 'daily', label: 'Daily', description: 'Every day', icon: '🌅' },
        { value: 'weekly', label: 'Weekly', description: 'Several times a week', icon: '📅' },
        { value: 'monthly', label: 'Monthly', description: 'Once a month', icon: '🗓️' },
    ]

    // Initialize form with habit data
    useEffect(() => {
        if (habit) {
            setDescription(habit.description || '')
            setFrequency(habit.frequency || '')
            setTargetPerWeek(habit.targetPerWeek || 0)
            setCategory(habit.category || '')
        }
    }, [habit])

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            navigate('/login')
        }
    }, [navigate])

    const submitHandler = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess('')

        // Validation
        if (!frequency) {
            setError('Please select a frequency')
            setLoading(false)
            return
        }

        if (!category) {
            setError('Please select a category')
            setLoading(false)
            return
        }

        try {
            const updatedHabit = {
                description: description.trim(),
                frequency,
                targetPerWeek,
                category
            }

            const response = await axios.put(
                `${import.meta.env.VITE_BASE_URL}/habit/${habit._id}`,
                updatedHabit,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            )

            if (response.status === 200) {
                setSuccess('Habit updated successfully!')
                setTimeout(() => {
                    navigate(-1)
                }, 1500)
            }
        } catch (err) {
            console.error('Error updating habit:', err)
            setError('Failed to update habit. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    // Get category color based on theme
    const getCategoryColor = () => {
        const selectedCat = categories.find(c => c.id === category)
        return selectedCat ? selectedCat[`${currentTheme}Color`] :
            (currentTheme === 'light' ? 'from-[#89A8B2] to-[#B3C8CF]' : 'from-[#124E66] to-[#212A31]')
    }

    // Get category icon
    const getCategoryIcon = () => {
        const selectedCat = categories.find(c => c.id === category)
        return selectedCat ? selectedCat.icon : '🌿'
    }

    // Get category button class
    const getCategoryClass = (cat) => {
        const baseClass = `update-habit-category-btn update-habit-category-${cat.id}`;
        return category === cat.id ? `${baseClass} selected ${themeClass}` : `${baseClass} ${themeClass}`;
    }

    // Get frequency button class
    const getFrequencyClass = (freq) => {
        const baseClass = 'update-habit-frequency-btn';
        return frequency === freq.value ? `${baseClass} selected ${themeClass}` : `${baseClass} ${themeClass}`;
    }

    // Capitalize first letter
    const capitalizeFirst = (str) => {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    if (!habit) {
        return (
            <div className={`update-habit-container update-habit-not-found ${themeClass}`}>
                <div className="update-habit-text-center">
                    <div className={`update-habit-not-found-icon ${themeClass}`}>
                        <span>🔍</span>
                    </div>
                    <h2 className={`update-habit-not-found-title ${themeClass} update-habit-mb-2`}>Habit not found</h2>
                    <button
                        onClick={() => navigate(-1)}
                        className={`update-habit-not-found-btn ${themeClass}`}
                    >
                        Go Back
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className={`update-habit-container ${themeClass}`}>
            {/* Theme Toggle Button */}
            <button
                onClick={toggleTheme}
                className={`update-habit-theme-toggle ${themeClass}`}
            >
                {currentTheme === 'light' ? '🌙' : '☀️'}
            </button>

            {/* Decorative elements */}
            <div className="update-habit-decorative">
                <div className={`update-habit-decorative-circle-1 ${themeClass}`}></div>
                <div className={`update-habit-decorative-circle-2 ${themeClass}`}></div>
            </div>

            <div className="update-habit-main">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`update-habit-header ${themeClass}`}
                >
                    <div className="update-habit-flex update-habit-items-center update-habit-gap-4 update-habit-mb-6">
                        <button
                            onClick={() => navigate(-1)}
                            className={`update-habit-back-btn ${themeClass}`}
                        >
                            <span>←</span>
                        </button>
                        <div>
                            <h1 className={`update-habit-header-text ${themeClass}`}>
                                Edit Habit
                            </h1>
                            <p className={`update-habit-header-subtext ${themeClass}`}>
                                Nurture and refine your growth
                            </p>
                        </div>
                    </div>

                    {/* Habit Preview */}
                    <div className={`update-habit-preview ${themeClass}`}>
                        <div className="update-habit-preview-content">
                            <div className={`update-habit-preview-icon`} style={{ background: `linear-gradient(to right, ${getCategoryColor()})` }}>
                                <span>{getCategoryIcon()}</span>
                            </div>
                            <div className="update-habit-preview-text">
                                <h2 className={`update-habit-preview-title ${themeClass}`}>
                                    {habit.title}
                                </h2>
                                <p className={`update-habit-preview-streak ${themeClass}`}>
                                    Current streak: {habit.streak || 0} days
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="update-habit-form-container"
                >
                    <div className={`update-habit-form-wrapper ${themeClass}`}>
                        {/* Messages */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className={`update-habit-message update-habit-error ${themeClass}`}
                                >
                                    <div className="update-habit-message-content">
                                        <div className={`update-habit-message-icon ${themeClass}`}>
                                            <span>{currentTheme === 'light' ? '⚠️' : '!'}</span>
                                        </div>
                                        <p className={`update-habit-message-text ${themeClass}`}>
                                            {error}
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            {success && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className={`update-habit-message update-habit-success ${themeClass}`}
                                >
                                    <div className="update-habit-message-content">
                                        <div className={`update-habit-message-icon ${themeClass}`}>
                                            <span>{currentTheme === 'light' ? '✅' : '✓'}</span>
                                        </div>
                                        <p className={`update-habit-message-text ${themeClass}`}>
                                            {success}
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={submitHandler} className="update-habit-form">
                            {/* Description Input */}
                            <div className="update-habit-form-group">
                                <label className={`update-habit-label ${themeClass}`}>
                                    Why this habit?
                                </label>
                                <div className="update-habit-relative">
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Update why this habit is important to you..."
                                        rows="3"
                                        className={`update-habit-textarea ${themeClass}`}
                                    />
                                </div>
                            </div>

                            {/* Category Selection */}
                            <div className="update-habit-form-group">
                                <label className={`update-habit-label ${themeClass}`}>
                                    Category
                                </label>
                                <div className="update-habit-categories-grid">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            type="button"
                                            onClick={() => setCategory(cat.id)}
                                            className={getCategoryClass(cat)}
                                        >
                                            <span className="update-habit-category-icon">{cat.icon}</span>
                                            <span className="update-habit-category-label">
                                                {cat.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Frequency Selection */}
                            <div className="update-habit-form-group">
                                <label className={`update-habit-label ${themeClass}`}>
                                    Frequency
                                </label>
                                <div className="update-habit-frequency-grid">
                                    {frequencyOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => setFrequency(option.value)}
                                            className={getFrequencyClass(option)}
                                        >
                                            <span className="update-habit-frequency-icon">
                                                {option.icon}
                                            </span>
                                            <span className="update-habit-frequency-label">
                                                {option.label}
                                            </span>
                                            <span className={`update-habit-frequency-desc ${themeClass}`}>
                                                {option.description}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Target per Week */}
                            <div className="update-habit-form-group">
                                <label className={`update-habit-label ${themeClass}`}>
                                    Weekly Target
                                </label>
                                <div className={`update-habit-target-section ${themeClass}`}>
                                    <div className="update-habit-target-header update-habit-mb-4">
                                        <div>
                                            <p className={`update-habit-target-label ${themeClass}`}>
                                                Target days per week
                                            </p>
                                            <p className={`update-habit-target-hint ${themeClass}`}>
                                                Adjust based on your current progress
                                            </p>
                                        </div>
                                        <div className="update-habit-target-display">
                                            <span className={`update-habit-target-value ${themeClass}`}>
                                                {targetPerWeek}
                                            </span>
                                            <span className={`update-habit-target-unit ${themeClass}`}>
                                                days
                                            </span>
                                        </div>
                                    </div>

                                    <div className="update-habit-target-controls">
                                        <button
                                            type="button"
                                            onClick={() => setTargetPerWeek(prev => Math.max(1, prev - 1))}
                                            className={`update-habit-target-btn ${themeClass}`}
                                        >
                                            -
                                        </button>

                                        <div className={`update-habit-progress-track ${themeClass}`}>
                                            <div
                                                className={`update-habit-progress-fill ${themeClass}`}
                                                style={{ width: `${(targetPerWeek / 7) * 100}%` }}
                                            />
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => setTargetPerWeek(prev => Math.min(7, prev + 1))}
                                            className={`update-habit-target-btn ${themeClass}`}
                                        >
                                            +
                                        </button>
                                    </div>

                                    {/* Current vs Target */}
                                    <div className="update-habit-target-footer">
                                        <span>Current: {habit.streak || 0} day streak</span>
                                        <span>Target: {targetPerWeek}/week</span>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Summary */}
                            <div className={`update-habit-stats ${themeClass}`}>
                                <h3 className={`update-habit-stats-title ${themeClass}`}>
                                    Current Progress
                                </h3>
                                <div className="update-habit-stats-grid">
                                    <div className="update-habit-stat-item">
                                        <p className={`update-habit-stat-label ${themeClass}`}>Current Streak</p>
                                        <p className={`update-habit-stat-value ${themeClass}`}>{habit.streak || 0} days</p>
                                    </div>
                                    <div className="update-habit-stat-item">
                                        <p className={`update-habit-stat-label ${themeClass}`}>Best Streak</p>
                                        <p className={`update-habit-stat-value ${themeClass}`}>{habit.longestStreak || 0} days</p>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <motion.button
                                type="submit"
                                disabled={loading || !frequency || !category}
                                whileTap={{ scale: loading ? 1 : 0.98 }}
                                className={`update-habit-submit-btn ${themeClass}`}
                            >
                                {loading ? (
                                    <div className="update-habit-flex update-habit-items-center update-habit-justify-center update-habit-gap-3">
                                        <div className={`update-habit-spinner ${themeClass}`}></div>
                                        <span>Updating habit...</span>
                                    </div>
                                ) : (
                                    <>
                                        <span>Save Changes</span>
                                        <div className="update-habit-submit-icon">
                                            <span>🌿</span>
                                        </div>
                                    </>
                                )}
                            </motion.button>
                        </form>

                        {/* Tips */}
                        <div className={`update-habit-tips ${themeClass}`}>
                            <div className="update-habit-tips-header update-habit-mb-3">
                                <div className={`update-habit-tips-icon ${themeClass}`}>
                                    <span>💡</span>
                                </div>
                                <h3 className={`update-habit-tips-title ${themeClass}`}>
                                    Editing Tips
                                </h3>
                            </div>
                            <p className={`update-habit-tips-text ${themeClass}`}>
                                Adjust your target based on your current streak. If you're consistently hitting your target, consider increasing it by 1-2 days. If you're struggling, it's okay to lower the target to build consistency.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default UpdateHabit