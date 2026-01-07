import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { useHabits } from '../context/HabitContext'
import { Link, useNavigate } from 'react-router-dom';


const HabitList = () => {
  const { habits, setHabits } = useHabits();
  const filters = ['All', 'Daily', 'Weekly', 'Monthly'];

  const [active, setActive] = useState('All');
  const [search, setSearch] = useState('');
  const [habitID, setHabitID] = useState('')

  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || token=='') {
      navigate('/login');
    }
  }, [navigate]);


  // fiter and search habits
  const filteredHabits = habits.filter((habit) => {
    const typeMatch =
      active === 'All' ||
      habit.frequency?.toLowerCase() === active.toLowerCase()

    const searchMatch = habit.title
      ?.toLowerCase()
      .includes(search.toLowerCase())

    return typeMatch && searchMatch
  })


  return (
    <div className="h-screen flex flex-col bg-blue-50 overflow-hidden">

      {/* Header*/}
      <div className="py-4 text-center font-semibold text-lg">
        <div className='flex flex-col mx-5 border-b-2 border-[#949494]'>
          <h2 className='text-center text-[22px] font-serif font-semibold'>Your Rituals</h2>
          <p className='text-center text-[12px] text-[#727272] font-serif font-semibold'>Consistency made simple.</p>
        </div>

        <div className="flex gap-2 mt-4 mx-5 overflow-x-auto no-scrollbar">
          {filters.map((label) => (
            <button
              key={label}
              onClick={() => setActive(label)}
              className={`
            px-5 py-1.5 rounded-full text-sm font-medium transition-all
            ${active === label
                  ? 'bg-blue-200 text-blue-700 shadow-sm'
                  : 'bg-gray-100 text-gray-400'
                }
          `}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="px-5 mt-4">
          <div
            className="relative flex items-center w-full h-[44px] rounded-2xl border border-gray-300 bg-white focus-within:ring-2 focus-within:ring-[#a1a0a0] transition" >
            <i className="ri-search-line absolute left-4 text-gray-400 text-lg"></i>

            {/* Search Habits */}
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-full pl-12 pr-4 bg-transparent outline-none text-sm placeholder-gray-400"
            />
          </div>
        </div>

      </div>

      {/* Scrollable habits */}
      <div className="flex-1 mb-[70px] overflow-y-auto no-scrollbar px-2">
        {filteredHabits.length === 0 ? (
          <p className="text-center mt-6 text-gray-400 text-sm">
            No habits found
          </p>
        ) : (
          filteredHabits.map((habit) => {
            const todayHistory = habit.history?.find(
              (h) => h.date === today
            )

            return (
              <div
                key={habit._id}
                onClick={() => {
                  setHabitID(habit._id)
                  navigate(`/habit-details/${habit._id}`)
                }}
                className="flex items-center my-2 mx-3 justify-between px-4 py-3 bg-white rounded-lg">
                <div className='flex w-full flex-row justify-between'>
                  <div className='flex flex-col'>
                  <h2 className="font-semibold font-serif">
                    {habit.title}
                  </h2>
                  <p>{habit.description}</p>
                  </div>
                  <p className="text-sm flex items-center text-gray-600">
                    <i className="ri-fire-line text-2xl text-yellow-400"></i>
                    Streak: {habit.streak}
                  </p>
                </div>
              </div>
            )
          })
        )}
      </div>

      <Link
        to="/add-habit"
        className=" fixed bottom-24 right-5 z-50 bg-[#49c5f1] flex items-center justify-center w-[56px] h-[56px] rounded-full shadow-xl active:scale-95 transition"
      >
        <i className="ri-add-large-line text-[26px] text-white"></i>
      </Link>

      {/* Fixed Bottom Navbar */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <Navbar />
      </div>
    </div>
  )
}

export default HabitList
