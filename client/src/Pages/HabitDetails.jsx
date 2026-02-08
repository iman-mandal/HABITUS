import { useParams, useNavigate } from 'react-router-dom'
import { useHabits } from '../context/HabitContext'
import Navbar from '../components/Navbar'
import CalendarView from '../components/CalendarView'
import axios from 'axios'
import { useState } from 'react'
import { useUser } from '../context/UserContext'

const HabitDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { habits, fetchHabits } = useHabits()
    const { user } = useUser()
    const [deleteConfirmTost, setDeleteConfirmTost] = useState(false)

    // Get current theme
    const currentTheme = localStorage.getItem('userTheme') || user?.theme || 'dark'
    const themeClass = currentTheme === 'light' ? 'light-theme' : 'dark-theme'

    const habit = habits.find(h => h._id === id)

    if (!habit) {
        return (
            <div className={`habit-details-not-found ${themeClass}`}>
                <div className={`habit-details-not-found-icon ${themeClass}`}>
                    <i className="ri-search-eye-line habit-details-text-xl"></i>
                </div>
                <p className={`habit-details-not-found-text ${themeClass}`}>Habit not found</p>
                <button
                    onClick={() => navigate(-1)}
                    className={`habit-details-not-found-btn ${themeClass}`}
                >
                    Go Back
                </button>
            </div>
        )
    }

    const deleteHabit = async () => {
        try {
            const response = await axios.delete(
                `${import.meta.env.VITE_BASE_URL}/habit/${habit._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            if(response.status===200){
                await fetchHabits();
                console.log('Habit deleted successfully:', response.data);
            }

        } catch (err) {
            console.log('Delete failed:', err.response?.data || err.message);
        }
    };

    // Get category icon based on title
    const getCategoryIcon = (title) => {
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

    // Calculate habit completion percentage
    const calculateCompletion = () => {
        const total = habit.history?.length || 0;
        const completed = habit.history?.filter(h => h.completed).length || 0;
        if (total === 0) return 0;
        return Math.round((completed / total) * 100);
    };

    const completionPercentage = calculateCompletion();

    // Capitalize first letter
    const capitalizeFirst = (str) => {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    // Format date for display
    const formatDate = (date) => {
        const dateObj = new Date(Number(date));
        return dateObj.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <div className={`habit-details-container ${themeClass}`}>

            {/* Header (Fixed) */}
            <div className={`habit-details-header ${themeClass}`}>
                <button
                    onClick={() => navigate(-1)}
                    className={`habit-details-back-btn ${themeClass}`}
                >
                    <i className="ri-arrow-left-line"></i>
                </button>
                <h2 className={`habit-details-header-title ${themeClass}`}>
                    Habit Details
                </h2>
            </div>

            {/* Scrollable Content */}
            <div className="habit-details-content">

                {/* Main Habit Card */}
                <div className={`habit-details-main-card ${themeClass}`}>
                    <div className="habit-details-card-header">
                        <div className="habit-details-flex habit-details-items-center habit-details-gap-4">
                            <div className={`habit-details-title-icon ${themeClass}`}>
                                <i className={`${getCategoryIcon(habit.title)}`}></i>
                            </div>
                            <div>
                                <h2 className={`habit-details-title ${themeClass}`}>
                                    {habit.title}
                                </h2>
                                <p className={`habit-details-description ${themeClass} habit-details-mt-1`}>
                                    {habit.description || "No description provided"}
                                </p>
                            </div>
                        </div>

                        {/* Completion Badge */}
                        <div className="habit-details-flex habit-details-flex-col habit-details-items-center">
                            <div className={`habit-details-completion-badge ${themeClass}`}>
                                <span className={`habit-details-completion-percent ${themeClass}`}>
                                    {completionPercentage}%
                                </span>
                            </div>
                            <span className={`habit-details-completion-label ${themeClass}`}>Completion</span>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className={`habit-details-divider ${themeClass}`}></div>

                    {/* Stats Grid */}
                    <div className="habit-details-stats-grid">
                        <div className={`habit-details-stat-card ${themeClass}`}>
                            <div className="habit-details-flex habit-details-items-center habit-details-gap-3">
                                <div className={`habit-details-stat-icon ${themeClass}`}>
                                    <i className="ri-fire-line"></i>
                                </div>
                                <div>
                                    <p className={`habit-details-stat-label ${themeClass}`}>Current Streak</p>
                                    <p className={`habit-details-stat-value ${themeClass}`}>{habit.streak} days</p>
                                </div>
                            </div>
                        </div>

                        <div className={`habit-details-stat-card ${themeClass}`}>
                            <div className="habit-details-flex habit-details-items-center habit-details-gap-3">
                                <div className={`habit-details-stat-icon ${themeClass}`}>
                                    <i className="ri-trophy-line"></i>
                                </div>
                                <div>
                                    <p className={`habit-details-stat-label ${themeClass}`}>Longest Streak</p>
                                    <p className={`habit-details-stat-value ${themeClass}`}>{habit.longestStreak} days</p>
                                </div>
                            </div>
                        </div>

                        <div className={`habit-details-stat-card ${themeClass}`}>
                            <div className="habit-details-flex habit-details-items-center habit-details-gap-3">
                                <div className={`habit-details-stat-icon ${themeClass}`}>
                                    <i className="ri-repeat-line"></i>
                                </div>
                                <div>
                                    <p className={`habit-details-stat-label ${themeClass}`}>Frequency</p>
                                    <p className={`habit-details-stat-value ${themeClass}`}>
                                        {capitalizeFirst(habit.frequency)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className={`habit-details-stat-card ${themeClass}`}>
                            <div className="habit-details-flex habit-details-items-center habit-details-gap-3">
                                <div className={`habit-details-stat-icon ${themeClass}`}>
                                    <i className="ri-flag-line"></i>
                                </div>
                                <div>
                                    <p className={`habit-details-stat-label ${themeClass}`}>Weekly Target</p>
                                    <p className={`habit-details-stat-value ${themeClass}`}>
                                        {habit.targetPerWeek}/week
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="habit-details-action-buttons">
                    <button
                        onClick={() => navigate(`/habit/update/${habit._id}`)}
                        className={`habit-details-action-btn habit-details-edit-btn ${themeClass}`}
                    >
                        <i className="ri-edit-2-line"></i>
                        Edit Habit
                    </button>

                    <button
                        onClick={() => setDeleteConfirmTost(true)}
                        className={`habit-details-action-btn habit-details-delete-btn ${themeClass}`}
                    >
                        <i className="ri-delete-bin-5-line"></i>
                        Delete Habit
                    </button>
                </div>

                {/* Details Grid */}
                <div className="habit-details-details-grid">
                    {/* Calendar Section */}
                    <div className={`habit-details-calendar-section ${themeClass}`}>
                        <div className="habit-details-flex habit-details-items-center habit-details-gap-2 habit-details-mb-6">
                            <div className={`habit-details-section-icon ${themeClass}`}>
                                <i className="ri-calendar-2-line"></i>
                            </div>
                            <h3 className={`habit-details-section-title ${themeClass}`}>
                                Habit Calendar
                            </h3>
                        </div>
                        <CalendarView history={habit.history || []} theme={currentTheme} />
                    </div>

                    {/* Additional Details */}
                    <div className={`habit-details-additional-section ${themeClass}`}>
                        <div className="habit-details-flex habit-details-items-center habit-details-gap-3 habit-details-mb-6">
                            <div className={`habit-details-section-icon ${themeClass}`}>
                                <i className="ri-information-line"></i>
                            </div>
                            <h3 className={`habit-details-section-title ${themeClass}`}>
                                Additional Details
                            </h3>
                        </div>

                        <div className="habit-details-space-y-4">
                            <div className={`habit-details-detail-item ${themeClass}`}>
                                <div className="habit-details-flex habit-details-items-center habit-details-gap-3">
                                    <i className={`ri-calendar-event-line habit-details-detail-icon ${themeClass}`}></i>
                                    <span className={`habit-details-detail-label ${themeClass}`}>Start Date</span>
                                </div>
                                <span className={`habit-details-detail-value ${themeClass}`}>
                                    {formatDate(habit.startDate)}
                                </span>
                            </div>

                            <div className={`habit-details-detail-item ${themeClass}`}>
                                <div className="habit-details-flex habit-details-items-center habit-details-gap-3">
                                    <i className={`ri-history-line habit-details-detail-icon ${themeClass}`}></i>
                                    <span className={`habit-details-detail-label ${themeClass}`}>Total Days</span>
                                </div>
                                <span className={`habit-details-detail-value ${themeClass}`}>
                                    {habit.history?.length || 0}
                                </span>
                            </div>

                            <div className={`habit-details-detail-item ${themeClass}`}>
                                <div className="habit-details-flex habit-details-items-center habit-details-gap-3">
                                    <i className={`ri-check-double-line habit-details-detail-icon ${themeClass}`}></i>
                                    <span className={`habit-details-detail-label ${themeClass}`}>Completed Days</span>
                                </div>
                                <span className={`habit-details-detail-value ${themeClass}`}>
                                    {habit.history?.filter(h => h.completed).length || 0}
                                </span>
                            </div>

                            <div className={`habit-details-detail-item ${themeClass}`}>
                                <div className="habit-details-flex habit-details-items-center habit-details-gap-3">
                                    <i className={`ri-trending-up-line habit-details-detail-icon ${themeClass}`}></i>
                                    <span className={`habit-details-detail-label ${themeClass}`}>Consistency Rate</span>
                                </div>
                                <span className={`habit-details-detail-value ${themeClass}`}>
                                    {completionPercentage}%
                                </span>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="habit-details-progress-container habit-details-mt-8">
                            <div className="habit-details-progress-header">
                                <span className={`habit-details-progress-label ${themeClass}`}>Overall Progress</span>
                                <span className={`habit-details-detail-value ${themeClass}`}>
                                    {completionPercentage}%
                                </span>
                            </div>
                            <div className={`habit-details-progress-track ${themeClass}`}>
                                <div
                                    className={`habit-details-progress-fill ${themeClass}`}
                                    style={{ width: `${completionPercentage}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirmTost && (
                <div className="habit-details-modal-overlay">
                    <div className={`habit-details-modal ${themeClass}`}>
                        <div className="habit-details-modal-content">
                            <div className={`habit-details-modal-icon ${themeClass}`}>
                                <i className="ri-delete-bin-5-line"></i>
                            </div>

                            <h3 className={`habit-details-modal-title ${themeClass}`}>
                                Delete Habit
                            </h3>

                            <p className={`habit-details-modal-text ${themeClass} habit-details-leading-relaxed`}>
                                Are you sure you want to delete "{habit.title}"? This action cannot be undone and all progress will be lost.
                            </p>

                            <div className="habit-details-modal-buttons">
                                <button
                                    onClick={() => setDeleteConfirmTost(false)}
                                    className={`habit-details-modal-btn habit-details-modal-cancel ${themeClass}`}
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={() => {
                                        setDeleteConfirmTost(false)
                                        deleteHabit()
                                        navigate(-1)
                                    }}
                                    className={`habit-details-modal-btn habit-details-modal-delete ${themeClass}`}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom Navbar */}
            <div className="habit-details-navbar">
                <Navbar />
            </div>
        </div>
    )
}

export default HabitDetails