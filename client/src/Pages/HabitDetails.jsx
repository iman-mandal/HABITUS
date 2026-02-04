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
    <div className="flex flex-col h-screen 
    bg-gradient-to-br from-[#F5E8C7] to-[#E8F5E9]">

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
        <div className='flex flex-row'>
          <div className='flex w-1/3 flex-col'>
            <div className='flex flex-col'>
              <div className="mx-1 py-4 px-5 rounded-lg mt-5 bg-[#FFFFFF]">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#4A7C3F] to-[#6B8E23] flex items-center justify-center">
                    <i className="ri-leaf-line text-2xl text-white"></i>
                  </div>
                </div>
                <h2 className="text-[26px] text-center font-['Merriweather'] font-semibold">
                  {habit.title}
                </h2>

                <p className="text-[#5D6D55] mt-2 text-center font-['Source_Sans_Pro'] text-base leading-relaxed">
                  {habit.description || "No description provided"}
                </p>
                {/* Divider with leaf design */}
                <div className="flex items-center justify-center my-1">
                  <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-[#D4A76A] to-transparent"></div>
                  <i className="ri-leaf-fill mx-3 text-[#6B8E23] text-lg"></i>
                  <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-[#D4A76A] to-transparent"></div>
                </div>

                <div className="flex items-center justify-between gap-3 mt-4">
                  <div className='flex flex-row gap-2 p-3 items-center justify-center rounded-xl 
                bg-gradient-to-br from-[#F8FFE8] to-[#F0F8E8] border border-[#E0E6D6]'>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FFB347] to-[#FFD166] flex items-center justify-center">
                      <i className="ri-fire-line text-xl text-white"></i>
                    </div>
                    <div className='flex flex-col'>
                      <p className="text-xs text-[#7A7A7A] font-['Source_Sans_Pro'] font-medium">
                        Current Streak
                      </p>
                      <p className="font-['Montserrat'] font-bold text-xl text-[#2D5A27]">{habit.streak} Days</p>
                    </div>
                  </div>
                  <div className='flex flex-row gap-2 p-3 items-center justify-center rounded-xl 
                bg-gradient-to-br from-[#F8FFE8] to-[#F0F8E8] border border-[#E0E6D6]'>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#4A90E2] to-[#87CEEB] flex items-center justify-center">
                      <i className="ri-target-line text-xl text-white"></i>
                    </div>
                    <div className='flex flex-col'>
                      <p className="text-xs text-[#7A7A7A] font-['Source_Sans_Pro'] font-medium">Longest Streak</p>
                      <p className="font-['Montserrat'] font-bold text-xl text-[#2D5A27]">{habit.longestStreak} Days</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Edit & Delete habit button */}
              <div className="mb-[40px] w-full px-5 gap-4 py-3 flex justify-between">
                <button
                  onClick={() => {
                    navigate(`/habit/update/${habit._id}`)
                  }}
                  className="flex-1 flex items-center justify-center gap-3 
                  bg-gradient-to-r from-[#4A7C3F] to-[#6B8E23] 
                  px-5 py-3 rounded-xl shadow-lg hover:shadow-xl 
                  transition-all duration-300 hover:scale-[1.02] active:scale-95 group"
                >
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition">
                    <i className="ri-edit-2-line text-lg text-white"></i>
                  </div>
                  <span className="font-['Source_Sans_Pro'] font-semibold text-white text-lg">
                    Edit Habit
                  </span>
                </button>

                <button
                  onClick={() => {
                    setDeleteConfirmTost(true)
                  }}
                  className="flex-1 flex items-center justify-center gap-3 
                  bg-gradient-to-r from-[#FF6B6B] to-[#FF8E8E] 
                  px-5 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all 
                  duration-300 hover:scale-[1.02] active:scale-95 group"
                >
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition">
                    <i className="ri-delete-bin-5-line text-lg text-white"></i>
                  </div>
                  <span className="font-['Source_Sans_Pro'] font-semibold text-white text-lg">
                    Delete Habit
                  </span>
                </button>
              </div>
            </div>
          </div>
          {/* Habit Details Card */}
          <div className="mx-1 pt-4 h-[360px] w-1/3 px-6 rounded-2xl mt-5 bg-white border border-[#E0E6D6] shadow-lg">
            <h2 className="text-[20px] text-center font-['Merriweather'] font-semibold text-[#2D5A27] mb-4">
              Habit Details
            </h2>

            <div className="space-y-4 ">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[#F9FBF5]">
                <div className="w-8 h-8 rounded-full bg-[#E8F5E9] flex items-center justify-center">
                  <i className="ri-calendar-event-line text-[#4A7C3F]"></i>
                </div>
                <div>
                  <p className="text-xs text-[#7A7A7A] font-['Source_Sans_Pro']">Start Date</p>
                  <p className="font-['Source_Sans_Pro'] font-semibold text-[#2D5A27]">
                    {new Date(Number(habit.startDate)).toLocaleDateString('en-IN')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-[#F9FBF5]">
                <div className="w-8 h-8 rounded-full bg-[#E8F5E9] flex items-center justify-center">
                  <i className="ri-repeat-line text-[#4A7C3F]"></i>
                </div>
                <div>
                  <p className="text-xs text-[#7A7A7A] font-['Source_Sans_Pro']">Frequency</p>
                  <p className="font-['Source_Sans_Pro'] font-semibold text-[#2D5A27]">
                    {habit.frequency.charAt(0).toUpperCase() + habit.frequency?.slice(1)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-[#F9FBF5]">
                <div className="w-8 h-8 rounded-full bg-[#E8F5E9] flex items-center justify-center">
                  <i className="ri-flag-line text-[#4A7C3F]"></i>
                </div>
                <div>
                  <p className="text-xs text-[#7A7A7A] font-['Source_Sans_Pro']">Weekly Target</p>
                  <p className="font-['Source_Sans_Pro'] font-semibold text-[#2D5A27]">
                    {habit.targetPerWeek} Days / Week
                  </p>
                </div>
              </div>
            </div>
          </div>


          {/* Calendar */}
          <div className="w-1/3 mt-2">
            <CalendarView history={habit.history || []} />
          </div>
        </div>


      </div>
      {/* Delete Confirmation Tost */}
      {deleteConfirmTost && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-gradient-to-b from-white to-[#F5E8C7] flex flex-col items-center rounded-2xl w-[90%] max-w-sm p-6 border border-[#E0E6D6] shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#FF6B6B] to-[#FF8E8E] flex items-center justify-center mb-4">
              <i className="ri-delete-bin-5-line text-[30px] text-white"></i>
            </div>

            <h3 className="text-[22px] font-['Merriweather'] font-bold text-center text-[#2D5A27]">
              Delete Habit
            </h3>

            <p className="text-[15px] text-center text-[#5D6D55] mt-2 font-['Source_Sans_Pro'] leading-relaxed">
              Are you sure you want to delete this habit? This action cannot be undone.
            </p>

            <div className="flex justify-between gap-4 w-full mt-8">
              <button
                onClick={() => setDeleteConfirmTost(false)}
                className="flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-[#F0F0F0] to-[#E0E0E0] text-[#5D6D55] font-['Source_Sans_Pro'] font-semibold hover:shadow-lg active:scale-95 transition"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  setDeleteConfirmTost(false)
                  deleteHabit()
                  navigate(-1)
                }}
                className="flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-[#FF6B6B] to-[#FF8E8E] text-white font-['Source_Sans_Pro'] font-semibold hover:shadow-lg active:scale-95 transition"
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
