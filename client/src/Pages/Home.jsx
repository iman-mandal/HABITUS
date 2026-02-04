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

  // Nature-themed color palette for pie chart
  const natureColors = [
    '#2D5A27', // Deep Forest Green
    '#4A7C3F', // Moss Green
    '#6B8E23', // Olive
    '#D4A76A', // Clay
    '#FFD166', // Sunbeam
    '#87CEEB', // Sky Blue
    '#4CAF50', // Growth Green
    '#E67E22', // Autumn
    '#9B59B6', // Lavender
    '#3498DB', // Water Blue
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

  // Greeting based on time
  const hour = date.getHours();
  let greeting = 'Good Morning 🌅';
  let greetingColor = 'from-[#FFD166] to-[#FFB347]';

  if (hour >= 12 && hour < 17) {
    greeting = 'Good Afternoon 🌞';
    greetingColor = 'from-[#FFB347] to-[#FF8E42]';
  } else if (hour >= 17 && hour < 21) {
    greeting = 'Good Evening 🌇';
    greetingColor = 'from-[#6B8E23] to-[#2D5A27]';
  } else if (hour >= 21 || hour < 4) {
    greeting = 'Good Night 🌙';
    greetingColor = 'from-[#1A5276] to-[#2D5A27]';
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
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-[#F5E8C7] via-[#E8F5E9] to-[#D4EDDA]">

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
            <p className="font-['Source_Sans_Pro'] text-white/90 text-sm mt-1">
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
              className="col-span-2 bg-white rounded-2xl p-5 border border-[#E0E6D6] shadow-lg"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#2D5A27] to-[#4A7C3F] flex items-center justify-center">
                  <i className="ri-sun-fill text-xl text-white"></i>
                </div>
                <h3 className="font-['Merriweather'] text-[18px] font-bold text-[#2D5A27]">
                  Today's Progress
                </h3>
              </div>

              <div className="flex items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="mb-4">
                    <p className="font-['Source_Sans_Pro'] text-[#5D6D55] text-sm mb-2">
                      {completedToday} out of {habits.length} habits completed
                    </p>
                    <div className="h-3 bg-gradient-to-r from-[#F0F8E8] to-[#E8F5E9] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.9, type: "spring" }}
                        className="h-full bg-gradient-to-r from-[#4CAF50] via-[#6B8E23] to-[#2D5A27] rounded-full"
                      />
                    </div>
                    <p className="font-['Montserrat'] font-bold text-[#2D5A27] text-right mt-2">
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
              className="bg-gradient-to-br from-[#E8F5E9] to-[#D4EDDA] rounded-2xl p-5 border border-[#E0E6D6] shadow-lg flex flex-col items-center justify-center"
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-r from-[#4A7C3F] to-[#6B8E23] flex items-center justify-center mb-3">
                <i className="ri-calendar-2-fill text-2xl text-white"></i>
              </div>
              <h3 className="font-['Merriweather'] text-[16px] font-semibold text-[#2D5A27] mb-2">
                Last 30 Days
              </h3>
              <ProgressRate
                percentage={calculateLast30DaysProgress(habits)}
                size="md"
              />
              <p className="font-['Source_Sans_Pro'] text-[#5D6D55] text-sm mt-2 text-center">
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
                className="bg-gradient-to-br from-[#E8F5E9] to-[#F5E8C7] rounded-2xl p-5 border border-[#E0E6D6] shadow-lg"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FFD166] to-[#FFB347] flex items-center justify-center">
                    <i className="ri-trophy-fill text-xl text-white"></i>
                  </div>
                  <div>
                    <h3 className="font-['Merriweather'] text-[16px] font-bold text-[#2D5A27]">
                      Your Best Habit
                    </h3>
                    <p className="font-['Source_Sans_Pro'] text-[#5D6D55] text-sm">
                      Keep up the great work!
                    </p>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="font-['Source_Sans_Pro'] font-semibold text-[#2D5A27] mb-1">
                    {maxHabit.name}
                  </p>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-['Montserrat'] font-bold text-[#2D5A27]">
                      {maxHabit.percentage}%
                    </span>
                   
                  </div>
                  <div className="h-2 bg-white/50 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${maxHabit.percentage}%` }}
                      transition={{ duration: 1, type: "spring" }}
                      className="h-full bg-gradient-to-r from-[#FFD166] to-[#FFB347] rounded-full"
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
                className="bg-gradient-to-br from-[#F5E8C7] to-[#FFE8E8] rounded-2xl p-5 border border-[#E0E6D6] shadow-lg"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#87CEEB] to-[#3498DB] flex items-center justify-center">
                    <i className="ri-refresh-fill text-xl text-white"></i>
                  </div>
                  <div>
                    <h3 className="font-['Merriweather'] text-[16px] font-bold text-[#2D5A27]">
                      Needs Focus
                    </h3>
                    <p className="font-['Source_Sans_Pro'] text-[#5D6D55] text-sm">
                      Small steps lead to big changes
                    </p>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="font-['Source_Sans_Pro'] font-semibold text-[#2D5A27] mb-1">
                    {minHabit.name}
                  </p>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-['Montserrat'] font-bold text-[#2D5A27]">
                      {minHabit.percentage}%
                    </span>
                    
                  </div>
                  <div className="h-2 bg-white/50 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${minHabit.percentage}%` }}
                      transition={{ duration: 1, type: "spring" }}
                      className="h-full bg-gradient-to-r from-[#87CEEB] to-[#3498DB] rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* HABITS LIST */}
          <div className="mb-[90px]">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#2D5A27] to-[#4A7C3F] flex items-center justify-center">
                <i className="ri-list-check-2 text-xl text-white"></i>
              </div>
              <h2 className="font-['Merriweather'] text-[22px] font-bold text-[#2D5A27]">
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
            className="bg-white rounded-2xl p-6 border border-[#E0E6D6] shadow-lg"
          >
            <div className="flex items-center gap-1 mb-5">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#6B8E23] to-[#4A7C3F] flex items-center justify-center">
                <i className="ri-pie-chart-2-fill text-xl text-white"></i>
              </div>
              <h3 className="font-['Merriweather'] text-[18px] font-bold text-[#2D5A27]">
                Habit Distribution
              </h3>
            </div>

            <div className="flex flex-col items-center">
              <PieChart
                series={[
                  {
                    data: getOverallPieData(habits),
                    highlightScope: { fade: 'global', highlight: 'item' },
                    faded: { innerRadius: 50, additionalRadius: -50, color: 'gray' },
                    formatter: ({ value }) => `${value}%`,
                    innerRadius: 40,
                    outerRadius: 100,
                    paddingAngle: 2,
                    cornerRadius: 5,
                  },
                ]}
                height={280}
                width={320}
                sx={{
                  '& .MuiChartsLegend-root': {
                    fontSize: '12px',
                    fontFamily: '"Source Sans Pro", sans-serif',
                    fontWeight: 500,
                    padding: 1,
                  },
                  '& .MuiPieArc-root': {
                    stroke: '#FFFFFF',
                    strokeWidth: 2,
                  },
                }}
              />

              {habits.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#E8F5E9] to-[#F5E8C7] flex items-center justify-center mb-3">
                    <i className="ri-leaf-line text-3xl text-[#6B8E23]"></i>
                  </div>
                  <p className="font-['Source_Sans_Pro'] text-[#5D6D55] text-center">
                    Start adding habits to see your progress chart!
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* MOTIVATION CARD */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-[#F5E8C7] to-[#E8F5E9] rounded-2xl p-6 border border-[#E0E6D6] shadow-lg"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#D4A76A] to-[#B9935A] flex items-center justify-center">
                <i className="ri-lightbulb-flash-fill text-xl text-white"></i>
              </div>
              <h3 className="font-['Merriweather'] text-[18px] font-bold text-[#2D5A27]">
                Daily Wisdom
              </h3>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <i className="ri-double-quotes-l text-3xl text-[#6B8E23] opacity-50"></i>
              </div>
              <div>
                <p className="font-['Merriweather'] italic text-[17px] text-[#2D5A27] leading-relaxed">
                  "{motivation || 'The best time to plant a tree was 20 years ago. The second best time is now.'}"
                </p>
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#E0E6D6]">
                  <i className="ri-seedling-line text-[#4A7C3F]"></i>
                  <p className="font-['Source_Sans_Pro'] text-[#5D6D55] text-sm">
                    Nature-inspired motivation
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* STATS SUMMARY */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-6 border border-[#E0E6D6] shadow-lg"
          >
            <h3 className="font-['Merriweather'] text-[18px] font-bold text-[#2D5A27] mb-5">
              Your Growth
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-[#F9FBF5] to-[#F0F8E8]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#4CAF50] to-[#2D5A27] flex items-center justify-center">
                    <i className="ri-check-double-line text-sm text-white"></i>
                  </div>
                  <span className="font-['Source_Sans_Pro'] text-[#5D6D55]">Total Completed</span>
                </div>
                <span className="font-['Montserrat'] font-bold text-[#2D5A27]">
                  {habits.reduce((acc, habit) => acc + (habit.history?.filter(h => h.completed).length || 0), 0)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-[#F9FBF5] to-[#F0F8E8]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FFD166] to-[#FFB347] flex items-center justify-center">
                    <i className="ri-fire-fill text-sm text-white"></i>
                  </div>
                  <span className="font-['Source_Sans_Pro'] text-[#5D6D55]">Active Streaks</span>
                </div>
                <span className="font-['Montserrat'] font-bold text-[#2D5A27]">
                  {habits.filter(h => h.streak > 3).length}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-[#F9FBF5] to-[#F0F8E8]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#87CEEB] to-[#3498DB] flex items-center justify-center">
                    <i className="ri-leaf-fill text-sm text-white"></i>
                  </div>
                  <span className="font-['Source_Sans_Pro'] text-[#5D6D55]">Growing Habits</span>
                </div>
                <span className="font-['Montserrat'] font-bold text-[#2D5A27]">
                  {habits.filter(h => h.streak > 0 && h.streak <= 3).length}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ADD BUTTON */}
      <Link
        to="/add-habit"
        className="fixed bottom-28 right-6 z-50 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#4A7C3F] to-[#6B8E23] rounded-full"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFD166] to-[#FFB347] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <i className="ri-add-large-line text-white text-2xl relative z-10" />
        <div className="absolute -inset-1 bg-white/20 rounded-full blur-md group-hover:blur-lg transition-all duration-300"></div>
      </Link>

      {/* NAVBAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <Navbar />
      </div>
    </div>
  )
}

export default Home