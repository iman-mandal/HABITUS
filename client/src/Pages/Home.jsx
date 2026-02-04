import React, { useCallback, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar';
import ProgressRate from '../components/ProgressRate';
import Habits from '../components/Habits';
import { useHabits } from '../context/HabitContext'
import { useUser } from '../context/UserContext';
import { motion } from 'framer-motion';
import { PieChart } from '@mui/x-charts/PieChart'
import '../global.css';

const Home = () => {
  const { habits, setHabits } = useHabits()
  const [maxHabit, setMaxHabit] = useState('')
  const [minHabit, setMinHabit] = useState('')
  const [motivation, setMotivation] = useState('');

  // Updated color palette for pie chart with your colors
  const natureColors = [
    '#124E66', // Dark teal blue
    '#748D92', // Muted slate blue
    '#2E3944', // Dark blue-gray
    '#D3D9D4', // Off-white
    '#212A31', // Deep blue-black
  ];

  // Tips & motivation sentence generator api
  useEffect(() => {
    const fetchMotivation = async () => {
      try {
        const res = await fetch(
          'https://api.adviceslip.com/advice',
          { cache: 'no-cache' }
        );
        const data = await res.json();
        setMotivation(data.slip.advice);
      } catch (err) {
        console.error('Failed to fetch motivation', err);
        setMotivation("Every day is a fresh start. Plant the seeds of good habits.");
      }
    };

    fetchMotivation();

    const interval = setInterval(fetchMotivation, 60 * 60 * 1000); // 1 hour

    return () => clearInterval(interval);
  }, []);

  const date = new Date();
  const formattedDate = date.toLocaleDateString('en-IN', {
    month: 'long',
    day: 'numeric',
  });
  const week = date.toLocaleDateString('en-IN', {
    weekday: 'long',
  })

  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || token == '') {
      navigate('/login');
    }
  }, [navigate]);

  // Greeting based on time with accurate ranges
  const hour = date.getHours();
  let greeting = 'Good Morning 🌅';
  let greetingColor = 'from-[#124E66] to-[#748D92]';

  if (hour >= 4 && hour < 12) {
    // Morning (4 AM - 11:59 AM)
    greeting = 'Good Morning 🌅';
    greetingColor = 'from-[#124E66] to-[#748D92]';
  } else if (hour >= 12 && hour < 17) {
    // Afternoon (12 PM - 4:59 PM)
    greeting = 'Good Afternoon 🌞';
    greetingColor = 'from-[#748D92] to-[#2E3944]';
  } else if (hour >= 17 && hour < 21) {
    // Evening (5 PM - 8:59 PM)
    greeting = 'Good Evening 🌇';
    greetingColor = 'from-[#2E3944] to-[#212A31]';
  } else {
    // Night (9 PM - 3:59 AM)
    greeting = 'Good Night 🌙';
    greetingColor = 'from-[#212A31] to-[#124E66]';
  }

  const { user, setUser } = useUser();

  const today = new Date().toISOString().split('T')[0];

  const completedToday = habits.filter((habit) =>
    habit.history?.some(
      (h) => h.date === today && h.completed
    )
  ).length;

  const percentage =
    habits.length === 0
      ? 0
      : Math.round((completedToday / habits.length) * 100);

  // last 30 days progress
  const calculateLast30DaysProgress = (habits) => {
    if (!habits || habits.length === 0) return 0;

    const today = new Date();
    const last30Days = new Date();
    last30Days.setDate(today.getDate() - 29);

    let completed = 0;
    let total = 0;

    habits.forEach(habit => {
      habit.history?.forEach(h => {
        const date = new Date(h.date);
        if (date >= last30Days && date <= today) {
          total++;
          if (h.completed) completed++;
        }
      });
    });

    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  // Get overall Pie chart Data with nature colors
  const getOverallPieData = (habits) => {
    if (!habits || habits.length === 0) return [];

    const totalCompleted = habits.reduce((acc, habit) => {
      const completed = habit.history?.filter(h => h.completed).length || 0;
      return acc + completed;
    }, 0);

    return habits.map((habit, index) => {
      const completed = habit.history?.filter(h => h.completed).length || 0;
      const percentageOfTotal = totalCompleted === 0 ? 0 : (completed / totalCompleted) * 100;

      return {
        id: index,
        label: habit.title,
        value: Math.round(percentageOfTotal),
        completed,
        color: natureColors[index % natureColors.length],
      };
    });
  };

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-[#212A31] via-[#2E3944] to-[#124E66]">

      {/* ================= HEADER ================= */}
      <div className={`fixed top-0 left-0 right-0 z-40 bg-gradient-to-r ${greetingColor} px-6 pt-4 pb-3 flex justify-between items-center shadow-lg`}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <i className="ri-leaf-fill text-2xl text-white"></i>
          </div>
          <div>
            <h2 className="font-['Merriweather'] text-[24px] font-bold text-white">
              {greeting}
            </h2>
            <p className="font-['Source_Sans_Pro'] text-white/90 text-lg mt-1">
              {user?.fullname?.firstname || 'Nature Lover'}
            </p>
          </div>
        </div>
        <div className="text-right flex flex-row items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-2">
            <i className="ri-calendar-event-fill text-xl text-white"></i>
          </div>
          <p className="font-['Source_Sans_Pro'] font-semibold text-white text-[15px]">{week},</p>
          <p className="font-['Source_Sans_Pro'] font-semibold text-white text-[15px]">{formattedDate}</p>
        </div>
      </div>

      {/* ================= MAIN ================= */}
      <div className="pt-[120px] px-6 flex flex-col lg:flex-row gap-6">

        {/* -------- LEFT COLUMN -------- */}
        <div className="flex-1 flex flex-col">

          {/* PROGRESS SECTION */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Today's Progress Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="col-span-2 bg-gradient-to-br from-[#2E3944] to-[#212A31] rounded-2xl p-5 border border-[#748D92]/30 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#124E66] to-[#748D92] flex items-center justify-center">
                  <i className="ri-sun-fill text-xl text-[#D3D9D4]"></i>
                </div>
                <h3 className="font-['Merriweather'] text-[18px] font-bold text-[#D3D9D4]">
                  Today's Progress
                </h3>
              </div>

              <div className="flex items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="mb-4">
                    <p className="font-['Source_Sans_Pro'] text-[#748D92] text-sm mb-2">
                      {completedToday} out of {habits.length} habits completed
                    </p>
                    <div className="h-3 bg-gradient-to-r from-[#212A31] to-[#2E3944] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.9, type: "spring" }}
                        className="h-full bg-gradient-to-r from-[#124E66] via-[#748D92] to-[#D3D9D4] rounded-full"
                      />
                    </div>
                    <p className="font-['Montserrat'] font-bold text-[#D3D9D4] text-right mt-2">
                      {percentage}%
                    </p>
                  </div>
                </div>
                <ProgressRate percentage={percentage} size="lg" />
              </div>
            </motion.div>

            {/* 30 Days Progress Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-[#2E3944] to-[#212A31] rounded-2xl p-5 border border-[#748D92]/30 shadow-lg flex flex-col items-center justify-center"
            >
              <div className='flex flex-row items-center justify-between gap-3'>
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#124E66] to-[#748D92] flex items-center justify-center mb-3">
                  <i className="ri-calendar-2-fill text-[20px] text-[#D3D9D4]"></i>
                </div>
                <h3 className="font-['Merriweather'] text-[16px] font-semibold text-[#D3D9D4] mb-2">
                  Last 30 Days
                </h3>
              </div>
              <ProgressRate
                percentage={calculateLast30DaysProgress(habits)}
                size="md"
              />
              <p className="font-['Source_Sans_Pro'] text-[#748D92] text-sm mt-2 text-center">
                Monthly consistency
              </p>
            </motion.div>
          </div>

          {/* BEST & NEEDS FOCUS HABITS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            {/* Best Habit Card */}
            {maxHabit && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-[#2E3944] to-[#212A31] rounded-2xl p-5 border border-[#748D92]/30 shadow-lg"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#124E66] to-[#748D92] flex items-center justify-center">
                    <i className="ri-trophy-fill text-xl text-[#D3D9D4]"></i>
                  </div>
                  <div>
                    <h3 className="font-['Merriweather'] text-[16px] font-bold text-[#D3D9D4]">
                      Your Best Habit
                    </h3>
                    <p className="font-['Source_Sans_Pro'] text-[#748D92] text-sm">
                      Keep up the great work!
                    </p>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="font-['Source_Sans_Pro'] font-semibold text-[#D3D9D4] mb-1">
                    {maxHabit.name}
                  </p>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-['Montserrat'] font-bold text-[#D3D9D4]">
                      {maxHabit.percentage}%
                    </span>
                  </div>
                  <div className="h-2 bg-[#212A31] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${maxHabit.percentage}%` }}
                      transition={{ duration: 1, type: "spring" }}
                      className="h-full bg-gradient-to-r from-[#124E66] to-[#748D92] rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Needs Focus Card */}
            {minHabit && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-[#2E3944] to-[#212A31] rounded-2xl p-5 border border-[#748D92]/30 shadow-lg"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#8B0000] to-[#B22222] flex items-center justify-center">
                    <i className="ri-refresh-fill text-xl text-[#D3D9D4]"></i>
                  </div>
                  <div>
                    <h3 className="font-['Merriweather'] text-[16px] font-bold text-[#D3D9D4]">
                      Needs Focus
                    </h3>
                    <p className="font-['Source_Sans_Pro'] text-[#748D92] text-sm">
                      Small steps lead to big changes
                    </p>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="font-['Source_Sans_Pro'] font-semibold text-[#D3D9D4] mb-1">
                    {minHabit.name}
                  </p>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-['Montserrat'] font-bold text-[#D3D9D4]">
                      {minHabit.percentage}%
                    </span>
                  </div>
                  <div className="h-2 bg-[#212A31] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${minHabit.percentage}%` }}
                      transition={{ duration: 1, type: "spring" }}
                      className="h-full bg-gradient-to-r from-[#8B0000] to-[#B22222] rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* HABITS LIST */}
          <div className="mb-[90px]">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#124E66] to-[#748D92] flex items-center justify-center">
                <i className="ri-list-check-2 text-xl text-[#D3D9D4]"></i>
              </div>
              <h2 className="font-['Merriweather'] text-[22px] font-bold text-[#D3D9D4]">
                Your Habits
              </h2>
            </div>
            <Habits
              habits={habits}
              setHabits={setHabits}
              setMaxHabit={setMaxHabit}
              setMinHabit={setMinHabit}
            />
          </div>
        </div>

        {/* -------- RIGHT COLUMN -------- */}
        <div className="lg:w-[380px] flex flex-col gap-6">
          {/* OVERALL PROGRESS PIE CHART */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-[#2E3944] to-[#212A31] rounded-2xl p-6 border border-[#748D92]/30 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#124E66] to-[#748D92] flex items-center justify-center">
                <i className="ri-pie-chart-2-fill text-xl text-[#D3D9D4]"></i>
              </div>
              <div>
                <h3 className="font-['Merriweather'] text-[18px] font-bold text-[#D3D9D4]">
                  Habit Distribution
                </h3>
                <p className="font-['Source_Sans_Pro'] text-[#748D92] text-xs mt-1">
                  By completion status
                </p>
              </div>
            </div>

            {habits.length > 0 ? (
              <div className="relative min-h-[260px] flex flex-col items-center">
                {/* Pie Chart - REMOVED LEGEND */}
                <div className="h-[220px] w-full -mt-2">
                  <PieChart
                    series={[
                      {
                        data: getOverallPieData(habits),
                        highlightScope: { fade: 'global', highlight: 'item' },
                        faded: { innerRadius: 50, additionalRadius: -50, color: 'gray' },
                        formatter: ({ value }) => `${value}%`,
                      },
                    ]}
                    height={250}
                    width={250}
                    sx={{
                      '& .MuiChartsLegend-root': {
                        display: 'none',
                        
                      },
                      '& .MuiChartsLegend-label': {
                        fontSize: '16px',
                      },
                    }}
                  />


                </div>

                {/* Custom Compact Legend */}
                <div className="mt-10 w-full">
                  <div className="grid grid-cols-2 gap-2">
                    {getOverallPieData(habits).map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 rounded-lg bg-[#212A31] border border-[#748D92]/20 hover:border-[#748D92]/40 transition"
                      >
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <div className="flex-1 min-w-0">
                          <span className="font-['Source_Sans_Pro'] text-xs text-[#D3D9D4] truncate block">
                            {item.label}
                          </span>
                          <span className="font-['Source_Sans_Pro'] text-xs text-[#748D92]">
                            {item.value}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#2E3944] to-[#212A31] flex items-center justify-center mb-4">
                  <i className="ri-leaf-line text-3xl text-[#748D92]"></i>
                </div>
                <p className="font-['Source_Sans_Pro'] text-[#748D92] text-center">
                  Start adding habits to see your progress chart!
                </p>
              </div>
            )}
          </motion.div>

          {/* MOTIVATION CARD */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-[#2E3944] to-[#212A31] rounded-2xl p-6 border border-[#748D92]/30 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#124E66] to-[#748D92] flex items-center justify-center">
                <i className="ri-lightbulb-flash-fill text-xl text-[#D3D9D4]"></i>
              </div>
              <div>
                <h3 className="font-['Merriweather'] text-[18px] font-bold text-[#D3D9D4]">
                  Daily Wisdom
                </h3>
                <p className="font-['Source_Sans_Pro'] text-[#748D92] text-xs mt-1">
                  Stay inspired on your journey
                </p>
              </div>
            </div>

            <div className="relative p-4 rounded-lg bg-gradient-to-r from-[#212A31] to-[#2E3944] border border-[#748D92]/20">
              <div className="absolute -top-2 -left-2">
                <i className="ri-double-quotes-l text-xl text-[#748D92] opacity-50"></i>
              </div>
              <p className="font-['Merriweather'] italic text-[16px] text-[#D3D9D4] leading-relaxed pl-4">
                "{motivation || 'The best time to plant a tree was 20 years ago. The second best time is now.'}"
              </p>
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#748D92]/20">
                <i className="ri-seedling-line text-[#124E66]"></i>
                <p className="font-['Source_Sans_Pro'] text-[#748D92] text-xs">
                  Nature-inspired motivation
                </p>
              </div>
            </div>
          </motion.div>

          {/* STATS SUMMARY */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-[#2E3944] to-[#212A31] rounded-2xl p-6 border border-[#748D92]/30 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#124E66] to-[#748D92] flex items-center justify-center">
                <i className="ri-bar-chart-fill text-xl text-[#D3D9D4]"></i>
              </div>
              <div>
                <h3 className="font-['Merriweather'] text-[18px] font-bold text-[#D3D9D4]">
                  Your Growth
                </h3>
                <p className="font-['Source_Sans_Pro'] text-[#748D92] text-xs mt-1">
                  Track your progress
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-[#212A31] to-[#2E3944] border border-[#748D92]/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#124E66] to-[#748D92] flex items-center justify-center">
                    <i className="ri-check-double-line text-sm text-[#D3D9D4]"></i>
                  </div>
                  <div>
                    <span className="font-['Source_Sans_Pro'] text-[#748D92] text-sm block">Total Completed</span>
                    <span className="font-['Source_Sans_Pro'] text-[#748D92]/60 text-xs">All habits combined</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-['Montserrat'] font-bold text-lg text-[#D3D9D4] block">
                    {habits.reduce((acc, habit) => acc + (habit.history?.filter(h => h.completed).length || 0), 0)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-[#212A31] to-[#2E3944] border border-[#748D92]/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#124E66] to-[#748D92] flex items-center justify-center">
                    <i className="ri-fire-fill text-sm text-[#D3D9D4]"></i>
                  </div>
                  <div>
                    <span className="font-['Source_Sans_Pro'] text-[#748D92] text-sm block">Active Streaks</span>
                    <span className="font-['Source_Sans_Pro'] text-[#748D92]/60 text-xs">Streaks over 3 days</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-['Montserrat'] font-bold text-lg text-[#D3D9D4] block">
                    {habits.filter(h => h.streak > 3).length}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-[#212A31] to-[#2E3944] border border-[#748D92]/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#124E66] to-[#748D92] flex items-center justify-center">
                    <i className="ri-leaf-fill text-sm text-[#D3D9D4]"></i>
                  </div>
                  <div>
                    <span className="font-['Source_Sans_Pro'] text-[#748D92] text-sm block">Growing Habits</span>
                    <span className="font-['Source_Sans_Pro'] text-[#748D92]/60 text-xs">Starting streaks</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-['Montserrat'] font-bold text-lg text-[#D3D9D4] block">
                    {habits.filter(h => h.streak > 0 && h.streak <= 3).length}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

      </div>


      {/* NAVBAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <Navbar />
      </div>
    </div>
  )
}

export default Home