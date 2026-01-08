import React, { useEffect } from 'react'
import Navbar from '../components/Navbar'
import HabitAreaChatGraph from '../components/HabitAreaChatGraph'
import { useHabits } from '../context/HabitContext'
import { useNavigate } from 'react-router-dom'

const Analytics = () => {

  const navigate = useNavigate()

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

  const { habits, setHabits } = useHabits()
  const totalHabits = habits?.length || 0


  return (
    <div className=' bg-blue-50 h-screen'>

      {/* HEADER */}
      <div className="py-4 text-center">
        <div className="flex flex-col pb-3 mx-5 border-b-2 border-[#949494]">
          <h2 className="text-[22px] font-serif font-semibold">
            Your Habits Analytics
          </h2>
          <p className="text-[12px] text-[#727272] font-serif">
            Consistency made simple.
          </p>
        </div>
      </div>

      {/* OVERALL AVERAGE */}
      <div className="text-center my-4 flex flex-row justify-evenly">
        <div className='bg-white flex flex-col shadow-lg px-3 rounded-lg py-2'>
        <p className="text-[12px] font-serif font-semibold text-gray-700">Completation Rate</p>
        <h2 className="text-xl font-bold text-green-600">
          {calculateOverallAverage(habits)}%
        </h2>
        </div>
        <div className='bg-white flex flex-col shadow-lg px-3 rounded-lg py-2'>
        <p className="text-[12px] font-serif font-semibold text-gray-700">Total Habits</p>
        <h2 className="text-xl font-bold text-green-600">
          {totalHabits}
        </h2>
        </div>
      </div>

      {/* GRAPH */}
      <div className="mx-3 mt-4">
        <HabitAreaChatGraph habits={habits} setHabits={setHabits} />
      </div>

      {/* NAVBAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <Navbar />
      </div>

    </div>
  )
}

export default Analytics
