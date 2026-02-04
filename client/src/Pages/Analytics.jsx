import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import HabitAreaChatGraph from '../components/HabitAreaChatGraph'
import { useHabits } from '../context/HabitContext'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart'

const Analytics = () => {
  const navigate = useNavigate()
  const { habits, setHabits } = useHabits()
  const [timeRange, setTimeRange] = useState('week')
  const [bestCategory, setBestCategory] = useState('')

  const totalHabits = habits?.length || 0

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
      fitness: { count: 0, completed: 0, color: '#124E66' },
      mental: { count: 0, completed: 0, color: '#748D92' },
      study: { count: 0, completed: 0, color: '#D3D9D4' },
      health: { count: 0, completed: 0, color: '#2E3944' },
      other: { count: 0, completed: 0, color: '#212A31' }
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
        completed: data.completed,
        percentage: data.count > 0 ? Math.round((data.completed / (data.count * 30)) * 100) : 0
      }))
  }

  const getBestCategory = (habits) => {
    const categories = getCategoryData(habits)
    if (categories.length === 0) return ''

    const best = categories.reduce((prev, current) =>
      (prev.percentage > current.percentage) ? prev : current
    )
    return best
  }

  useEffect(() => {
    if (habits.length > 0) {
      const bestCat = getBestCategory(habits)
      setBestCategory(bestCat)
    }
  }, [habits])

  const pieData = getCategoryData(habits)
  const completionRate = calculateOverallAverage(habits)
  const totalStreaks = calculateTotalStreaks(habits)
  const activeStreaks = calculateActiveStreaks(habits)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gradient-to-b from-[#212A31] via-[#2E3944] to-[#124E66]"
    >
      {/* HEADER */}
      <div className="bg-gradient-to-r from-[#124E66] to-[#2E3944] px-6 pt-8 pb-6">
        <div className="flex flex-row gap-3 items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#748D92]/20 to-transparent backdrop-blur-sm flex items-center justify-center mb-3">
            <i className="ri-bar-chart-2-fill text-3xl text-[#D3D9D4]"></i>
          </div>
          <div className='flex flex-col items-start'>
            <h2 className="font-['Merriweather'] text-[28px] font-bold text-[#D3D9D4] text-center mb-1">
              Habit Analytics
            </h2>
            <p className="font-['Source_Sans_Pro'] text-[#748D92] text-center">
              Track your growth, nurture your progress
            </p>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2 mt-2 overflow-x-auto no-scrollbar">
          {['week', 'month', 'quarter', 'year'].map((range) => (
            <motion.button
              key={range}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-full text-sm font-['Source_Sans_Pro'] font-semibold transition-all ${timeRange === range
                ? 'bg-[#D3D9D4] text-[#124E66] shadow-lg'
                : 'bg-[#748D92]/20 text-[#D3D9D4] backdrop-blur-sm'
                }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </motion.button>
          ))}
        </div>
      </div>

      {/* STATS OVERVIEW */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="px-6 py-6"
      >
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Completion Rate */}
          <div className="bg-gradient-to-br from-[#2E3944]/90 to-[#212A31]/90 rounded-2xl p-5 border border-[#748D92]/20 shadow-lg backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#748D92] to-[#124E66] flex items-center justify-center">
                <i className="ri-check-double-line text-xl text-[#D3D9D4]"></i>
              </div>
              <div>
                <p className="font-['Source_Sans_Pro'] text-[#748D92] text-sm">Completion Rate</p>
                <h2 className="font-['Montserrat'] font-bold text-[28px] text-[#D3D9D4]">
                  {completionRate}%
                </h2>
              </div>
            </div>
            <div className="h-2 bg-gradient-to-r from-[#212A31] to-[#2E3944] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#124E66] to-[#748D92] rounded-full transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>

          {/* Total Habits */}
          <div className="bg-gradient-to-br from-[#2E3944]/90 to-[#212A31]/90 rounded-2xl p-5 border border-[#748D92]/20 shadow-lg backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#D3D9D4] to-[#748D92] flex items-center justify-center">
                <i className="ri-leaf-fill text-xl text-[#212A31]"></i>
              </div>
              <div>
                <p className="font-['Source_Sans_Pro'] text-[#748D92] text-sm">Total Habits</p>
                <h2 className="font-['Montserrat'] font-bold text-[28px] text-[#D3D9D4]">
                  {totalHabits}
                </h2>
              </div>
            </div>
            <p className="font-['Source_Sans_Pro'] text-[#748D92] text-xs">
              {habits.filter(h => h.streak > 0).length} active
            </p>
          </div>

          {/* Total Streaks */}
          <div className="bg-gradient-to-br from-[#2E3944]/90 to-[#212A31]/90 rounded-2xl p-5 border border-[#748D92]/20 shadow-lg backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#2E3944] to-[#124E66] flex items-center justify-center">
                <i className="ri-fire-fill text-xl text-[#D3D9D4]"></i>
              </div>
              <div>
                <p className="font-['Source_Sans_Pro'] text-[#748D92] text-sm">Total Streaks</p>
                <h2 className="font-['Montserrat'] font-bold text-[28px] text-[#D3D9D4]">
                  {totalStreaks}
                </h2>
              </div>
            </div>
            <p className="font-['Source_Sans_Pro'] text-[#748D92] text-xs">
              {activeStreaks} strong streaks
            </p>
          </div>

          {/* Best Category */}
          <div className="bg-gradient-to-br from-[#2E3944]/90 to-[#212A31]/90 rounded-2xl p-5 border border-[#748D92]/20 shadow-lg backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#748D92] to-[#124E66] flex items-center justify-center">
                <i className="ri-trophy-fill text-xl text-[#D3D9D4]"></i>
              </div>
              <div>
                <p className="font-['Source_Sans_Pro'] text-[#748D92] text-sm">Best Category</p>
                <h2 className="font-['Montserrat'] font-bold text-[22px] text-[#D3D9D4] truncate">
                  {bestCategory?.label || 'None'}
                </h2>
              </div>
            </div>
            <p className="font-['Source_Sans_Pro'] text-[#748D92] text-xs">
              {bestCategory?.percentage || 0}% completion
            </p>
          </div>
        </div>

        {/* CATEGORY DISTRIBUTION */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#124E66] to-[#212A31] flex items-center justify-center">
              <i className="ri-pie-chart-2-fill text-xl text-[#D3D9D4]"></i>
            </div>
            <h3 className="font-['Merriweather'] text-[20px] font-bold text-[#D3D9D4]">
              Category Distribution
            </h3>
          </div>

          {pieData.length > 0 ? (
            <div className="bg-gradient-to-br from-[#2E3944]/90 to-[#212A31]/90 rounded-2xl p-5 border border-[#748D92]/20 shadow-lg backdrop-blur-sm">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 flex justify-center">
                  <PieChart
                    series={[
                      {
                        data: pieData,
                        highlightScope: { fade: 'global', highlight: 'item' },
                        innerRadius: 40,
                        outerRadius: 100,
                        paddingAngle: 2,
                        cornerRadius: 5,
                      },
                    ]}
                    height={250}
                    width={300}
                    sx={{
                      [`& .${pieArcLabelClasses.root}`]: {
                        fill: '#D3D9D4',
                        fontWeight: 'bold',
                        fontSize: '12px',
                        fontFamily: '"Source Sans Pro", sans-serif',
                      },
                    }}
                  />
                </div>

                <div className="md:w-1/2 space-y-4">
                  {pieData.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-[#212A31] to-[#2E3944] border border-[#748D92]/20">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="font-['Source_Sans_Pro'] font-semibold text-[#D3D9D4]">
                          {item.label}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <span className="font-['Montserrat'] font-bold text-[#D3D9D4]">
                            {item.value} habits
                          </span>
                          <span className="font-['Source_Sans_Pro'] text-[#748D92] text-sm">
                            ({item.percentage}%)
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-[#2E3944]/90 to-[#212A31]/90 rounded-2xl p-8 border border-[#748D92]/20 shadow-lg flex flex-col items-center justify-center backdrop-blur-sm">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#212A31] to-[#2E3944] flex items-center justify-center mb-4">
                <i className="ri-pie-chart-2-line text-3xl text-[#748D92]"></i>
              </div>
              <p className="font-['Merriweather'] text-[#D3D9D4] text-lg mb-2">No data yet</p>
              <p className="font-['Source_Sans_Pro'] text-[#748D92] text-center">
                Start tracking habits to see category distribution
              </p>
            </div>
          )}
        </div>

        {/* PERFORMANCE GRAPH */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#748D92] to-[#124E66] flex items-center justify-center">
              <i className="ri-line-chart-fill text-xl text-[#D3D9D4]"></i>
            </div>
            <h3 className="font-['Merriweather'] text-[20px] font-bold text-[#D3D9D4]">
              Performance Trend
            </h3>
          </div>

          <div className="bg-gradient-to-br from-[#2E3944]/90 to-[#212A31]/90 rounded-2xl p-5 border border-[#748D92]/20 shadow-lg backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="font-['Source_Sans_Pro'] text-[#748D92]">
                Showing {timeRange}ly trends
              </p>
              <div className="flex items-center gap-2">
                <i className="ri-calendar-line text-[#748D92]"></i>
                <span className="font-['Source_Sans_Pro'] text-[#748D92] text-sm">
                  {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}
                </span>
              </div>
            </div>
            <HabitAreaChatGraph habits={habits} setHabits={setHabits} timeRange={timeRange} />
          </div>
        </div>

        {/* INSIGHTS */}
        <div className="mt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#124E66] to-[#212A31] flex items-center justify-center">
              <i className="ri-lightbulb-flash-fill text-xl text-[#D3D9D4]"></i>
            </div>
            <h3 className="font-['Merriweather'] text-[20px] font-bold text-[#D3D9D4]">
              Growth Insights
            </h3>
          </div>

          <div className="bg-gradient-to-br from-[#2E3944]/90 to-[#212A31]/90 rounded-2xl mb-[80px] p-5 border border-[#748D92]/20 shadow-lg backdrop-blur-sm">
            <div className="space-y-4">

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#748D92] to-[#124E66] flex items-center justify-center flex-shrink-0 mt-1">
                  <i className="ri-arrow-up-line text-[#D3D9D4] text-sm"></i>
                </div>
                <div>
                  <h4 className="font-['Merriweather'] font-semibold text-[#D3D9D4]">
                    Consistency is Key
                  </h4>
                  <p className="font-['Source_Sans_Pro'] text-[#748D92] text-sm">
                    You've maintained {activeStreaks} strong streaks. Try to keep at least 3 habits active daily for optimal growth.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#D3D9D4] to-[#748D92] flex items-center justify-center flex-shrink-0 mt-1">
                  <i className="ri-timer-line text-[#212A31] text-sm"></i>
                </div>
                <div>
                  <h4 className="font-['Merriweather'] font-semibold text-[#D3D9D4]">
                    Best Time to Grow
                  </h4>
                  <p className="font-['Source_Sans_Pro'] text-[#748D92] text-sm">
                    Your {bestCategory?.label?.toLowerCase() || ''} habits have the highest completion rate. Focus here for quick wins.
                  </p>
                </div>
              </div>


              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#2E3944] to-[#124E66] flex items-center justify-center flex-shrink-0 mt-1">
                  <i className="ri-seedling-line text-[#D3D9D4] text-sm"></i>
                </div>
                <div>
                  <h4 className="font-['Merriweather'] font-semibold text-[#D3D9D4]">
                    Next Growth Phase
                  </h4>
                  <p className="font-['Source_Sans_Pro'] text-[#748D92] text-sm">
                    Aim for {completionRate < 70 ? '70%' : '80%'} overall completion rate to unlock your next level of habit mastery.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </motion.div>

      {/* NAVBAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <Navbar />
      </div>
    </motion.div>
  )
}

export default Analytics