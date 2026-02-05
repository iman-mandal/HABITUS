import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import HabitAreaChatGraph from '../components/HabitAreaChatGraph'
import StatCard from '../components/StatCard'
import CategoryCard from '../components/CategoryCard'
import InsightCard from '../components/InsightCard'
import EmptyStateCard from '../components/EmptyStateCard'
import { useHabits } from '../context/HabitContext'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart'
import HabitDistributionCard from '../components/HabitDistributionCard'

const Analytics = () => {
  const navigate = useNavigate()
  const { habits, setHabits, toggleTheme } = useHabits()
  const [timeRange, setTimeRange] = useState('week')
  const [bestCategory, setBestCategory] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)

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

  const calculateOverallAverage = (habits) => {
    if (!habits || habits.length === 0) return 0
    let totalCompleted = 0
    let totalTarget = 0

    habits.forEach(habit => {
      const completedCount = habit.history?.filter(h => h.completed).length || 0
      totalCompleted += completedCount
      totalTarget += habit.history?.length || 0
    })

    if (totalTarget === 0) return 0
    return Math.round((totalCompleted / totalTarget) * 100)
  }

  const calculateTotalStreaks = (habits) => {
    if (!habits || habits.length === 0) return 0
    return habits.reduce((total, habit) => total + (habit.streak || 0), 0)
  }

  const calculateActiveStreaks = (habits) => {
    if (!habits || habits.length === 0) return 0
    return habits.filter(habit => (habit.streak || 0) >= 3).length
  }

  const getCategoryData = (habits) => {
    const categories = {
      fitness: { count: 0, completed: 0, color: colors.categoryColors.fitness, icon: 'ri-run-line' },
      mental: { count: 0, completed: 0, color: colors.categoryColors.mental, icon: 'ri-brain-line' },
      study: { count: 0, completed: 0, color: colors.categoryColors.study, icon: 'ri-book-open-line' },
      health: { count: 0, completed: 0, color: colors.categoryColors.health, icon: 'ri-heart-pulse-line' },
      other: { count: 0, completed: 0, color: colors.categoryColors.other, icon: 'ri-star-line' }
    }

    habits.forEach(habit => {
      const title = habit.title?.toLowerCase() || ''
      const completed = habit.history?.filter(h => h.completed).length || 0
      const total = habit.history?.length || 0

      if (title.includes('run') || title.includes('exercise') || title.includes('workout') || title.includes('gym')) {
        categories.fitness.count += 1
        categories.fitness.completed += completed
      } else if (title.includes('meditate') || title.includes('read') || title.includes('journal') || title.includes('pray')) {
        categories.mental.count += 1
        categories.mental.completed += completed
      } else if (title.includes('study') || title.includes('learn') || title.includes('practice')) {
        categories.study.count += 1
        categories.study.completed += completed
      } else if (title.includes('water') || title.includes('sleep') || title.includes('eat') || title.includes('fruit')) {
        categories.health.count += 1
        categories.health.completed += completed
      } else {
        categories.other.count += 1
        categories.other.completed += completed
      }
    })

    return Object.entries(categories)
      .filter(([_, data]) => data.count > 0)
      .map(([category, data], index) => ({
        id: index,
        label: category.charAt(0).toUpperCase() + category.slice(1),
        value: data.count,
        color: data.color,
        icon: data.icon,
        completed: data.completed,
        percentage: data.count > 0 ? Math.round((data.completed / (data.count * 30)) * 100) : 0
      }))
  }

  const getBestCategory = (habits) => {
    const categories = getCategoryData(habits)
    if (categories.length === 0) return ''
    return categories.reduce((prev, current) =>
      (prev.percentage > current.percentage) ? prev : current
    )
  }

  useEffect(() => {
    if (habits.length > 0) {
      const bestCat = getBestCategory(habits)
      setBestCategory(bestCat)
    }
  }, [habits, currentTheme])

  const pieData = getCategoryData(habits)
  const completionRate = calculateOverallAverage(habits)
  const totalStreaks = calculateTotalStreaks(habits)
  const activeStreaks = calculateActiveStreaks(habits)

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

      {/* STATS OVERVIEW - Using StatCard Component */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="px-6 py-8 -mt-6 relative z-20"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon="ri-trophy-fill"
            label="Best Category"
            value={bestCategory?.label || 'None'}
            subtext={`${bestCategory?.percentage || 0}% completion`}
            color="success"
            theme={currentTheme}
          />

          <StatCard
            icon="ri-check-double-line"
            label="Completion Rate"
            value={`${completionRate}%`}
            progress={completionRate}
            subtext="Overall performance"
            color={completionRate >= 70 ? 'success' : completionRate >= 40 ? 'warning' : 'danger'}
            theme={currentTheme}
          />

          <StatCard
            icon="ri-leaf-fill"
            label="Total Habits"
            value={totalHabits}
            subtext={`${habits.filter(h => h.streak > 0).length} active`}
            color="primary"
            theme={currentTheme}
          />

          <StatCard
            icon="ri-fire-fill"
            label="Total Streaks"
            value={totalStreaks}
            progress={Math.min(100, (activeStreaks / Math.max(1, totalHabits)) * 100)}
            subtext={`${activeStreaks} strong streaks`}
            color="warning"
            theme={currentTheme}
          />
        </div>

        <div className="mb-8">
          {pieData.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Pie Chart */}
              
                <div className="flex flex-col items-center">
                  <HabitDistributionCard timeRange={timeRange}  habits={habits} theme={currentTheme} />
                </div>
              

              {/* Category Cards */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ staggerChildren: 0.1 }}
                className="space-y-4"
              >
                {pieData.map((category) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    isSelected={selectedCategory?.id === category.id}
                    onClick={setSelectedCategory}
                    theme={currentTheme}
                  />
                ))}

                {/* Selected Category Details */}
                {selectedCategory && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className={`rounded-2xl p-5 backdrop-blur-sm border 
                      ${currentTheme === 'light' ? 'border-white/40' : 'border-[#2E3944]/40'} 
                      ${currentTheme === 'light' ? 'shadow-lg shadow-[#89A8B2]/10' : 'shadow-xl shadow-[#124E66]/15'}
                      ${currentTheme === 'light'
                        ? 'bg-gradient-to-br from-white/40 to-white/20'
                        : 'bg-gradient-to-br from-[#1A2832]/80 to-[#0F1A23]/80'}`}
                  >
                    <h4 className={`font-['Montserrat'] font-bold text-lg ${currentTheme === 'light' ? 'text-[#2E3944]' : 'text-white'} mb-2`}>
                      {selectedCategory.label} Details
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className={`text-sm ${currentTheme === 'light' ? 'text-[#5A6D77]' : 'text-[#A3B8C8]'}`}>Total Habits</p>
                        <p className={`text-2xl font-bold ${currentTheme === 'light' ? 'text-[#2E3944]' : 'text-white'}`}>{selectedCategory.value}</p>
                      </div>
                      <div>
                        <p className={`text-sm ${currentTheme === 'light' ? 'text-[#5A6D77]' : 'text-[#A3B8C8]'}`}>Completion Rate</p>
                        <p className={`text-2xl font-bold ${currentTheme === 'light' ? 'text-[#2E3944]' : 'text-white'}`}>{selectedCategory.percentage}%</p>
                      </div>
                      <div>
                        <p className={`text-sm ${currentTheme === 'light' ? 'text-[#5A6D77]' : 'text-[#A3B8C8]'}`}>Total Completions</p>
                        <p className={`text-2xl font-bold ${currentTheme === 'light' ? 'text-[#2E3944]' : 'text-white'}`}>{selectedCategory.completed}</p>
                      </div>
                      <div>
                        <p className={`text-sm ${currentTheme === 'light' ? 'text-[#5A6D77]' : 'text-[#A3B8C8]'}`}>Average Streak</p>
                        <p className={`text-2xl font-bold ${currentTheme === 'light' ? 'text-[#2E3944]' : 'text-white'}`}>
                          {Math.round(selectedCategory.completed / selectedCategory.value) || 0}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>
          ) : (
            <EmptyStateCard
              theme={currentTheme}
              onAddHabit={() => navigate('/')}
            />
          )}
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
                Personalized recommendations based on your data
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-[100px]">
            <InsightCard
              icon="ri-bar-chart-line"
              title="Consistency is Key"
              description={`You've maintained ${activeStreaks} strong streaks. Try to keep at least 3 habits active daily for optimal growth.`}
              color="green"
              theme={currentTheme}
            />

            <InsightCard
              icon="ri-timer-line"
              title="Best Time to Grow"
              description={`Your ${bestCategory?.label?.toLowerCase() || ''} habits have the highest completion rate. Focus here for quick wins.`}
              color="blue"
              theme={currentTheme}
            />

            <InsightCard
              icon="ri-seedling-line"
              title="Next Growth Phase"
              description={`Aim for ${completionRate < 70 ? '70%' : '80%'} overall completion rate to unlock your next level of habit mastery.`}
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