import React, { useCallback, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar';
import ProgressRate from '../components/ProgressRate';
import Habits from '../components/Habits';
import axios from 'axios';
import { useHabits } from '../context/HabitContext'
import { useUser } from '../context/UserContext';

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
    if (!token || token=='') {
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

  const { user, setUser} = useUser();

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
      <div className=" fixed top-[90px] left-0 right-0 z-40 bg-blue-50 flex justify-center py-3">
        <ProgressRate percentage={percentage} />
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
