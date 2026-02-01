import React, { useCallback, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar';
import ProgressRate from '../components/ProgressRate';
import Habits from '../components/Habits';
import { useHabits } from '../context/HabitContext'
import { useUser } from '../context/UserContext';
import { motion } from 'framer-motion';

const Home = () => {
  const { habits, setHabits } = useHabits()


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
  let greeting = 'Good Morning';

  if (hour >= 12 && hour < 17) {
    greeting = 'Good Afternoon';
  } else if (hour >= 17 && hour < 21) {
    greeting = 'Good Evening';
  } else if (hour >= 21 || hour < 4) {
    greeting = 'Good Night';
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


  const calculateOverallProgress = (habits) => {
    if (!habits || habits.length === 0) return 0;

    let completed = 0;
    let total = 0;

    habits.forEach(habit => {
      habit.history?.forEach(h => {
        total++;
        if (h.completed) completed++;
      });
    });

    if (total === 0) return 0;

    return Math.round((completed / total) * 100);
  };

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
      <div className="bg-blue-50 h-screen flex flex-col overflow-hidden">

        {/* HEADER */}
        <div className="fixed top-0 left-0 right-0 z-40 bg-white px-5 pt-7 pb-4 flex items-center justify-between">
          <h2 className="font-serif text-[22px] text-[#353535] font-semibold">
            {greeting}, {user?.fullname?.firstname || 'User'}
          </h2>

          <div className="text-right">
            <p className="text-[14px] font-semibold">{week},</p>
            <p className="text-[14px] font-semibold">{formattedDate}</p>
          </div>
        </div>

        {/* PROGRESS */}

        <div className=" fixed flex-row top-[90px] left-0 right-0 z-40 bg-blue-50 flex justify-evenly py-3">
          <div className='flex flex-row justify-between p-3 rounded-lg bg-[#7ef4ff]'>
            <div className='items-center justify-center'>
              <div className="w-full px-5 mt-2 items-center justify-center">
                {/* Text */}
                <div className="flex justify-between mb-1">
                  <p className="text-[20px] font-serif font-semibold text-gray-700">
                    {completedToday} / {habits.length} Habits Completed
                  </p>
                </div>

                {/* Progress bar */}
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="h-full bg-[#b2ff65] rounded-full"
                  />
                </div>
              </div>
            </div>
            <div className='flex flex-col '>
              <ProgressRate percentage={percentage} />

              <p className="text-center font-semibold text-[#808080]">
                Today's progress
              </p>
            </div>
          </div>
          <div>
            <ProgressRate percentage={calculateLast30DaysProgress(habits)} />

            <p className="text-center font-semibold text-[#808080]">
              Last 30 day's progress
            </p>
          </div>
          <div>
            <ProgressRate percentage={calculateOverallProgress(habits)} />

            <p className="text-center font-semibold text-[#808080]">
              Overall progress
            </p>
          </div>

        </div>

        {/* SCROLLABLE HABITS */}
        <div
          className="flex-1 mt-[290px] mb-[70px] overflow-y-auto no-scrollbar px-2"
        >
          <Habits habits={habits} setHabits={setHabits} />
        </div>

        {/* FLOATING ADD BUTTON */}
        <Link
          to="/add-habit"
          className=" fixed bottom-24 right-5 z-50 bg-[#49c5f1] flex items-center justify-center w-[56px] h-[56px] rounded-full shadow-xl active:scale-95 transition"
        >
          <i className="ri-add-large-line text-[26px] text-white"></i>
        </Link>

        {/* NAVBAR */}
        <div className="fixed bottom-0 left-0 right-0 z-40">
          <Navbar />
        </div>

      </div>

    )
  }

  export default Home
