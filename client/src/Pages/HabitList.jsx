import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { useHabits } from '../context/HabitContext'
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const HabitList = () => {
  const { habits, setHabits } = useHabits();
  const filters = ['All', 'Daily', 'Weekly', 'Monthly'];

  const [active, setActive] = useState('All');
  const [search, setSearch] = useState('');
  const [habitID, setHabitID] = useState('');
  const [animateCard, setAnimateCard] = useState(false);

  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];

  // Nature-themed filter colors
  const filterColors = {
    All: 'from-[#4A7C3F] to-[#2D5A27]',
    Daily: 'from-[#FFD166] to-[#FFB347]',
    Weekly: 'from-[#87CEEB] to-[#3498DB]',
    Monthly: 'from-[#9B59B6] to-[#8E44AD]',
  };

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

  // Get category color
  const getCategoryColor = (title) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('run') || lowerTitle.includes('exercise') || lowerTitle.includes('workout') || lowerTitle.includes('gym')) {
      return 'bg-gradient-to-r from-[#4CAF50] to-[#2D5A27]';
    } else if (lowerTitle.includes('meditate') || lowerTitle.includes('read') || lowerTitle.includes('journal') || lowerTitle.includes('pray')) {
      return 'bg-gradient-to-r from-[#87CEEB] to-[#3498DB]';
    } else if (lowerTitle.includes('study') || lowerTitle.includes('learn') || lowerTitle.includes('practice')) {
      return 'bg-gradient-to-r from-[#9B59B6] to-[#8E44AD]';
    } else if (lowerTitle.includes('water') || lowerTitle.includes('sleep') || lowerTitle.includes('eat') || lowerTitle.includes('fruit')) {
      return 'bg-gradient-to-r from-[#FFD166] to-[#FFB347]';
    } else {
      return 'bg-gradient-to-r from-[#6B8E23] to-[#4A7C3F]';
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

  // Get streak color based on streak length
  const getStreakColor = (streak) => {
    if (streak === 0) return 'text-[#7A7A7A]';
    if (streak < 3) return 'text-[#6B8E23]';
    if (streak < 7) return 'text-[#4A7C3F]';
    if (streak < 14) return 'text-[#2D5A27]';
    return 'text-[#FFB347]';
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || token == '') {
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gradient-to-b from-[#F5E8C7] to-[#E8F5E9]"
    >
      <div className="h-screen flex flex-col overflow-hidden">

        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gradient-to-r from-[#2D5A27] to-[#4A7C3F] px-6 pt-3 pb-2"
        >
          <div className="flex flex-row justify-center items-center mb-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-white/20 to-transparent backdrop-blur-sm flex items-center justify-center mb-3">
              <i className="ri-list-check-3 text-3xl text-white"></i>
            </div>
            <div className='flex flex-col justify-start items-center'>
              <h2 className="font-['Merriweather'] text-[25px] font-bold text-white text-center">
                Your Rituals
              </h2>
              <p className="font-['Source_Sans_Pro'] text-white/80 text-center mt-1">
                Cultivate your habits, grow your life
              </p>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
            {filters.map((label) => (
              <motion.button
                key={label}
                onClick={() => setActive(label)}
                whileTap={{ scale: 0.95 }}
                className={`
                  relative px-5 py-2.5 rounded-full text-sm font-['Source_Sans_Pro'] font-semibold transition-all
                  ${active === label
                    ? 'text-white shadow-lg'
                    : 'bg-white/20 text-white/80 backdrop-blur-sm'
                  }
                `}
              >
                {active === label && (
                  <motion.div
                    layoutId="activeFilter"
                    className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent rounded-full"
                    initial={false}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {label}
                  {active === label && (
                    <i className="ri-check-line text-xs"></i>
                  )}
                </span>
              </motion.button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="px-1">
            <div className="relative flex items-center w-full h-11 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 focus-within:ring-2 focus-within:ring-white/50 transition-all">
              <i className="ri-search-line absolute left-5 text-white text-xl"></i>
              <input
                type="text"
                placeholder="Search your habits..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-full pl-14 pr-5 bg-transparent outline-none text-white placeholder-white/60 font-['Source_Sans_Pro'] text-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-5 text-white/70 hover:text-white transition"
                >
                  <i className="ri-close-line text-lg"></i>
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats Summary */}
        <div className="px-6 py-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gradient-to-r from-[#F9FBF5] to-[#F0F8E8] rounded-xl p-3 text-center border border-[#E0E6D6]">
              <p className="font-['Source_Sans_Pro'] text-[#5D6D55] text-xs mb-1">Total Habits</p>
              <p className="font-['Montserrat'] font-bold text-[#2D5A27] text-lg">{habits.length}</p>
            </div>
            <div className="bg-gradient-to-r from-[#F9FBF5] to-[#F0F8E8] rounded-xl p-3 text-center border border-[#E0E6D6]">
              <p className="font-['Source_Sans_Pro'] text-[#5D6D55] text-xs mb-1">Active Today</p>
              <p className="font-['Montserrat'] font-bold text-[#2D5A27] text-lg">
                {habits.filter(h => h.history?.some(hh => hh.date === today && hh.completed)).length}
              </p>
            </div>
            <div className="bg-gradient-to-r from-[#F9FBF5] to-[#F0F8E8] rounded-xl p-3 text-center border border-[#E0E6D6]">
              <p className="font-['Source_Sans_Pro'] text-[#5D6D55] text-xs mb-1">Streaks</p>
              <p className="font-['Montserrat'] font-bold text-[#2D5A27] text-lg">
                {habits.filter(h => h.streak > 0).length}
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Habits */}
        <div className="flex-1 mb-[85px] overflow-y-auto no-scrollbar px-6">
          {filteredHabits.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-16"
            >
              <div className="w-28 h-28 rounded-full bg-gradient-to-r from-[#F5E8C7] to-[#E8F5E9] flex items-center justify-center mb-5">
                <i className="ri-seedling-line text-5xl text-[#6B8E23]"></i>
              </div>
              <p className="font-['Merriweather'] text-[#2D5A27] text-xl mb-2">No habits found</p>
              <p className="font-['Source_Sans_Pro'] text-[#5D6D55] text-center max-w-md mb-6">
                {search ? 'Try a different search term' : 'Start cultivating your habits garden'}
              </p>
              {!search && (
                <Link
                  to="/add-habit"
                  className="px-6 py-3 bg-gradient-to-r from-[#4A7C3F] to-[#6B8E23] text-white font-['Source_Sans_Pro'] font-semibold rounded-xl hover:shadow-lg transition-all active:scale-95"
                >
                  <i className="ri-add-line mr-2"></i>
                  Add First Habit
                </Link>
              )}
            </motion.div>
          ) : (
            <AnimatePresence>
              <div className="grid grid-cols-1 gap-4 pb-4">
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
                      whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(45, 90, 39, 0.1)" }}
                      onClick={() => {
                        setHabitID(habit._id);
                        navigate(`/habit-details/${habit._id}`);
                      }}
                      className="relative bg-white rounded-2xl border border-[#E0E6D6] shadow-lg overflow-hidden cursor-pointer group"
                    >
                      {/* Progress Background */}
                      <div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#F0F8E8] to-[#E8F5E9] rounded-2xl transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />

                      <div className="relative z-10 p-5 flex items-center gap-4">
                        {/* Category Icon */}
                        <div className={`flex-shrink-0 w-16 h-16 rounded-2xl ${getCategoryColor(habit.title)} flex items-center justify-center shadow-md`}>
                          <i className={`${getHabitCategory(habit.title)} text-2xl text-white`}></i>
                        </div>

                        {/* Habit Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h2 className="font-['Merriweather'] font-bold text-[18px] text-[#2D5A27] truncate group-hover:text-[#4A7C3F] transition">
                              {habit.title}
                            </h2>
                            <div className="flex items-center gap-2">
                              <i className={`${getStreakIcon(habit.streak)} ${getStreakColor(habit.streak)} text-lg`}></i>
                              <span className={`font-['Montserrat'] font-bold ${getStreakColor(habit.streak)}`}>
                                {habit.streak}
                              </span>
                            </div>
                          </div>

                          <p className="font-['Source_Sans_Pro'] text-[#5D6D55] text-sm mb-3 line-clamp-2">
                            {habit.description || "No description provided"}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <i className="ri-repeat-line text-[#7A7A7A] text-sm"></i>
                                <span className="font-['Source_Sans_Pro'] text-[#5D6D55] text-xs">
                                  {habit.frequency}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <i className="ri-target-line text-[#7A7A7A] text-sm"></i>
                                <span className="font-['Source_Sans_Pro'] text-[#5D6D55] text-xs">
                                  {habit.targetPerWeek || 0}/week
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="font-['Source_Sans_Pro'] text-[#5D6D55] text-xs">
                                {percentage}%
                              </span>
                              <div className="w-16 h-1.5 bg-gradient-to-r from-[#F5E8C7] to-[#F0F8E8] rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-gradient-to-r from-[#4CAF50] to-[#2D5A27] transition-all duration-300"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Completion Status */}
                        <div className="flex-shrink-0 ml-2">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${todayHistory?.completed
                            ? 'bg-gradient-to-r from-[#4CAF50] to-[#2D5A27]'
                            : 'bg-gradient-to-r from-[#F5E8C7] to-[#E8F5E9]'
                            }`}>
                            {todayHistory?.completed ? (
                              <i className="ri-check-line text-white text-lg"></i>
                            ) : (
                              <i className="ri-time-line text-[#7A7A7A] text-lg"></i>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Hover Arrow */}
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <i className="ri-arrow-right-s-line text-[#4A7C3F] text-2xl"></i>
                      </div>

                      {/* Today's Status Badge */}
                      {todayHistory?.completed && (
                        <div className="absolute top-3 right-3">
                          <span className="px-2 py-1 bg-gradient-to-r from-[#4CAF50] to-[#2D5A27] text-white text-[10px] rounded-full font-['Source_Sans_Pro'] font-semibold">
                            Done Today
                          </span>
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
        <div className="fixed bottom-0 left-0 right-0 z-40">
          <Navbar />
        </div>
      </div>
    </motion.div>
  )
}

export default HabitList;