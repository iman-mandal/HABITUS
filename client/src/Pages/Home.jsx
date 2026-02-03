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

  useEffect(() => {
    const fetchMotivation = async () => {
      try {
        const res = await fetch(
          'https://api.adviceslip.com/advice',
          { cache: 'no-cache' }
        );
        const data = await res.json();
        setMotivation(data.slip.advice);
        console.log('Motivation:', data.slip.advice);
      } catch (err) {
        console.error('Failed to fetch motivation', err);
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

  const getOverallPieData = (habits) => {
    if (!habits || habits.length === 0) return [];

    // Total completed count across all habits
    const totalCompleted = habits.reduce((acc, habit) => {
      const completed = habit.history?.filter(h => h.completed).length || 0;
      return acc + completed;
    }, 0);

    return habits.map((habit, index) => {
      const completed = habit.history?.filter(h => h.completed).length || 0;

      // Calculate percentage out of 100
      const percentageOfTotal = totalCompleted === 0 ? 0 : (completed / totalCompleted) * 100;

      return {
        id: index,
        label: habit.title,
        value: Math.round(percentageOfTotal), // <-- this is ratio out of 100
        completed,
        color: ['#4775ff', '#ffa500', '#ff4d4f', '#4caf50', '#878787', '#19ecff', '#ac1cff'][index % 7], // optional colors
      };
    });
  };


  return (
    <div className="bg-gradient-to-b from-[#FAFAFC] to-[#F1F5FF] min-h-screen overflow-hidden no-scrollbar">

      {/* ================= HEADER ================= */}
      <div className="fixed top-0 left-0 right-0 z-40 
      bg-gradient-to-r from-[#f6f4eb] via-[#91c8e4] to-[#a5ffdb] 
      px-5 pt-7 pb-4 flex justify-between">
        <h2 className="font-serif text-[22px] font-semibold text-[#353535]">
          {greeting}, {user?.fullname?.firstname || 'User'}
        </h2>
        <div className="text-right text-[14px] font-semibold">
          <p>{week},</p>
          <p>{formattedDate}</p>
        </div>
      </div>

      {/* ================= MAIN ================= */}
      <div className="pt-[110px] px-4 no-scrollbar flex gap-4">

        {/* -------- LEFT -------- */}
        <div className="flex-1 flex flex-col">

          {/* PROGRESS (FIXED) */}
          <div className="fixed w-[990px] pb-2 top-[85px] z-30 bg-gradient-to-b from-[#FAFAFC] to-[#F1F5FF] pt-5 flex gap-4">
            {/* Today */}
            <div className="flex-1 flex justify-between gap-4 items-center px-5 py-4 rounded-xl bg-gradient-to-bl from-[#fce2db] via-[#f1c6d3] to-[#e4a3d4]">
              <div className="w-full h-full">
                <p className="flex w-[140px] top-0 left-1 font-serif border-b-2 border-[#878787] text-[16px] font-semibold text-black">
                  Today's progress
                </p>
                <div className='flex mt-[30px] flex-col'>
                  <p className="font-serif font-semibold mb-2">
                    {completedToday} / {habits.length} Habits Completed
                  </p>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.9 }}
                      className="h-full 
                      bg-gradient-to-r from-[#2dd4bf]  to-[#258a2c]"
                    />
                  </div>
                </div>
              </div>
              <ProgressRate percentage={percentage} />
            </div>

            <div className='flex flex-col px-5 py-2 bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-[#60a9a6] via-[#caf2d7] to-[#f5fec0] gap-3 rounded-xl'>
              {maxHabit && (
                <div className='flex flex-col my-3'>
                  <div className='flex flex-row my-2'>
                    <p className='font-semibold  font-serif text-[16px] items-center'> Best Habit -</p>
                    <p className='font-semibold ml-1 font-serif text-[14px]'>{maxHabit.name} : {maxHabit.percentage}% </p>
                  </div>
                  <div className="h-2 bg-[white] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${maxHabit.percentage}%` }}
                      transition={{ duration: 1 }}
                      className="h-full bg-gradient-to-br from-[#14b8a6] via-[#16a34a] to-[#3f6212]"
                    />
                  </div>
                </div>
              )}

              {minHabit && (
                <div className='flex flex-col my-3'>
                  <div className='flex flex-row my-2 items-center'>
                    <p className='font-semibold font-serif text-[16px]'> Needs Focus - </p>
                    <p className='font-semibold ml-1 font-serif text-[14px]'>{minHabit.name} : {minHabit.percentage}%</p>
                  </div>
                  <div className="h-2 bg-[white] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${minHabit.percentage}%` }}
                      transition={{ duration: 0.6 }}
                      className="h-full bg-gradient-to-tl from-[#f472b6] via-[#f43f5e] to-[#dc2626]"
                    />
                  </div>
                </div>
              )}

            </div>

            {/* 30 Days */}
            <div className="w-[220px] 
            bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-[#ffeeee] via-[#fff6ea] to-[#f7e9d7] 
            rounded-xl shadow px-4 py-3 flex flex-col items-center">
              <p className="font-serif border-b-2 w-full text-center mb-2 font-semibold">
                Last 30 Days
              </p>
              <ProgressRate percentage={calculateLast30DaysProgress(habits)} />
            </div>
          </div>

          {/* HABITS */}
          <div className="mt-[200px] w-2/3 mb-[70px] overflow-y-auto no-scrollbar">
            <Habits habits={habits} setHabits={setHabits}
              setMaxHabit={setMaxHabit}
              setMinHabit={setMinHabit}
            />
          </div>
        </div>

        {/* -------- RIGHT -------- */}
        <div className=" w-[500px] fixed top-[100px] right-3">
          <div className="bg-gradient-to-tl from-[#48f3db] via-[#51c4e9] to-[#6150c1] rounded-xl shadow px-4 py-5 flex flex-col items-center">
            <p className="font-serif font-semibold border-b-2 mb-3 w-full text-center">
              Overall Progress
            </p>
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
                  fontSize: '14px',
                  fontFamily: 'serif',
                  fontWeight: 500,
                  gap: 2,
                },
              }}
            />
          </div>
          <div className='w-[500px] fixed bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))] from-[#eef5ff] via-[#b4d4ff] to-[#86b6f6] flex justify-between flex-row p-4 items-center rounded-xl top-[440px] right-3'>
            <div className='flex flex-col gap-3 pt-2'>
              <p className="text-sm text-gray-800 w-[150px] border-b-2 border-[#5b5b5b] flex font-serif font-semibold mb-1">
                Tips & Motivation
              </p>
              <p className="font-serif text-[18px] text-[#63094b]">
                “{motivation || 'Stay consistent, success is coming.'}”
              </p>
            </div>
            <i className="ri-medal-2-fill text-[50px] p-2 font-semibold text-[#0a0a0a]"></i>

          </div>
        </div>
      </div>

      {/* ADD BUTTON */}
      <Link
        to="/add-habit"
        className="fixed bottom-24 right-5 z-50 bg-[#49c5f1] w-14 h-14 rounded-full flex items-center justify-center shadow-xl"
      >
        <i className="ri-add-large-line text-white text-2xl" />
      </Link>

      {/* NAVBAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <Navbar />
      </div>
    </div>
  )
}

export default Home
