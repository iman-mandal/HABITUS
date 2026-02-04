import React, { useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const Habits = ({ habits, setHabits, setMaxHabit, setMinHabit }) => {
  const days = ["S", "M", "T", "W", "T", "F", "S"];

  // Nature-themed colors for different habit types
  const habitTypeColors = {
    fitness: 'from-[#4CAF50] to-[#2D5A27]',
    mental: 'from-[#87CEEB] to-[#3498DB]',
    study: 'from-[#9B59B6] to-[#8E44AD]',
    health: 'from-[#FFD166] to-[#FFB347]',
    default: 'from-[#6B8E23] to-[#4A7C3F]',
  };

  // Get color based on habit title
  const getHabitColor = (title) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('run') || lowerTitle.includes('exercise') || lowerTitle.includes('workout') || lowerTitle.includes('gym')) {
      return habitTypeColors.fitness;
    } else if (lowerTitle.includes('meditate') || lowerTitle.includes('read') || lowerTitle.includes('journal') || lowerTitle.includes('pray')) {
      return habitTypeColors.mental;
    } else if (lowerTitle.includes('study') || lowerTitle.includes('learn') || lowerTitle.includes('practice')) {
      return habitTypeColors.study;
    } else if (lowerTitle.includes('water') || lowerTitle.includes('sleep') || lowerTitle.includes('eat') || lowerTitle.includes('fruit')) {
      return habitTypeColors.health;
    } else {
      return habitTypeColors.default;
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
    if (streak === 0) return 'text-[#7A7A7A]';
    if (streak < 3) return 'text-[#6B8E23]';
    if (streak < 7) return 'text-[#4A7C3F]';
    if (streak < 14) return 'text-[#2D5A27]';
    return 'text-[#FFB347]';
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
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#F5E8C7] to-[#E8F5E9] flex items-center justify-center mb-4">
            <i className="ri-seedling-line text-4xl text-[#6B8E23]"></i>
          </div>
          <p className="font-['Merriweather'] text-[#2D5A27] text-xl mb-2">No habits found</p>
          <p className="font-['Source_Sans_Pro'] text-[#5D6D55] text-center max-w-md">
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
                  whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(45, 90, 39, 0.1)" }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className={`relative bg-white rounded-2xl border border-[#E0E6D6] shadow-lg overflow-hidden
                    ${isCompleted ? "opacity-90" : ""}
                  `}
                >
                  {/* Progress Background */}
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#F0F8E8] to-[#E8F5E9] rounded-2xl transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />

                  <div className="relative z-10 p-5 flex flex-col md:flex-row items-center justify-between gap-4">

                    {/* Left Section: Habit Info */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {/* Habit Icon */}
                      <div className={`flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-r ${habitColor} flex items-center justify-center shadow-md`}>
                        <i className={`ri-check-line text-2xl text-white ${isCompleted ? "" : "opacity-80"}`}></i>
                      </div>

                      {/* Habit Details */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h2 className={`font-['Merriweather'] font-bold text-[18px] truncate ${isCompleted ? "line-through text-[#7A7A7A]" : "text-[#2D5A27]"}`}>
                            {habit.title}
                          </h2>
                          {isCompleted && (
                            <span className="flex-shrink-0 px-2 py-1 bg-gradient-to-r from-[#4CAF50] to-[#2D5A27] text-white text-xs rounded-full">
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
                            <span className="font-['Source_Sans_Pro'] text-[#7A7A7A] text-sm">streak</span>
                          </div>

                          {/* Frequency */}
                          <div className="flex items-center gap-2">
                            <i className="ri-repeat-line text-[#5D6D55]"></i>
                            <span className="font-['Source_Sans_Pro'] text-[#5D6D55] text-sm">
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
                          <div className="h-3 bg-gradient-to-r from-[#F5E8C7] to-[#F0F8E8] rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className={`h-full rounded-full bg-gradient-to-r ${habitColor} shadow-sm`}
                            />
                          </div>
                          <div className="flex justify-between mt-2">
                           
                            <span className="font-['Montserrat'] font-bold text-[#2D5A27]">
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
                        <span className="font-['Source_Sans_Pro'] text-[#5D6D55] text-sm hidden md:block">
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
                            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ${isCompleted ? 'bg-gradient-to-r from-[#4CAF50] to-[#2D5A27]' : 'bg-gradient-to-r from-[#F5E8C7] to-[#E8F5E9]'}`}
                          >
                            <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${isCompleted ? 'translate-x-6' : 'translate-x-0'}`}></div>
                          </label>
                        </div>
                      </div>

                      {/* Weekly Progress */}
                      <div className="bg-gradient-to-r from-[#F9FBF5] to-[#F0F8E8] rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <i className="ri-calendar-line text-[#5D6D55]"></i>
                          <span className="font-['Source_Sans_Pro'] text-[#5D6D55] text-sm">
                            This week
                          </span>
                        </div>
                        <div className="flex gap-2">
                          {getWeekDates().map((date, index) => {
                            const done = habit.history?.some((h) => h.date === date && h.completed);
                            const isToday = date === today;

                            return (
                              <div key={index} className="flex flex-col items-center">
                                <span className="font-['Source_Sans_Pro'] text-[11px] text-[#7A7A7A] mb-1">
                                  {days[index]}
                                </span>
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300
                                  ${done ? 'bg-gradient-to-r from-[#4CAF50] to-[#2D5A27]' : 'bg-gradient-to-r from-[#F5E8C7] to-[#E8F5E9]'}
                                  ${isToday && !done ? 'ring-2 ring-[#FFD166]' : ''}
                                  ${isToday && done ? 'ring-2 ring-white' : ''}
                                `}>
                                  {done ? (
                                    <i className="ri-check-line text-white text-sm"></i>
                                  ) : (
                                    <span className="text-[#7A7A7A] text-xs">{new Date(date).getDate()}</span>
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
                        className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FFD166] to-[#FFB347] flex items-center justify-center shadow-lg"
                      >
                        <i className="ri-check-fill text-white text-sm"></i>
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