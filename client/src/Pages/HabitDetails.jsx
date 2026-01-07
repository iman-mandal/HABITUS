import { useParams, useNavigate } from 'react-router-dom'
import { useHabits } from '../context/HabitContext'
import Navbar from '../components/Navbar'
import CalendarView from '../components/CalendarView'

const HabitDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { habits, deleteHabit } = useHabits()

  const habit = habits.find(h => h._id === id)

  if (!habit) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500">Habit not found</p>
      </div>
    )
  }

  const DeleteHabit=as()=>{

  }

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
          <h2 className="text-xl font-serif font-semibold">
            {habit.title}
          </h2>

          <p className="text-gray-600 mt-2">
            {habit.description || "No description provided"}
          </p>

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

        {/* Calendar */}
        <div className="mt-4">
          <CalendarView history={habit.history || []} />
        </div>



        <div className="mb-[40px] w-full px-5 py-3 flex justify-between">
          <button
            className="flex items-center bg-white px-5 py-3 rounded-lg shadow-xl gap-2 text-blue-600 font-medium active:scale-95"
          >
            <i className="ri-edit-2-line text-lg"></i>
            Edit Habit
          </button>

          <button
            className="flex items-center bg-white px-5 py-3 rounded-lg shadow-xl gap-2 text-red-500 font-medium active:scale-95"
          >
            <i className="ri-delete-bin-5-line text-lg"></i>
            Delete Habit
          </button>
        </div>
      </div>

      {/* Bottom Navbar */}
      <div>
        <Navbar />
      </div>
    </div>
  )
}

export default HabitDetails
