import { useParams, useNavigate } from 'react-router-dom'
import { useHabits } from '../context/HabitContext'
import Navbar from '../components/Navbar'
import CalendarView from '../components/CalendarView'
import axios from 'axios'
import { useState } from 'react'

const HabitDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { habits } = useHabits()
  const [deleteConfirmTost, setDeleteConfirmTost] = useState(false)

  const habit = habits.find(h => h._id === id)

  if (!habit) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500">Habit not found</p>
      </div>
    )
  }

  const deleteHabit = async () => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/habit/${habit._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      console.log('Habit deleted successfully:', response.data);
    } catch (err) {
      console.log('Delete failed:', err.response?.data || err.message);
    }
  };


  return (
    <div className="flex flex-col h-screen bg-blue-50">

      {/* Header (Fixed) */}
      <div className="fixed top-0 left-0 w-full bg-white z-50 flex items-center justify-center py-4 shadow">
        <i
          onClick={() => navigate(-1)}
          className="ri-arrow-left-wide-line absolute left-5 text-[25px] cursor-pointer active:scale-95 transition"
        />
        <h2 className="text-[20px] font-semibold font-serif">
          Habit Details
        </h2>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 mt-[64px] mb-[40px] overflow-y-auto px-4">
        {/* Habit Info */}
        <div className="mx-1 py-4 px-5 rounded-lg mt-5 bg-[white]">
          <h2 className="text-[25px] text-center font-serif font-semibold">
            {habit.title}
          </h2>

          <p className="text-gray-600 mt-2 text-center">
            {habit.description || "No description provided"}
          </p>
          {/* divition gray line  */}
          <div className="w-40 h-1 rounded-full bg-gray-300 mx-auto my-2 transition-all duration-200 active:scale-x-90"></div>

          <div className="flex items-center justify-between gap-3 mt-4">
            <div className='flex flex-row gap-2 items-center justify-center'>
              <i className="ri-fire-line text-2xl text-yellow-400"></i>
              <div className='flex flex-col'>
                <p className="text-xs text-gray-500">Streak</p>
                <p className="font-semibold">{habit.streak} Days</p>
              </div>
            </div>
            <div className='flex flex-row gap-2 items-center justify-center'>
              <i className="ri-target-line text-2xl"></i>
              <div className='flex flex-col'>
                <p className="text-xs text-gray-500">Longest Streak</p>
                <p className="font-semibold">{habit.longestStreak} Days</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-1 py-4 px-8 rounded-lg mt-5 bg-[white]">
          <h2 className='text-[18px] text-center py-1 font-serif'>Habit Start : {new Date(Number(habit.startDate)).toLocaleDateString('en-IN')}</h2>
          <h2 className='text-[18px] text-center py-1 font-serif'> Frequency : {habit.frequency.charAt(0).toUpperCase() + habit.frequency?.slice(1)}</h2>
          <h2 className='text-[18px] text-center py-1 font-serif'> Target : {habit.targetPerWeek} Days / Week</h2>
        </div>
        {/* Calendar */}
        <div className="mt-4">
          <CalendarView history={habit.history || []} />
        </div>



        <div className="mb-[40px] w-full px-5 py-3 flex justify-between">
          <button
            onClick={() => {
              navigate(`/habit/update/${habit._id}`)
            }}
            className="flex items-center bg-white px-5 py-3 rounded-lg shadow-xl gap-2 text-blue-600 font-medium active:scale-95"
          >
            <i className="ri-edit-2-line text-lg"></i>
            Edit Habit
          </button>

          <button
            onClick={() => {
              setDeleteConfirmTost(true)
            }}
            className="flex items-center bg-white px-5 py-3 rounded-lg shadow-xl gap-2 text-red-500 font-medium active:scale-95"
          >
            <i className="ri-delete-bin-5-line text-lg"></i>
            Delete Habit
          </button>
        </div>
      </div>
      {deleteConfirmTost && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white flex flex-col rounded-xl w-[90%] max-w-sm p-6">
            <i className="ri-delete-bin-5-line text-[50px] text-center text-[#ff4d4d]"></i>
            <h3 className="text-[20px] font-serif text-center font-semibold text-gray-800">
              Delete Habit
            </h3>

            <p className="text-[15px] text-center text-gray-700 mt-2">
              Are you sure want to delete this habit ?
            </p>

            <div className="flex justify-between gap-3 mt-6">
              <button
                onClick={() => setDeleteConfirmTost(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 active:scale-95"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  setDeleteConfirmTost(false)
                  deleteHabit()
                  navigate(-1)
                }}
                className="px-4 py-2 rounded-lg bg-red-500 text-white active:scale-95"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Bottom Navbar */}
      <div>
        <Navbar />
      </div>
    </div>
  )
}

export default HabitDetails
