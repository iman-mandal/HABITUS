import React, { useCallback, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar';
import ProgressRate from '../components/ProgressRate';
import Habits from '../components/Habits';
import HabitDistributionCard from '../components/HabitDistributionCard';
import MotivationCard from '../components/MotivationCard';
import StatsSummaryCard from '../components/StatsSummaryCard';
import { useHabits } from '../context/HabitContext'
import { useUser } from '../context/UserContext';
import { motion } from 'framer-motion';
import '../global.css';

const Home = () => {
  const { habits, setHabits } = useHabits()
  const [maxHabit, setMaxHabit] = useState('')
  const [minHabit, setMinHabit] = useState('')
  const { user, setUser } = useUser();

  // Get current theme from user or default to 'dark'
  const currentTheme = user?.theme || 'dark';

  // Theme configuration
  const themeConfig = {
    light: {
      // Main background
      bgGradient: 'bg-gradient-to-br from-[#F1F0E8] via-[#E5E1DA] to-[#B3C8CF]',
      cardBg: 'bg-white/90 backdrop-blur-sm',
      cardBorder: 'border-[#B3C8CF]/50',

      // Text colors
      primaryText: 'text-[#2E3944]',
      secondaryText: 'text-[#5A6D74]',
      accentText: 'text-[#89A8B2]',

      // Card backgrounds
      innerCardBg: 'bg-gradient-to-r from-[#F1F0E8] to-[#E5E1DA]',

      // Progress bars
      progressBg: 'bg-gradient-to-r from-[#F1F0E8] to-[#E5E1DA]',
      progressFill: 'bg-gradient-to-r from-[#89A8B2] via-[#B3C8CF] to-[#5A6D74]',

      // Icons
      iconBg: 'bg-gradient-to-r from-[#89A8B2] to-[#B3C8CF]',
      iconColor: 'text-[#2E3944]',

      // Warning/error
      warningGradient: 'bg-gradient-to-r from-[#FF9A8B] to-[#FF6B6B]',
      warningIconBg: 'bg-gradient-to-r from-[#FF9A8B] to-[#FF6B6B]',

      // Greeting gradients
      morningGradient: 'from-[#89A8B2] to-[#B3C8CF]',
      afternoonGradient: 'from-[#B3C8CF] to-[#5A6D74]',
      eveningGradient: 'from-[#5A6D74] to-[#2E3944]',
      nightGradient: 'from-[#2E3944] to-[#89A8B2]',
    },
    dark: {
      // Main background
      bgGradient: 'bg-gradient-to-br from-[#212A31] via-[#2E3944] to-[#124E66]',
      cardBg: 'bg-[#2E3944]/80 backdrop-blur-sm',
      cardBorder: 'border-[#748D92]/20',

      // Text colors
      primaryText: 'text-[#D3D9D4]',
      secondaryText: 'text-[#748D92]',
      accentText: 'text-[#748D92]',

      // Card backgrounds
      innerCardBg: 'bg-gradient-to-r from-[#212A31] to-[#2E3944]',

      // Progress bars
      progressBg: 'bg-gradient-to-r from-[#212A31] to-[#2E3944]',
      progressFill: 'bg-gradient-to-r from-[#124E66] via-[#748D92] to-[#D3D9D4]',

      // Icons
      iconBg: 'bg-gradient-to-r from-[#124E66] to-[#748D92]',
      iconColor: 'text-[#D3D9D4]',

      // Warning/error
      warningGradient: 'bg-gradient-to-r from-[#FF6B6B] to-[#E74C3C]',
      warningIconBg: 'bg-gradient-to-r from-[#8B0000] to-[#B22222]',

      // Greeting gradients
      morningGradient: 'from-[#124E66] to-[#748D92]',
      afternoonGradient: 'from-[#748D92] to-[#2E3944]',
      eveningGradient: 'from-[#2E3944] to-[#212A31]',
      nightGradient: 'from-[#212A31] to-[#124E66]',
    }
  };

  const theme = themeConfig[currentTheme];

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
  let greetingColor = theme.morningGradient;

  if (hour >= 4 && hour < 12) {
    // Morning (4 AM - 11:59 AM)
    greeting = 'Good Morning 🌅';
    greetingColor = theme.morningGradient;
  } else if (hour >= 12 && hour < 17) {
    // Afternoon (12 PM - 4:59 PM)
    greeting = 'Good Afternoon 🌞';
    greetingColor = theme.afternoonGradient;
  } else if (hour >= 17 && hour < 21) {
    // Evening (5 PM - 8:59 PM)
    greeting = 'Good Evening 🌇';
    greetingColor = theme.eveningGradient;
  } else {
    // Night (9 PM - 3:59 AM)
    greeting = 'Good Night 🌙';
    greetingColor = theme.nightGradient;
  }

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

  return (
    <div className={`min-h-screen overflow-hidden ${theme.bgGradient}`}>

      {/* ================= HEADER ================= */}
      <div
        className={`fixed top-0 left-0 right-0 z-40 bg-gradient-to-r ${greetingColor} px-4 sm:px-6 pt-4 pb-3 flex justify-between items-center shadow-lg`} >
        {/* Left Section */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <i className="ri-leaf-fill text-xl sm:text-2xl text-white"></i>
          </div>

          <div>
            <h2 className="font-['Merriweather'] font-bold text-white text-[18px] sm:text-[22px] lg:text-[24px]">
              {greeting}
            </h2>
            <p className="font-['Source_Sans_Pro'] text-white/90 text-sm sm:text-base mt-0.5">
              {user?.fullname?.firstname || 'Nature Lover'}
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <i className="ri-calendar-event-fill text-lg sm:text-xl text-white"></i>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:gap-1 text-right">
            <p className="font-['Source_Sans_Pro'] font-semibold text-white text-[13px] sm:text-[14px] lg:text-[15px]">
              {week},
            </p>
            <p className="font-['Source_Sans_Pro'] font-semibold text-white text-[13px] sm:text-[14px] lg:text-[15px]">
              {formattedDate}
            </p>
          </div>
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
              className={`col-span-2 ${theme.cardBg} rounded-2xl p-5 border ${theme.cardBorder} shadow-lg`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-full ${theme.iconBg} flex items-center justify-center`}>
                  <i className={`ri-sun-fill text-xl ${theme.iconColor}`}></i>
                </div>
                <h3 className={`font-['Merriweather'] text-[18px] font-bold ${theme.primaryText}`}>
                  Today's Progress
                </h3>
              </div>

              <div className="flex items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="mb-4">
                    <p className={`font-['Source_Sans_Pro'] ${theme.secondaryText} text-sm mb-2`}>
                      {completedToday} out of {habits.length} habits completed
                    </p>
                    <div className={`h-3 ${theme.progressBg} rounded-full overflow-hidden`}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.9, type: "spring" }}
                        className={`h-full ${theme.progressFill} rounded-full`}
                      />
                    </div>
                    <p className={`font-['Montserrat'] font-bold ${theme.primaryText} text-right mt-2`}>
                      {percentage}%
                    </p>
                  </div>
                </div>
                <ProgressRate percentage={percentage} size="lg" theme={currentTheme} />
              </div>
            </motion.div>

            {/* 30 Days Progress Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`${theme.cardBg} rounded-2xl p-5 border ${theme.cardBorder} shadow-lg flex flex-col items-center justify-center`}
            >
              <div className='flex flex-row items-center justify-between gap-3'>
                <div className={`w-12 h-12 rounded-full ${theme.iconBg} flex items-center justify-center mb-3`}>
                  <i className={`ri-calendar-2-fill text-[20px] ${theme.iconColor}`}></i>
                </div>
                <h3 className={`font-['Merriweather'] text-[16px] font-semibold ${theme.primaryText} mb-2`}>
                  Last 30 Days
                </h3>
              </div>
              <ProgressRate
                percentage={calculateLast30DaysProgress(habits)}
                size="md"
                theme={currentTheme}
              />
              <p className={`font-['Source_Sans_Pro'] ${theme.secondaryText} text-sm mt-2 text-center`}>
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
                className={`${theme.cardBg} rounded-2xl p-5 border ${theme.cardBorder} shadow-lg`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-full ${theme.iconBg} flex items-center justify-center`}>
                    <i className={`ri-trophy-fill text-xl ${theme.iconColor}`}></i>
                  </div>
                  <div>
                    <h3 className={`font-['Merriweather'] text-[16px] font-bold ${theme.primaryText}`}>
                      Your Best Habit
                    </h3>
                    <p className={`font-['Source_Sans_Pro'] ${theme.secondaryText} text-sm`}>
                      Keep up the great work!
                    </p>
                  </div>
                </div>

                <div className="mb-3">
                  <p className={`font-['Source_Sans_Pro'] font-semibold ${theme.primaryText} mb-1`}>
                    {maxHabit.name}
                  </p>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`font-['Montserrat'] font-bold ${theme.primaryText}`}>
                      {maxHabit.percentage}%
                    </span>
                  </div>
                  <div className={`h-2 ${currentTheme === 'light' ? 'bg-[#E5E1DA]' : 'bg-[#212A31]'} rounded-full overflow-hidden`}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${maxHabit.percentage}%` }}
                      transition={{ duration: 1, type: "spring" }}
                      className={`h-full ${theme.progressFill} rounded-full`}
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
                className={`${theme.cardBg} rounded-2xl p-5 border ${theme.cardBorder} shadow-lg`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-full ${theme.warningIconBg} flex items-center justify-center`}>
                    <i className={`ri-refresh-fill text-xl ${theme.iconColor}`}></i>
                  </div>
                  <div>
                    <h3 className={`font-['Merriweather'] text-[16px] font-bold ${theme.primaryText}`}>
                      Needs Focus
                    </h3>
                    <p className={`font-['Source_Sans_Pro'] ${theme.secondaryText} text-sm`}>
                      Small steps lead to big changes
                    </p>
                  </div>
                </div>

                <div className="mb-3">
                  <p className={`font-['Source_Sans_Pro'] font-semibold ${theme.primaryText} mb-1`}>
                    {minHabit.name}
                  </p>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`font-['Montserrat'] font-bold ${theme.primaryText}`}>
                      {minHabit.percentage}%
                    </span>
                  </div>
                  <div className={`h-2 ${currentTheme === 'light' ? 'bg-[#E5E1DA]' : 'bg-[#212A31]'} rounded-full overflow-hidden`}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${minHabit.percentage}%` }}
                      transition={{ duration: 1, type: "spring" }}
                      className={`h-full ${theme.warningGradient} rounded-full`}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* HABITS LIST */}
          <div className="mb-[90px]">
            <div className="flex items-center gap-3 mb-5">
              <div className={`w-10 h-10 rounded-full ${theme.iconBg} flex items-center justify-center`}>
                <i className={`ri-list-check-2 text-xl ${theme.iconColor}`}></i>
              </div>
              <h2 className={`font-['Merriweather'] text-[22px] font-bold ${theme.primaryText}`}>
                Your Habits
              </h2>
            </div>
            <Habits
              habits={habits}
              setHabits={setHabits}
              setMaxHabit={setMaxHabit}
              setMinHabit={setMinHabit}
              theme={currentTheme}
            />
          </div>
        </div>

        {/* -------- RIGHT COLUMN -------- */}
        <div className="lg:w-[380px] flex flex-col gap-6">
          {/* Use the new components */}
          <HabitDistributionCard habits={habits} theme={currentTheme} />
          <MotivationCard theme={currentTheme} />
          <StatsSummaryCard habits={habits} theme={currentTheme} />
        </div>

      </div>

      {/* NAVBAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <Navbar user={user} setUser={setUser} />
      </div>
    </div>
  )
}

export default Home;