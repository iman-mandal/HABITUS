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

  // Theme colors
  const themeColors = {
    light: {
      backgroundGradient: "bg-gradient-to-b from-[#F1F0E8] via-[#E5E1DA] to-[#B3C8CF]",
      headerGradient: "from-[#89A8B2] via-[#B3C8CF] to-[#E5E1DA]",
      categoryColors: {
        fitness: 'linear-gradient(135deg, #89A8B2, #6E97A3)',
        mental: 'linear-gradient(135deg, #B3C8CF, #98B7C0)',
        study: 'linear-gradient(135deg, #E5E1DA, #C9C0B5)',
        health: 'linear-gradient(135deg, #F1F0E8, #D5D3C5)',
        other: 'linear-gradient(135deg, #D9E4E8, #B8D0D6)'
      }
    },
    dark: {
      backgroundGradient: "bg-gradient-to-b from-[#0F1A23] via-[#1A2832] to-[#124E66]",
      headerGradient: "from-[#124E66] via-[#1E3A52] to-[#2E3944]",
      categoryColors: {
        fitness: 'linear-gradient(135deg, #124E66, #0A3A4D)',
        mental: 'linear-gradient(135deg, #748D92, #5A757B)',
        study: 'linear-gradient(135deg, #D3D9D4, #B8C2B9)',
        health: 'linear-gradient(135deg, #2E3944, #1E2832)',
        other: 'linear-gradient(135deg, #212A31, #151E25)'
      }
    }
  }

  const colors = themeColors[currentTheme]

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`min-h-screen ${colors.backgroundGradient}`}
    >
      {/* Floating Theme Toggle */}
      <motion.button
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        whileHover={{ scale: 1.1, rotate: 180 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleTheme}
        className={`fixed top-6 right-6 z-50 w-12 h-12 rounded-2xl backdrop-blur-lg border 
          ${currentTheme === 'light' ? 'border-white/40' : 'border-[#2E3944]/40'} 
          ${currentTheme === 'light' ? 'shadow-lg shadow-[#89A8B2]/10' : 'shadow-xl shadow-[#124E66]/15'}
          flex items-center justify-center text-xl transition-all duration-300`}
        style={{
          background: currentTheme === 'light'
            ? 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(240,240,240,0.7))'
            : 'linear-gradient(135deg, rgba(30,41,59,0.9), rgba(15,23,42,0.7))'
        }}
      >
        {currentTheme === 'light' ? '🌙' : '☀️'}
      </motion.button>

      {/* Enhanced HEADER */}
      <div className={`relative bg-gradient-to-r ${colors.headerGradient} px-6 pt-8 pb-8 overflow-hidden`}>
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
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
              className="absolute w-[1px] h-[1px] bg-white/10 rounded-full"
              style={{ left: `${Math.random() * 100}%` }}
            />
          ))}
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <div className='flex flex-row gap-3'>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 15 }}
              className={`w-20 h-20 rounded-3xl mb-4 backdrop-blur-sm border 
              ${currentTheme === 'light' ? 'border-white/40' : 'border-[#2E3944]/40'} 
              ${currentTheme === 'light'
                  ? 'bg-gradient-to-br from-white/40 to-[#F1F0E8]/30'
                  : 'bg-gradient-to-br from-[#1E3A52]/40 to-[#124E66]/30'} flex items-center justify-center`}
            >
              <i className={`ri-bar-chart-2-fill text-4xl ${currentTheme === 'light' ? 'text-[#2E3944]' : 'text-white'}`}></i>
            </motion.div>
            <div className='flex flex-col items-start'>
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="font-['Merriweather'] text-4xl font-bold text-white text-center mb-2"
              >
                Habit Analytics
              </motion.h2>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="font-['Source_Sans_Pro'] text-white/90 text-center mb-6"
              >
                Track your growth, nurture your progress
              </motion.p>
            </div>
          </div>
          {/* Enhanced Time Range Selector */}
          <div className="flex gap-3 overflow-hidden no-scrollbar">
            {['week', 'month', 'quarter', 'year'].map((range) => (
              <motion.button
                key={range}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTimeRange(range)}
                className={`px-5 py-2.5 rounded-xl text-sm font-['Source_Sans_Pro'] font-semibold 
                  transition-all duration-300 backdrop-blur-sm border 
                  ${currentTheme === 'light' ? 'border-white/40' : 'border-[#2E3944]/40'}
                  ${timeRange === range
                    ? (currentTheme === 'light'
                      ? 'bg-gradient-to-r from-[#89A8B2] to-[#B3C8CF] text-white shadow-lg'
                      : 'bg-gradient-to-r from-[#124E66] to-[#1E3A52] text-white shadow-lg')
                    : (currentTheme === 'light'
                      ? 'bg-white/60 text-[#5A6D77] hover:shadow-md'
                      : 'bg-[#1E3A52]/40 text-[#A3B8C8] hover:shadow-md')
                  }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
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
        className="px-6 py-8 -mt-6 relative z-20"
      >
        {/* Stats Header with Time Range */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl backdrop-blur-sm border 
              ${currentTheme === 'light' ? 'border-white/40' : 'border-[#2E3944]/40'}
              ${currentTheme === 'light'
                ? 'bg-gradient-to-br from-[#B3C8CF]/20 to-[#89A8B2]/20'
                : 'bg-gradient-to-br from-[#748D92]/30 to-[#124E66]/30'} flex items-center justify-center`}
            >
              <i className={`ri-dashboard-fill text-xl ${currentTheme === 'light' ? 'text-[#2E3944]' : 'text-white'}`}></i>
            </div>
            <div>
              <h3 className={`font-['Merriweather'] text-2xl font-bold ${currentTheme === 'light' ? 'text-[#2E3944]' : 'text-white'}`}>
                {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)} Performance
              </h3>
              <p className={`font-['Source_Sans_Pro'] ${currentTheme === 'light' ? 'text-[#5A6D77]' : 'text-[#A3B8C8]'} text-sm`}>
                Key metrics for the selected period
              </p>
            </div>
          </div>

          {/* Time Range Indicator */}
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-sm border 
            ${currentTheme === 'light' ? 'border-white/40' : 'border-[#2E3944]/40'}
            ${currentTheme === 'light'
              ? 'bg-gradient-to-br from-white/40 to-white/20'
              : 'bg-gradient-to-br from-[#1E3A52]/40 to-[#0F1A23]/40'}`}
          >
            <i className={`ri-calendar-line ${currentTheme === 'light' ? 'text-[#5A6D77]' : 'text-[#A3B8C8]'}`}></i>
            <span className={`font-['Source_Sans_Pro'] font-semibold ${currentTheme === 'light' ? 'text-[#2E3944]' : 'text-white'}`}>
              {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
            subtext={`${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)} performance`}
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
        <div className="flex flex-col mb-8 items-center">
          <HabitDistributionCard timeRange={timeRange} user={user} habits={habits} theme={currentTheme} />
        </div>

        {/* PERFORMANCE GRAPH */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl backdrop-blur-sm border 
                ${currentTheme === 'light' ? 'border-white/40' : 'border-[#2E3944]/40'}
                ${currentTheme === 'light'
                  ? 'bg-gradient-to-br from-[#B3C8CF]/20 to-[#89A8B2]/20'
                  : 'bg-gradient-to-br from-[#748D92]/30 to-[#124E66]/30'} flex items-center justify-center`}
              >
                <i className={`ri-line-chart-fill text-xl ${currentTheme === 'light' ? 'text-[#2E3944]' : 'text-white'}`}></i>
              </div>
              <div>
                <h3 className={`font-['Merriweather'] text-2xl font-bold ${currentTheme === 'light' ? 'text-[#2E3944]' : 'text-white'}`}>
                  Performance Trend
                </h3>
                <p className={`font-['Source_Sans_Pro'] ${currentTheme === 'light' ? 'text-[#5A6D77]' : 'text-[#A3B8C8]'} text-sm`}>
                  Visualize your habit completion over time
                </p>
              </div>
            </div>

            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-sm border 
              ${currentTheme === 'light' ? 'border-white/40' : 'border-[#2E3944]/40'}
              ${currentTheme === 'light'
                ? 'bg-gradient-to-br from-white/40 to-white/20'
                : 'bg-gradient-to-br from-[#1E3A52]/40 to-[#0F1A23]/40'}`}
            >
              <i className={`ri-calendar-line ${currentTheme === 'light' ? 'text-[#5A6D77]' : 'text-[#A3B8C8]'}`}></i>
              <span className={`font-['Source_Sans_Pro'] font-semibold ${currentTheme === 'light' ? 'text-[#2E3944]' : 'text-white'}`}>
                {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}
              </span>
            </div>
          </div>

          <div className={`rounded-3xl p-6 backdrop-blur-sm 
            ${currentTheme === 'light' ? 'shadow-lg shadow-[#89A8B2]/10' : 'shadow-xl shadow-[#124E66]/15'} 
            border ${currentTheme === 'light' ? 'border-white/40' : 'border-[#2E3944]/40'}
            ${currentTheme === 'light'
              ? 'bg-gradient-to-br from-white/40 to-white/20'
              : 'bg-gradient-to-br from-[#1A2832]/80 to-[#0F1A23]/80'}`}
          >
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
        >
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-12 h-12 rounded-2xl backdrop-blur-sm border 
              ${currentTheme === 'light' ? 'border-white/40' : 'border-[#2E3944]/40'}
              ${currentTheme === 'light'
                ? 'bg-gradient-to-br from-[#89A8B2]/20 to-[#F1F0E8]/20'
                : 'bg-gradient-to-br from-[#124E66]/30 to-[#212A31]/30'} flex items-center justify-center`}
            >
              <i className={`ri-lightbulb-flash-fill text-xl ${currentTheme === 'light' ? 'text-[#2E3944]' : 'text-white'}`}></i>
            </div>
            <div>
              <h3 className={`font-['Merriweather'] text-2xl font-bold ${currentTheme === 'light' ? 'text-[#2E3944]' : 'text-white'}`}>
                Growth Insights
              </h3>
              <p className={`font-['Source_Sans_Pro'] ${currentTheme === 'light' ? 'text-[#5A6D77]' : 'text-[#A3B8C8]'} text-sm`}>
                Personalized recommendations based on your {timeRange} data
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-[100px]">
            <InsightCard
              icon="ri-bar-chart-line"
              title={`${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)} Consistency`}
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
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <Navbar />
      </div>
    </motion.div>
  )
}

export default Analytics