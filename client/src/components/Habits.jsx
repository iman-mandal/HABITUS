import React, { useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const Habits = ({ habits, setHabits, setMaxHabit, setMinHabit, theme = 'dark' }) => {
  const days = ["S", "M", "T", "W", "T", "F", "S"];

  // Theme configuration
  const themeConfig = {
    light: {
      // Backgrounds
      cardBg: 'bg-gradient-to-br from-white to-[#F1F0E8]',
      cardBorder: 'border-[#B3C8CF]/50',
      innerCardBg: 'bg-gradient-to-r from-[#F1F0E8] to-[#E5E1DA]',
      progressBg: 'bg-gradient-to-r from-[#E5E1DA] to-[#F1F0E8]',
      toggleBgOff: 'bg-gradient-to-r from-[#F1F0E8] to-[#E5E1DA]',
      weekBoxBg: 'bg-gradient-to-r from-[#F1F0E8] to-[#E5E1DA]',
      weekBoxBorder: 'border-[#B3C8CF]/40',
      
      // Text colors
      primaryText: 'text-[#2E3944]',
      secondaryText: 'text-[#5A6D74]',
      completedText: 'text-[#5A6D74]/70',
      
      // Habit type colors
      habitTypeColors: {
        fitness: 'from-[#89A8B2] to-[#B3C8CF]',
        mental: 'from-[#5A6D74] to-[#2E3944]',
        study: 'from-[#B3C8CF] to-[#89A8B2]',
        health: 'from-[#FF9A8B] to-[#FF6B6B]',
        default: 'from-[#89A8B2] to-[#5A6D74]',
      },
      
      // Streak colors
      streakColors: {
        0: 'text-[#5A6D74]',
        1: 'text-[#89A8B2]',
        2: 'text-[#5A6D74]',
        3: 'text-[#2E3944]',
        4: 'text-[#212A31]',
      },
      
      // Icons
      iconColor: 'text-[#2E3944]',
      toggleKnob: 'bg-[#2E3944]',
      
      // Progress background
      progressBackground: 'bg-gradient-to-r from-[#89A8B2]/20 to-[#B3C8CF]/20',
      
      // Badges
      completedBadge: 'bg-gradient-to-r from-[#89A8B2] to-[#B3C8CF] text-[#2E3944]',
    },
    dark: {
      // Backgrounds
      cardBg: 'bg-gradient-to-br from-[#2E3944] to-[#212A31]',
      cardBorder: 'border-[#748D92]/30',
      innerCardBg: 'bg-gradient-to-r from-[#212A31] to-[#2E3944]',
      progressBg: 'bg-gradient-to-r from-[#212A31] to-[#2E3944]',
      toggleBgOff: 'bg-gradient-to-r from-[#212A31] to-[#2E3944]',
      weekBoxBg: 'bg-gradient-to-r from-[#212A31] to-[#2E3944]',
      weekBoxBorder: 'border-[#748D92]/30',
      
      // Text colors
      primaryText: 'text-[#D3D9D4]',
      secondaryText: 'text-[#748D92]',
      completedText: 'text-[#748D92]/70',
      
      // Habit type colors
      habitTypeColors: {
        fitness: 'from-[#124E66] to-[#748D92]',
        mental: 'from-[#2E3944] to-[#212A31]',
        study: 'from-[#748D92] to-[#124E66]',
        health: 'from-[#8B0000] to-[#B22222]',
        default: 'from-[#124E66] to-[#2E3944]',
      },
      
      // Streak colors
      streakColors: {
        0: 'text-[#748D92]',
        1: 'text-[#124E66]',
        2: 'text-[#2E3944]',
        3: 'text-[#212A31]',
        4: 'text-[#D3D9D4]',
      },
      
      // Icons
      iconColor: 'text-[#D3D9D4]',
      toggleKnob: 'bg-[#D3D9D4]',
      
      // Progress background
      progressBackground: 'bg-gradient-to-r from-[#291b3b] to-[#061829]',
      
      // Badges
      completedBadge: 'bg-gradient-to-r from-[#124E66] to-[#748D92] text-[#D3D9D4]',
    }
  };

  const currentTheme = themeConfig[theme];

  // Get color based on habit title
  const getHabitColor = (title) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('run') || lowerTitle.includes('exercise') || lowerTitle.includes('workout') || lowerTitle.includes('gym')) {
      return currentTheme.habitTypeColors.fitness;
    } else if (lowerTitle.includes('meditate') || lowerTitle.includes('read') || lowerTitle.includes('journal') || lowerTitle.includes('pray')) {
      return currentTheme.habitTypeColors.mental;
    } else if (lowerTitle.includes('study') || lowerTitle.includes('learn') || lowerTitle.includes('practice')) {
      return currentTheme.habitTypeColors.study;
    } else if (lowerTitle.includes('water') || lowerTitle.includes('sleep') || lowerTitle.includes('eat') || lowerTitle.includes('fruit')) {
      return currentTheme.habitTypeColors.health;
    } else {
      return currentTheme.habitTypeColors.default;
    }
  };

  // start of current week (Sunday)
  const getStartOfWeek = () => {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday
    const start = new Date(now);
    start.setDate(now.getDate() - day);
    return start;
  };

  // dates of current week
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
    if (streak === 0) return 'ri-seedling-line';
    if (streak < 3) return 'ri-leaf-line';
    if (streak < 7) return 'ri-plant-line';
    if (streak < 14) return 'ri-tree-line';
    return 'ri-fire-fill';
  };

  // Get streak color based on streak length
  const getStreakColor = (streak) => {
    if (streak === 0) return currentTheme.streakColors[0];
    if (streak < 3) return currentTheme.streakColors[1];
    if (streak < 7) return currentTheme.streakColors[2];
    if (streak < 14) return currentTheme.streakColors[3];
    return currentTheme.streakColors[4];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="py-2"
    >
      {sortedHabits.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-12"
        >
          <div className={`w-24 h-24 rounded-full ${currentTheme.innerCardBg} flex items-center justify-center mb-4 border ${currentTheme.cardBorder}`}>
            <i className={`ri-seedling-line text-4xl ${currentTheme.secondaryText}`}></i>
          </div>
          <p className={`font-['Merriweather'] ${currentTheme.primaryText} text-xl mb-2`}>No habits found</p>
          <p className={`font-['Source_Sans_Pro'] ${currentTheme.secondaryText} text-center max-w-md`}>
            Start planting the seeds of good habits by adding your first one!
          </p>
        </motion.div>
      ) : (
        <AnimatePresence>
          <div className="grid grid-cols-1 gap-4">
            {sortedHabits.map((habit) => {
              const todayHistory = habit.history?.find((h) => h.date === today);
              const habitColor = getHabitColor(habit.title);
              const percentage = getHabitPercentage(habit);
              const isCompleted = todayHistory?.completed || false;

              return (
                <motion.div
                  key={habit._id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -2, boxShadow: `0 10px 25px -5px ${theme === 'light' ? 'rgba(137, 168, 178, 0.1)' : 'rgba(18, 78, 102, 0.1)'}` }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className={`relative ${currentTheme.cardBg} rounded-2xl border ${currentTheme.cardBorder} shadow-lg overflow-hidden
                    ${isCompleted ? "opacity-90" : ""}
                  `}
                >
                  {/* Progress Background */}
                  <div
                    className={`absolute top-0 left-0 h-full ${currentTheme.progressBackground} rounded-2xl transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />

                  <div className="relative z-10 p-5 flex flex-col md:flex-row items-center justify-between gap-4">

                    {/* Left Section: Habit Info */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {/* Habit Icon */}
                      <div className={`flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-r ${habitColor} flex items-center justify-center shadow-md border ${currentTheme.cardBorder}`}>
                        <i className={`ri-check-line text-2xl ${currentTheme.iconColor} ${isCompleted ? "" : "opacity-80"}`}></i>
                      </div>

                      {/* Habit Details */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h2 className={`font-['Merriweather'] font-bold text-[18px] truncate ${isCompleted ? `line-through ${currentTheme.completedText}` : currentTheme.primaryText}`}>
                            {habit.title}
                          </h2>
                          {isCompleted && (
                            <span className={`flex-shrink-0 px-2 py-1 ${currentTheme.completedBadge} text-xs rounded-full border ${currentTheme.cardBorder}`}>
                              Completed
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4">
                          {/* Streak */}
                          <div className="flex items-center gap-2">
                            <i className={`${getStreakIcon(habit.streak)} ${getStreakColor(habit.streak)}`}></i>
                            <span className={`font-['Montserrat'] font-bold ${getStreakColor(habit.streak)}`}>
                              {habit.streak} day{habit.streak !== 1 ? 's' : ''}
                            </span>
                            <span className={`font-['Source_Sans_Pro'] ${currentTheme.secondaryText} text-sm`}>streak</span>
                          </div>

                          {/* Frequency */}
                          <div className="flex items-center gap-2">
                            <i className={`ri-repeat-line ${currentTheme.secondaryText}`}></i>
                            <span className={`font-['Source_Sans_Pro'] ${currentTheme.secondaryText} text-sm`}>
                              {habit.frequency}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Middle Section: Progress Bar */}
                    <div className="flex-1 max-w-md">
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className={`h-3 ${currentTheme.progressBg} rounded-full overflow-hidden border ${currentTheme.cardBorder}`}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className={`h-full rounded-full bg-gradient-to-r ${habitColor} shadow-sm`}
                            />
                          </div>
                          <div className="flex justify-between mt-2">
                            <span className={`font-['Montserrat'] font-bold ${currentTheme.primaryText}`}>
                              {percentage}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Section: Week Checkboxes and Today's Toggle */}
                    <div className="flex flex-col items-end gap-4">
                      {/* Today's Toggle */}
                      <div className="flex items-center gap-3">
                        <span className={`font-['Source_Sans_Pro'] ${currentTheme.secondaryText} text-sm hidden md:block`}>
                          Today
                        </span>
                        <div className="relative">
                          <input
                            type="checkbox"
                            className="sr-only"
                            id={`habit-${habit._id}`}
                            checked={isCompleted}
                            onChange={() => ToggleHabit(habit._id)}
                          />
                          <label
                            htmlFor={`habit-${habit._id}`}
                            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 border ${currentTheme.cardBorder} ${isCompleted ? `bg-gradient-to-r ${habitColor}` : currentTheme.toggleBgOff}`}
                          >
                            <div className={`${currentTheme.toggleKnob} w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${isCompleted ? 'translate-x-6' : 'translate-x-0'}`}></div>
                          </label>
                        </div>
                      </div>

                      {/* Weekly Progress */}
                      <div className={`${currentTheme.weekBoxBg} rounded-xl p-3 border ${currentTheme.weekBoxBorder}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <i className={`ri-calendar-line ${currentTheme.secondaryText}`}></i>
                          <span className={`font-['Source_Sans_Pro'] ${currentTheme.secondaryText} text-sm`}>
                            This week
                          </span>
                        </div>
                        <div className="flex gap-2">
                          {getWeekDates().map((date, index) => {
                            const done = habit.history?.some((h) => h.date === date && h.completed);
                            const isToday = date === today;

                            return (
                              <div key={index} className="flex flex-col items-center">
                                <span className={`font-['Source_Sans_Pro'] text-[11px] ${currentTheme.secondaryText} mb-1`}>
                                  {days[index]}
                                </span>
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 border ${currentTheme.weekBoxBorder}
                                  ${done ? `bg-gradient-to-r ${habitColor}` : currentTheme.weekBoxBg}
                                  ${isToday && !done ? `ring-2 ${theme === 'light' ? 'ring-[#2E3944]' : 'ring-[#D3D9D4]'}` : ''}
                                  ${isToday && done ? `ring-2 ${theme === 'light' ? 'ring-[#2E3944]' : 'ring-[#D3D9D4]'}` : ''}
                                `}>
                                  {done ? (
                                    <i className={`ri-check-line ${currentTheme.iconColor} text-sm`}></i>
                                  ) : (
                                    <span className={`${currentTheme.secondaryText} text-xs`}>{new Date(date).getDate()}</span>
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
                    <div className="absolute top-4 right-4">
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className={`w-8 h-8 rounded-full bg-gradient-to-r ${habitColor} flex items-center justify-center shadow-lg border ${currentTheme.cardBorder}`}
                      >
                        <i className={`ri-check-fill ${currentTheme.iconColor} text-sm`}></i>
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