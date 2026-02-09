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


  // Theme configuration
  const themeConfig = {
    light: {
      // Main background
      bgGradient: 'bg-gradient-to-b from-[#F1F0E8] via-[#E5E1DA] to-[#B3C8CF]',
      headerGradient: 'from-[#89A8B2] to-[#B3C8CF]',

      // Text colors
      primaryText: 'text-[#2E3944]',
      secondaryText: 'text-[#5A6D74]',
      accentText: 'text-[#89A8B2]',

      // Card backgrounds
      cardBg: 'bg-gradient-to-b from-white/90 to-[#F1F0E8]/90',
      cardBorder: 'border-[#B3C8CF]/40',
      innerCardBg: 'bg-gradient-to-r from-[#F1F0E8] to-[#E5E1DA]',

      // Filter colors
      filterColors: {
        All: 'from-[#89A8B2] to-[#5A6D74]',
        Daily: 'from-[#B3C8CF] to-[#89A8B2]',
        Weekly: 'from-[#5A6D74] to-[#89A8B2]',
        Monthly: 'from-[#E5E1DA] to-[#B3C8CF]',
      },

      // Search bar
      searchBg: 'bg-[#B3C8CF]/20',
      searchBorder: 'border-[#B3C8CF]/40',
      searchText: 'text-[#2E3944]',
      searchPlaceholder: 'placeholder-[#2E3944]/60',

      // Habit category colors
      categoryColors: {
        fitness: 'bg-gradient-to-r from-[#89A8B2] to-[#5A6D74]',
        mental: 'bg-gradient-to-r from-[#B3C8CF] to-[#89A8B2]',
        study: 'bg-gradient-to-r from-[#E5E1DA] to-[#B3C8CF]',
        health: 'bg-gradient-to-r from-[#5A6D74] to-[#89A8B2]',
        default: 'bg-gradient-to-r from-[#89A8B2] to-[#2E3944]',
      },

      // Streak colors
      streakColors: {
        0: 'text-[#5A6D74]/50',
        1: 'text-[#5A6D74]',
        2: 'text-[#89A8B2]',
        3: 'text-[#2E3944]',
        4: 'text-[#FF9A8B]',
      },

      // Progress bars
      progressBg: 'bg-gradient-to-r from-[#E5E1DA] to-[#F1F0E8]',
      progressFill: 'from-[#89A8B2] to-[#B3C8CF]',

      // Status badges
      completedBadge: 'bg-gradient-to-r from-[#B3C8CF] to-[#89A8B2]',
      incompleteBadge: 'bg-gradient-to-r from-[#F1F0E8] to-[#E5E1DA]',

      // Stats cards
      statsCardBg: 'bg-gradient-to-r from-[#F1F0E8] to-[#E5E1DA]',
      statsCardBorder: 'border-[#B3C8CF]/30',

      // Empty state
      emptyStateIcon: 'bg-gradient-to-r from-[#F1F0E8] to-[#E5E1DA]',

      // Progress background
      progressBackground: 'bg-gradient-to-r from-[#89A8B2]/20 to-[#B3C8CF]/20',
    },
    dark: {
      // Main background
      bgGradient: 'bg-gradient-to-b from-[#212A31] via-[#2E3944] to-[#124E66]',
      headerGradient: 'from-[#124E66] to-[#2E3944]',

      // Text colors
      primaryText: 'text-[#D3D9D4]',
      secondaryText: 'text-[#748D92]',
      accentText: 'text-[#748D92]',

      // Card backgrounds
      cardBg: 'bg-gradient-to-b from-[#2E3944]/90 to-[#212A31]/90',
      cardBorder: 'border-[#748D92]/20',
      innerCardBg: 'bg-gradient-to-r from-[#212A31] to-[#2E3944]',

      // Filter colors
      filterColors: {
        All: 'from-[#124E66] to-[#212A31]',
        Daily: 'from-[#748D92] to-[#124E66]',
        Weekly: 'from-[#2E3944] to-[#124E66]',
        Monthly: 'from-[#D3D9D4] to-[#748D92]',
      },

      // Search bar
      searchBg: 'bg-[#748D92]/20',
      searchBorder: 'border-[#748D92]/30',
      searchText: 'text-[#D3D9D4]',
      searchPlaceholder: 'placeholder-[#D3D9D4]/60',

      // Habit category colors
      categoryColors: {
        fitness: 'bg-gradient-to-r from-[#124E66] to-[#2E3944]',
        mental: 'bg-gradient-to-r from-[#748D92] to-[#124E66]',
        study: 'bg-gradient-to-r from-[#D3D9D4] to-[#748D92]',
        health: 'bg-gradient-to-r from-[#2E3944] to-[#124E66]',
        default: 'bg-gradient-to-r from-[#124E66] to-[#212A31]',
      },

      // Streak colors
      streakColors: {
        0: 'text-[#748D92]/50',
        1: 'text-[#748D92]',
        2: 'text-[#124E66]',
        3: 'text-[#D3D9D4]',
        4: 'text-[#FFB347]',
      },

      // Progress bars
      progressBg: 'bg-gradient-to-r from-[#212A31] to-[#2E3944]',
      progressFill: 'from-[#124E66] to-[#748D92]',

      // Status badges
      completedBadge: 'bg-gradient-to-r from-[#748D92] to-[#124E66]',
      incompleteBadge: 'bg-gradient-to-r from-[#212A31] to-[#2E3944]',

      // Stats cards
      statsCardBg: 'bg-gradient-to-r from-[#212A31] to-[#2E3944]',
      statsCardBorder: 'border-[#748D92]/20',

      // Empty state
      emptyStateIcon: 'bg-gradient-to-r from-[#212A31] to-[#2E3944]',

      // Progress background
      progressBackground: 'bg-gradient-to-r from-[#124E66]/20 to-[#212A31]/20',
    }
  };

  // Get current theme from user context
  const storedTheme = localStorage.getItem('userTheme');
  const currentTheme = storedTheme === 'dark' ? 'dark' : 'light';
  const theme = themeConfig[currentTheme];



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
      return theme.categoryColors.fitness;
    } else if (lowerTitle.includes('meditate') || lowerTitle.includes('read') || lowerTitle.includes('journal') || lowerTitle.includes('pray')) {
      return theme.categoryColors.mental;
    } else if (lowerTitle.includes('study') || lowerTitle.includes('learn') || lowerTitle.includes('practice')) {
      return theme.categoryColors.study;
    } else if (lowerTitle.includes('water') || lowerTitle.includes('sleep') || lowerTitle.includes('eat') || lowerTitle.includes('fruit')) {
      return theme.categoryColors.health;
    } else {
      return theme.categoryColors.default;
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
    if (streak === 0) return theme.streakColors[0];
    if (streak < 3) return theme.streakColors[1];
    if (streak < 7) return theme.streakColors[2];
    if (streak < 14) return theme.streakColors[3];
    return theme.streakColors[4];
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`min-h-screen ${theme.bgGradient}`}
    >
      <div className="h-screen flex flex-col overflow-hidden">

        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`bg-gradient-to-r ${theme.headerGradient} px-6 pt-3 pb-2`}
        >
          <div className="flex flex-row gap-3 justify-center items-center">
            <div className={`w-16 h-16 rounded-full ${currentTheme === 'light' ? 'bg-[#B3C8CF]/20' : 'bg-[#748D92]/20'} backdrop-blur-sm flex items-center justify-center mb-3`}>
              <i className={`ri-list-check-3 text-3xl ${theme.primaryText}`}></i>
            </div>
            <div className='flex flex-col justify-start items-start'>
              <h2 className={`font-['Merriweather'] text-[25px] font-bold ${theme.primaryText} text-center`}>
                Your Rituals
              </h2>
              <p className={`font-['Source_Sans_Pro'] ${theme.secondaryText} text-center mt-1`}>
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
                    ? `${theme.primaryText} shadow-lg`
                    : `${currentTheme === 'light' ? 'bg-[#B3C8CF]/20' : 'bg-[#748D92]/20'} ${currentTheme === 'light' ? 'text-[#2E3944]/80' : 'text-[#D3D9D4]/80'} backdrop-blur-sm`
                  }
                `}
              >
                {active === label && (
                  <motion.div
                    layoutId="activeFilter"
                    className={`absolute inset-0 bg-gradient-to-r ${currentTheme === 'light' ? 'from-[#89A8B2]/30' : 'from-[#124E66]/30'} to-transparent rounded-full`}
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
          <div className="px-0 mt-0">
            <div className={`relative flex items-center w-full h-11 rounded-2xl ${theme.searchBg} backdrop-blur-sm border ${theme.searchBorder} focus-within:ring-2 ${currentTheme === 'light' ? 'focus-within:ring-[#89A8B2]/50' : 'focus-within:ring-[#124E66]/50'} transition-all`}>
              <i className={`ri-search-line absolute left-5 ${theme.searchText} text-xl`}></i>
              <input
                type="text"
                placeholder="Search your habits..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full h-full pl-14 pr-5 bg-transparent outline-none ${theme.searchText} ${theme.searchPlaceholder} font-['Source_Sans_Pro'] text-sm`}
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className={`absolute right-5 ${currentTheme === 'light' ? 'text-[#2E3944]/70 hover:text-[#2E3944]' : 'text-[#D3D9D4]/70 hover:text-[#D3D9D4]'} transition`}
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
            <div className={`${theme.statsCardBg} rounded-xl p-3 text-center border ${theme.statsCardBorder}`}>
              <p className={`font-['Source_Sans_Pro'] ${theme.secondaryText} text-xs mb-1`}>Total Habits</p>
              <p className={`font-['Montserrat'] font-bold ${theme.primaryText} text-lg`}>{habits.length}</p>
            </div>
            <div className={`${theme.statsCardBg} rounded-xl p-3 text-center border ${theme.statsCardBorder}`}>
              <p className={`font-['Source_Sans_Pro'] ${theme.secondaryText} text-xs mb-1`}>Active Today</p>
              <p className={`font-['Montserrat'] font-bold ${theme.primaryText} text-lg`}>
                {habits.filter(h => h.history?.some(hh => hh.date === today && hh.completed)).length}
              </p>
            </div>
            <div className={`${theme.statsCardBg} rounded-xl p-3 text-center border ${theme.statsCardBorder}`}>
              <p className={`font-['Source_Sans_Pro'] ${theme.secondaryText} text-xs mb-1`}>Streaks</p>
              <p className={`font-['Montserrat'] font-bold ${theme.primaryText} text-lg`}>
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
              <div className={`w-28 h-28 rounded-full ${theme.emptyStateIcon} flex items-center justify-center mb-5`}>
                <i className={`ri-seedling-line text-5xl ${theme.secondaryText}`}></i>
              </div>
              <p className={`font-['Merriweather'] ${theme.primaryText} text-xl mb-2`}>No habits found</p>
              <p className={`font-['Source_Sans_Pro'] ${theme.secondaryText} text-center max-w-md mb-6`}>
                {search ? 'Try a different search term' : 'Start cultivating your habits garden'}
              </p>
              {!search && (
                <Link
                  to="/add-habit"
                  className={`px-6 py-3 ${currentTheme === 'light' ? 'bg-gradient-to-r from-[#89A8B2] to-[#5A6D74]' : 'bg-gradient-to-r from-[#124E66] to-[#212A31]'} ${theme.primaryText} font-['Source_Sans_Pro'] font-semibold rounded-xl hover:shadow-lg ${currentTheme === 'light' ? 'hover:shadow-[#89A8B2]/20' : 'hover:shadow-[#124E66]/20'} transition-all active:scale-95`}
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
                      whileHover={{ y: -2, boxShadow: `0 10px 25px -5px ${currentTheme === 'light' ? 'rgba(137, 168, 178, 0.1)' : 'rgba(29, 78, 216, 0.1)'}` }}
                      onClick={() => {
                        setHabitID(habit._id);
                        navigate(`/habit-details/${habit._id}`);
                      }}
                      className={`relative ${theme.cardBg} rounded-2xl border ${theme.cardBorder} shadow-lg overflow-hidden cursor-pointer group backdrop-blur-sm`}
                    >
                      {/* Progress Background */}
                      <div
                        className={`absolute top-0 left-0 h-full ${theme.progressBackground} rounded-2xl transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />

                      <div className="relative z-10 p-5 flex items-center gap-4">
                        {/* Category Icon */}
                        <div className={`flex-shrink-0 w-16 h-16 rounded-2xl ${getCategoryColor(habit.title)} flex items-center justify-center shadow-md`}>
                          <i className={`${getHabitCategory(habit.title)} text-2xl ${theme.primaryText}`}></i>
                        </div>

                        {/* Habit Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h2 className={`font-['Merriweather'] font-bold text-[18px] ${theme.primaryText} truncate transition ${currentTheme === 'light' ? 'group-hover:text-[#5A6D74]' : 'group-hover:text-[#748D92]'}`}>
                              {habit.title}
                            </h2>
                            <div className="flex items-center gap-2">
                              <i className={`${getStreakIcon(habit.streak)} ${getStreakColor(habit.streak)} text-lg`}></i>
                              <span className={`font-['Montserrat'] font-bold ${getStreakColor(habit.streak)}`}>
                                {habit.streak}
                              </span>
                            </div>
                          </div>

                          <p className={`font-['Source_Sans_Pro'] ${theme.secondaryText} text-sm mb-3 line-clamp-2`}>
                            {habit.description || "No description provided"}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <i className={`ri-repeat-line ${theme.secondaryText} text-sm`}></i>
                                <span className={`font-['Source_Sans_Pro'] ${theme.secondaryText} text-xs`}>
                                  {habit.frequency}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <i className={`ri-target-line ${theme.secondaryText} text-sm`}></i>
                                <span className={`font-['Source_Sans_Pro'] ${theme.secondaryText} text-xs`}>
                                  {habit.targetPerWeek || 0}/week
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className={`font-['Source_Sans_Pro'] ${theme.secondaryText} text-xs`}>
                                {percentage}%
                              </span>
                              <div className={`w-16 h-1.5 ${theme.progressBg} rounded-full overflow-hidden`}>
                                <div
                                  className={`h-full rounded-full bg-gradient-to-r ${theme.progressFill} transition-all duration-300`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Completion Status */}
                        <div className="flex-shrink-0 ml-2">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${todayHistory?.completed
                            ? theme.completedBadge
                            : theme.incompleteBadge
                            }`}>
                            {todayHistory?.completed ? (
                              <i className={`ri-check-line ${theme.primaryText} text-lg`}></i>
                            ) : (
                              <i className={`ri-time-line ${theme.secondaryText} text-lg`}></i>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Hover Arrow */}
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <i className={`ri-arrow-right-s-line ${theme.secondaryText} text-2xl`}></i>
                      </div>

                      {/* Today's Status Badge */}
                      {todayHistory?.completed && (
                        <div className="absolute top-3 right-3">
                          <span className={`px-2 py-1 ${theme.completedBadge} ${theme.primaryText} text-[10px] rounded-full font-['Source_Sans_Pro'] font-semibold`}>
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