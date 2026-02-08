import React, { useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const Habits = ({ habits, setHabits, setMaxHabit, setMinHabit, theme = 'dark' }) => {
  const days = ["S", "M", "T", "W", "T", "F", "S"];

  // Get theme from localStorage if not provided
  const currentTheme = theme || localStorage.getItem('userTheme') || 'dark';
  const isLight = currentTheme === 'light';

  // Set CSS variables based on theme
  useEffect(() => {
    if (isLight) {
      document.documentElement.style.setProperty('--streak-color-0', '#5A6D74');
      document.documentElement.style.setProperty('--streak-color-1', '#89A8B2');
      document.documentElement.style.setProperty('--streak-color-2', '#5A6D74');
      document.documentElement.style.setProperty('--streak-color-3', '#2E3944');
      document.documentElement.style.setProperty('--streak-color-4', '#212A31');
      document.documentElement.style.setProperty('--day-box-filled-from', '#89A8B2');
      document.documentElement.style.setProperty('--day-box-filled-to', '#B3C8CF');
    } else {
      document.documentElement.style.setProperty('--streak-color-0', '#748D92');
      document.documentElement.style.setProperty('--streak-color-1', '#124E66');
      document.documentElement.style.setProperty('--streak-color-2', '#2E3944');
      document.documentElement.style.setProperty('--streak-color-3', '#212A31');
      document.documentElement.style.setProperty('--streak-color-4', '#D3D9D4');
      document.documentElement.style.setProperty('--day-box-filled-from', '#124E66');
      document.documentElement.style.setProperty('--day-box-filled-to', '#748D92');
    }
  }, [isLight]);

  // Get habit type based on title
  const getHabitType = (title) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('run') || lowerTitle.includes('exercise') || lowerTitle.includes('workout') || lowerTitle.includes('gym')) {
      return 'fitness';
    } else if (lowerTitle.includes('meditate') || lowerTitle.includes('read') || lowerTitle.includes('journal') || lowerTitle.includes('pray')) {
      return 'mental';
    } else if (lowerTitle.includes('study') || lowerTitle.includes('learn') || lowerTitle.includes('practice')) {
      return 'study';
    } else if (lowerTitle.includes('water') || lowerTitle.includes('sleep') || lowerTitle.includes('eat') || lowerTitle.includes('fruit')) {
      return 'health';
    } else {
      return 'default';
    }
  };

  // Get start of current week (Sunday)
  const getStartOfWeek = () => {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday
    const start = new Date(now);
    start.setDate(now.getDate() - day);
    return start;
  };

  // Get dates of current week
  const getWeekDates = () => {
    const start = getStartOfWeek();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d.toISOString().split("T")[0];
    });
  };

  // Toggle habit completion
  const ToggleHabit = async (habitId) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/habit/${habitId}/toggle`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.status === 200) {
        setHabits((prev) =>
          prev.map((habit) =>
            habit._id === habitId ? response.data : habit
          )
        );
      }
    } catch (err) {
      console.error('Toggle failed:', err);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  // Incomplete first, completed last
  const sortedHabits = [...habits].sort((a, b) => {
    const aDone = a.history?.find(h => h.date === today)?.completed ? 1 : 0;
    const bDone = b.history?.find(h => h.date === today)?.completed ? 1 : 0;
    return aDone - bDone;
  });

  const getHabitPercentage = (habit) => {
    const total = habit.history?.length || 0;
    const completed =
      habit.history?.filter((h) => h.completed).length || 0;

    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  const getMinMaxHabitPercentage = (habits = []) => {
    let maxHabit = null;
    let minHabit = null;

    habits.forEach((habit) => {
      const history = habit?.history || [];
      if (history.length === 0) return;

      const completed = history.filter(h => h.completed).length;
      const total = history.length;
      const percentage = Math.round((completed / total) * 100);

      // MAX
      if (
        maxHabit === null ||
        percentage > maxHabit.percentage ||
        (percentage === maxHabit.percentage && completed > maxHabit.completed)
      ) {
        maxHabit = {
          name: habit.title,
          percentage,
          completed,
          total,
        };
      }

      // MIN
      if (
        minHabit === null ||
        percentage < minHabit.percentage ||
        (percentage === minHabit.percentage && completed < minHabit.completed)
      ) {
        minHabit = {
          name: habit.title,
          percentage,
          completed,
          total,
        };
      }
    });

    return { maxHabit, minHabit };
  };

  useEffect(() => {
    const result = getMinMaxHabitPercentage(habits);
    setMaxHabit(result.maxHabit);
    setMinHabit(result.minHabit);
  }, [habits]);

  // Get streak icon based on streak length
  const getStreakIcon = (streak) => {
    if (streak === 0) return 'ri-seedling-line streak-icon-seedling';
    if (streak < 3) return 'ri-leaf-line streak-icon-leaf';
    if (streak < 7) return 'ri-plant-line streak-icon-plant';
    if (streak < 14) return 'ri-tree-line streak-icon-tree';
    return 'ri-fire-fill streak-icon-fire';
  };

  // Get streak color class based on streak length
  const getStreakColorClass = (streak) => {
    if (streak === 0) return 'streak-value-0';
    if (streak < 3) return 'streak-value-1';
    if (streak < 7) return 'streak-value-2';
    if (streak < 14) return 'streak-value-3';
    return 'streak-value-4';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="habits-container"
    >
      {sortedHabits.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="empty-habits-container"
        >
          <div className={`empty-habits-icon-wrapper ${isLight ? 'empty-habits-icon-wrapper-light' : 'empty-habits-icon-wrapper-dark'}`}>
            <i className={`ri-seedling-line empty-habits-icon ${isLight ? 'empty-habits-icon-light' : 'empty-habits-icon-dark'}`}></i>
          </div>
          <p className={`empty-habits-title ${isLight ? 'empty-habits-title-light' : 'empty-habits-title-dark'}`}>
            No habits found
          </p>
          <p className={`empty-habits-text ${isLight ? 'empty-habits-text-light' : 'empty-habits-text-dark'}`}>
            Start planting the seeds of good habits by adding your first one!
          </p>
        </motion.div>
      ) : (
        <AnimatePresence>
          <div className="habits-grid">
            {sortedHabits.map((habit) => {
              const todayHistory = habit.history?.find((h) => h.date === today);
              const habitType = getHabitType(habit.title);
              const percentage = getHabitPercentage(habit);
              const isCompleted = todayHistory?.completed || false;

              return (
                <motion.div
                  key={habit._id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -2 }}
                  className={`habit-card ${isLight ? 'habit-card-light' : 'habit-card-dark'} ${isCompleted ? 'habit-card-completed' : ''}`}
                >
                  {/* Progress Background */}
                  <div
                    className={`progress-background ${isLight ? 'progress-background-light' : 'progress-background-dark'}`}
                    style={{ width: `${percentage}%` }}
                  />

                  <div className="card-content">
                    {/* Left Section: Habit Info */}
                    <div className="habit-info-section">
                      {/* Habit Icon */}
                      <div className={`habit-icon habit-icon-${habitType}${isLight ? '-light' : '-dark'}`}>
                        <i className={`ri-check-line icon-check ${isLight ? 'icon-light' : 'icon-dark'} ${isCompleted ? '' : 'icon-opacity'}`}></i>
                      </div>

                      {/* Habit Details */}
                      <div className="habit-details">
                        <div className="habit-title-row">
                          <h2 className={`habit-title ${isLight ? 'habit-title-light' : 'habit-title-dark'} ${isCompleted ? (isLight ? 'habit-title-completed-light' : 'habit-title-completed-dark') : ''}`}>
                            {habit.title}
                          </h2>
                          {isCompleted && (
                            <span className={`completed-badge ${isLight ? 'completed-badge-light' : 'completed-badge-dark'}`}>
                              Completed
                            </span>
                          )}
                        </div>

                        <div className="habit-stats">
                          {/* Streak */}
                          <div className="streak-container">
                            <i className={`${getStreakIcon(habit.streak)}`}></i>
                            <span className={`streak-value ${getStreakColorClass(habit.streak)}`}>
                              {habit.streak} day{habit.streak !== 1 ? 's' : ''}
                            </span>
                            <span className={`streak-label ${isLight ? 'streak-label-light' : 'streak-label-dark'}`}>
                              streak
                            </span>
                          </div>

                          {/* Frequency */}
                          <div className="frequency-container">
                            <i className={`ri-repeat-line frequency-icon ${isLight ? 'frequency-icon-light' : 'frequency-icon-dark'}`}></i>
                            <span className={`frequency-text ${isLight ? 'frequency-text-light' : 'frequency-text-dark'}`}>
                              {habit.frequency}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Middle Section: Progress Bar */}
                    <div className="progress-section">
                      <div className="progress-wrapper">
                        <div className="progress-bar-container">
                          <div className={`progress-bar ${isLight ? 'progress-bar-light' : 'progress-bar-dark'}`}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className={`progress-fill progress-fill-${habitType}${isLight ? '-light' : '-dark'}`}
                            />
                          </div>
                          <div className="mt-2">
                            <span className={`progress-percentage ${isLight ? 'progress-percentage-light' : 'progress-percentage-dark'}`}>
                              {percentage}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Section: Week Checkboxes and Today's Toggle */}
                    <div className="controls-section">
                      {/* Today's Toggle */}
                      <div className="today-toggle-container">
                        <span className={`today-label ${isLight ? 'today-label-light' : 'today-label-dark'}`}>
                          Today
                        </span>
                        <div className="toggle-switch">
                          <input
                            type="checkbox"
                            className="toggle-input"
                            id={`habit-${habit._id}`}
                            checked={isCompleted}
                            onChange={() => ToggleHabit(habit._id)}
                          />
                          <label
                            htmlFor={`habit-${habit._id}`}
                            className={`toggle-label ${isLight ? 'toggle-label-light' : 'toggle-label-dark'} ${isCompleted ? `habit-icon-${habitType}${isLight ? '-light' : '-dark'}` : (isLight ? 'toggle-label-off-light' : 'toggle-label-off-dark')}`}
                          >
                            <div className={`toggle-knob ${isLight ? 'toggle-knob-light' : 'toggle-knob-dark'} ${isCompleted ? 'toggle-knob-active' : 'toggle-knob-inactive'}`}></div>
                          </label>
                        </div>
                      </div>

                      {/* Weekly Progress */}
                      <div className={`week-progress-container ${isLight ? 'week-progress-container-light' : 'week-progress-container-dark'}`}>
                        <div className="week-progress-header">
                          <i className={`ri-calendar-line week-progress-icon ${isLight ? 'week-progress-icon-light' : 'week-progress-icon-dark'}`}></i>
                          <span className={`week-progress-label ${isLight ? 'week-progress-label-light' : 'week-progress-label-dark'}`}>
                            This week
                          </span>
                        </div>
                        <div className="week-days-container">
                          {getWeekDates().map((date, index) => {
                            const done = habit.history?.some((h) => h.date === date && h.completed);
                            const isToday = date === today;

                            return (
                              <div key={index} className="day-item">
                                <span className={`day-label ${isLight ? 'day-label-light' : 'day-label-dark'}`}>
                                  {days[index]}
                                </span>
                                <div className={`day-box ${isLight ? 'day-box-light' : 'day-box-dark'} ${done ? (isLight ? 'day-box-filled-light' : 'day-box-filled-dark') : (isLight ? 'day-box-empty-light' : 'day-box-empty-dark')} ${isToday ? (isLight ? 'day-box-today-light' : 'day-box-today-dark') : ''}`}>
                                  {done ? (
                                    <i className={`ri-check-line day-icon ${isLight ? 'day-icon-light' : 'day-icon-dark'}`}></i>
                                  ) : (
                                    <span className={`day-number ${isLight ? 'day-number-light' : 'day-number-dark'}`}>
                                      {new Date(date).getDate()}
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Completion Decoration */}
                  {isCompleted && (
                    <div className="completion-decoration">
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className={`decoration-circle decoration-circle-${habitType}${isLight ? '-light' : '-dark'}`}
                      >
                        <i className={`ri-check-fill decoration-icon ${isLight ? 'decoration-icon-light' : 'decoration-icon-dark'}`}></i>
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>
      )}
    </motion.div>
  );
};

export default Habits;