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

  // Dark theme filter colors
  const filterColors = {
    All: 'from-[#124E66] to-[#212A31]',
    Daily: 'from-[#748D92] to-[#124E66]',
    Weekly: 'from-[#2E3944] to-[#124E66]',
    Monthly: 'from-[#D3D9D4] to-[#748D92]',
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
      return 'bg-gradient-to-r from-[#124E66] to-[#2E3944]';
    } else if (lowerTitle.includes('meditate') || lowerTitle.includes('read') || lowerTitle.includes('journal') || lowerTitle.includes('pray')) {
      return 'bg-gradient-to-r from-[#748D92] to-[#124E66]';
    } else if (lowerTitle.includes('study') || lowerTitle.includes('learn') || lowerTitle.includes('practice')) {
      return 'bg-gradient-to-r from-[#D3D9D4] to-[#748D92]';
    } else if (lowerTitle.includes('water') || lowerTitle.includes('sleep') || lowerTitle.includes('eat') || lowerTitle.includes('fruit')) {
      return 'bg-gradient-to-r from-[#2E3944] to-[#124E66]';
    } else {
      return 'bg-gradient-to-r from-[#124E66] to-[#212A31]';
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
    if (streak === 0) return 'text-[#748D92]/50';
    if (streak < 3) return 'text-[#748D92]';
    if (streak < 7) return 'text-[#124E66]';
    if (streak < 14) return 'text-[#D3D9D4]';
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
      className="min-h-screen bg-gradient-to-b from-[#212A31] via-[#2E3944] to-[#124E66]"
    >
      <div className="h-screen flex flex-col overflow-hidden">

        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gradient-to-r from-[#124E66] to-[#2E3944] px-6 pt-3 pb-2"
        >
          <div className="flex flex-row gap-3 justify-center items-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#748D92]/20 to-transparent backdrop-blur-sm flex items-center justify-center mb-3">
              <i className="ri-list-check-3 text-3xl text-[#D3D9D4]"></i>
            </div>
            <div className='flex flex-col justify-start items-start'>
              <h2 className="font-['Merriweather'] text-[25px] font-bold text-[#D3D9D4] text-center">
                Your Rituals
              </h2>
              <p className="font-['Source_Sans_Pro'] text-[#748D92] text-center mt-1">
                Cultivate your habits, grow your life
              </p>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar">
            {filters.map((label) => (
              <motion.button
                key={label}
                onClick={() => setActive(label)}
                whileTap={{ scale: 0.95 }}
                className={`
                  relative px-5 py-2.5 rounded-full text-sm font-['Source_Sans_Pro'] font-semibold transition-all
                  ${active === label
                    ? 'text-[#D3D9D4] shadow-lg'
                    : 'bg-[#748D92]/20 text-[#D3D9D4]/80 backdrop-blur-sm'
                  }
                `}
              >
                {active === label && (
                  <motion.div
                    layoutId="activeFilter"
                    className="absolute inset-0 bg-gradient-to-r from-[#124E66]/30 to-transparent rounded-full"
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
            <div className="relative flex items-center w-full h-11 rounded-2xl bg-[#748D92]/20 backdrop-blur-sm border border-[#748D92]/30 focus-within:ring-2 focus-within:ring-[#124E66]/50 transition-all">
              <i className="ri-search-line absolute left-5 text-[#D3D9D4] text-xl"></i>
              <input
                type="text"
                placeholder="Search your habits..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-full pl-14 pr-5 bg-transparent outline-none text-[#D3D9D4] placeholder-[#D3D9D4]/60 font-['Source_Sans_Pro'] text-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-5 text-[#D3D9D4]/70 hover:text-[#D3D9D4] transition"
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
            <div className="bg-gradient-to-r from-[#212A31] to-[#2E3944] rounded-xl p-3 text-center border border-[#748D92]/20">
              <p className="font-['Source_Sans_Pro'] text-[#748D92] text-xs mb-1">Total Habits</p>
              <p className="font-['Montserrat'] font-bold text-[#D3D9D4] text-lg">{habits.length}</p>
            </div>
            <div className="bg-gradient-to-r from-[#212A31] to-[#2E3944] rounded-xl p-3 text-center border border-[#748D92]/20">
              <p className="font-['Source_Sans_Pro'] text-[#748D92] text-xs mb-1">Active Today</p>
              <p className="font-['Montserrat'] font-bold text-[#D3D9D4] text-lg">
                {habits.filter(h => h.history?.some(hh => hh.date === today && hh.completed)).length}
              </p>
            </div>
            <div className="bg-gradient-to-r from-[#212A31] to-[#2E3944] rounded-xl p-3 text-center border border-[#748D92]/20">
              <p className="font-['Source_Sans_Pro'] text-[#748D92] text-xs mb-1">Streaks</p>
              <p className="font-['Montserrat'] font-bold text-[#D3D9D4] text-lg">
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
              <div className="w-28 h-28 rounded-full bg-gradient-to-r from-[#212A31] to-[#2E3944] flex items-center justify-center mb-5">
                <i className="ri-seedling-line text-5xl text-[#748D92]"></i>
              </div>
              <p className="font-['Merriweather'] text-[#D3D9D4] text-xl mb-2">No habits found</p>
              <p className="font-['Source_Sans_Pro'] text-[#748D92] text-center max-w-md mb-6">
                {search ? 'Try a different search term' : 'Start cultivating your habits garden'}
              </p>
              {!search && (
                <Link
                  to="/add-habit"
                  className="px-6 py-3 bg-gradient-to-r from-[#124E66] to-[#212A31] text-[#D3D9D4] font-['Source_Sans_Pro'] font-semibold rounded-xl hover:shadow-lg hover:shadow-[#124E66]/20 transition-all active:scale-95"
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
                      whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(29, 78, 216, 0.1)" }}
                      onClick={() => {
                        setHabitID(habit._id);
                        navigate(`/habit-details/${habit._id}`);
                      }}
                      className="relative bg-gradient-to-b from-[#2E3944]/90 to-[#212A31]/90 rounded-2xl border border-[#748D92]/20 shadow-lg overflow-hidden cursor-pointer group backdrop-blur-sm"
                    >
                      {/* Progress Background */}
                      <div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#124E66]/20 to-[#212A31]/20 rounded-2xl transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />

                      <div className="relative z-10 p-5 flex items-center gap-4">
                        {/* Category Icon */}
                        <div className={`flex-shrink-0 w-16 h-16 rounded-2xl ${getCategoryColor(habit.title)} flex items-center justify-center shadow-md`}>
                          <i className={`${getHabitCategory(habit.title)} text-2xl text-[#D3D9D4]`}></i>
                        </div>

                        {/* Habit Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h2 className="font-['Merriweather'] font-bold text-[18px] text-[#D3D9D4] truncate group-hover:text-[#748D92] transition">
                              {habit.title}
                            </h2>
                            <div className="flex items-center gap-2">
                              <i className={`${getStreakIcon(habit.streak)} ${getStreakColor(habit.streak)} text-lg`}></i>
                              <span className={`font-['Montserrat'] font-bold ${getStreakColor(habit.streak)}`}>
                                {habit.streak}
                              </span>
                            </div>
                          </div>

                          <p className="font-['Source_Sans_Pro'] text-[#748D92] text-sm mb-3 line-clamp-2">
                            {habit.description || "No description provided"}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <i className="ri-repeat-line text-[#748D92] text-sm"></i>
                                <span className="font-['Source_Sans_Pro'] text-[#748D92] text-xs">
                                  {habit.frequency}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <i className="ri-target-line text-[#748D92] text-sm"></i>
                                <span className="font-['Source_Sans_Pro'] text-[#748D92] text-xs">
                                  {habit.targetPerWeek || 0}/week
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="font-['Source_Sans_Pro'] text-[#748D92] text-xs">
                                {percentage}%
                              </span>
                              <div className="w-16 h-1.5 bg-gradient-to-r from-[#212A31] to-[#2E3944] rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-gradient-to-r from-[#124E66] to-[#748D92] transition-all duration-300"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Completion Status */}
                        <div className="flex-shrink-0 ml-2">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${todayHistory?.completed
                            ? 'bg-gradient-to-r from-[#748D92] to-[#124E66]'
                            : 'bg-gradient-to-r from-[#212A31] to-[#2E3944]'
                            }`}>
                            {todayHistory?.completed ? (
                              <i className="ri-check-line text-[#D3D9D4] text-lg"></i>
                            ) : (
                              <i className="ri-time-line text-[#748D92] text-lg"></i>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Hover Arrow */}
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <i className="ri-arrow-right-s-line text-[#748D92] text-2xl"></i>
                      </div>

                      {/* Today's Status Badge */}
                      {todayHistory?.completed && (
                        <div className="absolute top-3 right-3">
                          <span className="px-2 py-1 bg-gradient-to-r from-[#748D92] to-[#124E66] text-[#D3D9D4] text-[10px] rounded-full font-['Source_Sans_Pro'] font-semibold">
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