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
      <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#212A31] to-[#2E3944]">
        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#124E66] to-[#748D92] flex items-center justify-center mb-4">
          <i className="ri-search-eye-line text-3xl text-[#D3D9D4]"></i>
        </div>
        <p className="text-[#D3D9D4] text-lg font-['Merriweather']">Habit not found</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-6 py-2 bg-gradient-to-r from-[#124E66] to-[#748D92] text-[#D3D9D4] rounded-lg hover:opacity-90 transition"
        >
          Go Back
        </button>
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

  // Get category icon based on title
  const getCategoryIcon = (title) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('run') || lowerTitle.includes('exercise') || lowerTitle.includes('workout') || lowerTitle.includes('gym')) {
      return 'ri-heart-pulse-line';
    } else if (lowerTitle.includes('meditate') || lowerTitle.includes('read') || lowerTitle.includes('journal') || lowerTitle.includes('pray')) {
      return 'ri-brain-line';
    } else if (lowerTitle.includes('study') || lowerTitle.includes('learn') || lowerTitle.includes('practice')) {
      return 'ri-book-line';
    } else if (lowerTitle.includes('water') || lowerTitle.includes('sleep') || lowerTitle.includes('eat') || lowerTitle.includes('fruit')) {
      return 'ri-heart-line';
    } else {
      return 'ri-leaf-line';
    }
  };

  // Calculate habit completion percentage
  const calculateCompletion = () => {
    const total = habit.history?.length || 0;
    const completed = habit.history?.filter(h => h.completed).length || 0;
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  const completionPercentage = calculateCompletion();

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-[#212A31] to-[#2E3944]">

      {/* Header (Fixed) */}
      <div className="fixed top-0 left-0 w-full bg-gradient-to-r from-[#124E66] to-[#748D92] z-50 flex items-center justify-center py-4 shadow-lg">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-5 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition"
        >
          <i className="ri-arrow-left-line text-[20px] text-[#D3D9D4]"></i>
        </button>
        <h2 className="text-[22px] font-bold text-[#D3D9D4] font-['Merriweather'] tracking-wide">
          Habit Details
        </h2>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 mt-[70px] mb-[80px] overflow-y-auto px-6">

        {/* Main Habit Card */}
        <div className="bg-gradient-to-br from-[#2E3944] to-[#212A31] rounded-2xl p-6 border border-[#748D92]/30 shadow-xl mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-[#124E66] to-[#748D92] flex items-center justify-center shadow-lg">
                <i className={`${getCategoryIcon(habit.title)} text-2xl text-[#D3D9D4]`}></i>
              </div>
              <div>
                <h2 className="text-[26px] font-['Merriweather'] font-bold text-[#D3D9D4]">
                  {habit.title}
                </h2>
                <p className="text-[#748D92] mt-1 font-['Source_Sans_Pro']">
                  {habit.description || "No description provided"}
                </p>
              </div>
            </div>

            {/* Completion Badge */}
            <div className="flex flex-col items-end">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#124E66] to-[#748D92] flex items-center justify-center">
                <span className="font-['Montserrat'] font-bold text-[#D3D9D4] text-xl">
                  {completionPercentage}%
                </span>
              </div>
              <span className="text-[#D3D9D4] text-xs mt-2">Completion</span>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-[#748D92]/30 to-transparent my-6"></div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#212A31] rounded-xl p-4 border border-[#748D92]/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#124E66] to-[#748D92] flex items-center justify-center">
                  <i className="ri-fire-line text-lg text-[#D3D9D4]"></i>
                </div>
                <div>
                  <p className="text-[#748D92] text-xs">Current Streak</p>
                  <p className="font-['Montserrat'] font-bold text-[#D3D9D4] text-xl">{habit.streak} days</p>
                </div>
              </div>
            </div>

            <div className="bg-[#212A31] rounded-xl p-4 border border-[#748D92]/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#124E66] to-[#748D92] flex items-center justify-center">
                  <i className="ri-trophy-line text-lg text-[#D3D9D4]"></i>
                </div>
                <div>
                  <p className="text-[#748D92] text-xs">Longest Streak</p>
                  <p className="font-['Montserrat'] font-bold text-[#D3D9D4] text-xl">{habit.longestStreak} days</p>
                </div>
              </div>
            </div>

            <div className="bg-[#212A31] rounded-xl p-4 border border-[#748D92]/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#124E66] to-[#748D92] flex items-center justify-center">
                  <i className="ri-repeat-line text-lg text-[#D3D9D4]"></i>
                </div>
                <div>
                  <p className="text-[#748D92] text-xs">Frequency</p>
                  <p className="font-['Montserrat'] font-bold text-[#D3D9D4] text-lg">
                    {habit.frequency.charAt(0).toUpperCase() + habit.frequency?.slice(1)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#212A31] rounded-xl p-4 border border-[#748D92]/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#124E66] to-[#748D92] flex items-center justify-center">
                  <i className="ri-flag-line text-lg text-[#D3D9D4]"></i>
                </div>
                <div>
                  <p className="text-[#748D92] text-xs">Weekly Target</p>
                  <p className="font-['Montserrat'] font-bold text-[#D3D9D4] text-xl">
                    {habit.targetPerWeek}/week
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => navigate(`/habit/update/${habit._id}`)}
            className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-[#124E66] to-[#748D92] text-[#D3D9D4] py-4 rounded-xl hover:opacity-90 transition active:scale-95 font-['Source_Sans_Pro'] font-semibold"
          >
            <i className="ri-edit-2-line text-lg"></i>
            Edit Habit
          </button>

          <button
            onClick={() => setDeleteConfirmTost(true)}
            className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-[#8B0000] to-[#B22222] text-[#D3D9D4] py-4 rounded-xl hover:opacity-90 transition active:scale-95 font-['Source_Sans_Pro'] font-semibold"
          >
            <i className="ri-delete-bin-5-line text-lg"></i>
            Delete Habit
          </button>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendar Section */}
          <div className="bg-gradient-to-br from-[#2E3944] to-[#212A31] rounded-2xl p-6 mb-5 border border-[#748D92]/30 shadow-xl">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#124E66] to-[#748D92] flex items-center justify-center">
                <i className="ri-calendar-2-line text-lg text-[#D3D9D4]"></i>
              </div>
              <h3 className="font-['Merriweather'] font-bold text-[#D3D9D4] text-lg">
                Habit Calendar
              </h3>
            </div>
            <CalendarView history={habit.history || []} />
          </div>

          {/* Additional Details */}
          <div className="bg-gradient-to-br from-[#2E3944] to-[#212A31] 
          rounded-2xl p-4 border h-[550px] border-[#748D92]/30 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#124E66] to-[#748D92] flex items-center justify-center">
                <i className="ri-information-line text-lg text-[#D3D9D4]"></i>
              </div>
              <h3 className="font-['Merriweather'] font-bold text-[#D3D9D4] text-lg">
                Additional Details
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#212A31] border border-[#748D92]/20">
                <div className="flex items-center gap-3">
                  <i className="ri-calendar-event-line text-[#748D92]"></i>
                  <span className="text-[#D3D9D4] font-['Source_Sans_Pro']">Start Date</span>
                </div>
                <span className="text-[#D3D9D4] font-['Montserrat'] font-semibold">
                  {new Date(Number(habit.startDate)).toLocaleDateString('en-IN')}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-[#212A31] border border-[#748D92]/20">
                <div className="flex items-center gap-3">
                  <i className="ri-history-line text-[#748D92]"></i>
                  <span className="text-[#D3D9D4] font-['Source_Sans_Pro']">Total Days</span>
                </div>
                <span className="text-[#D3D9D4] font-['Montserrat'] font-semibold">
                  {habit.history?.length || 0}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-[#212A31] border border-[#748D92]/20">
                <div className="flex items-center gap-3">
                  <i className="ri-check-double-line text-[#748D92]"></i>
                  <span className="text-[#D3D9D4] font-['Source_Sans_Pro']">Completed Days</span>
                </div>
                <span className="text-[#D3D9D4] font-['Montserrat'] font-semibold">
                  {habit.history?.filter(h => h.completed).length || 0}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-[#212A31] border border-[#748D92]/20">
                <div className="flex items-center gap-3">
                  <i className="ri-trending-up-line text-[#748D92]"></i>
                  <span className="text-[#D3D9D4] font-['Source_Sans_Pro']">Consistency Rate</span>
                </div>
                <span className="text-[#D3D9D4] font-['Montserrat'] font-semibold">
                  {completionPercentage}%
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-8">
              <div className="flex justify-between mb-2">
                <span className="text-[#D3D9D4] text-sm">Overall Progress</span>
                <span className="text-[#D3D9D4] font-['Montserrat'] font-semibold">
                  {completionPercentage}%
                </span>
              </div>
              <div className="h-3 bg-[#212A31] rounded-full overflow-hidden border border-[#748D92]/20">
                <div
                  className="h-full bg-gradient-to-r from-[#124E66] to-[#748D92] rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmTost && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-[#2E3944] to-[#212A31] rounded-2xl w-[90%] max-w-md p-8 border border-[#748D92]/30 shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#8B0000] to-[#B22222] flex items-center justify-center mb-6">
                <i className="ri-delete-bin-5-line text-[30px] text-[#D3D9D4]"></i>
              </div>

              <h3 className="font-['Merriweather'] font-bold text-[#D3D9D4] text-2xl mb-3">
                Delete Habit
              </h3>

              <p className="text-[#748D92] mb-8 font-['Source_Sans_Pro'] leading-relaxed">
                Are you sure you want to delete "{habit.title}"? This action cannot be undone and all progress will be lost.
              </p>

              <div className="flex gap-4 w-full">
                <button
                  onClick={() => setDeleteConfirmTost(false)}
                  className="flex-1 py-3 bg-[#212A31] text-[#D3D9D4] rounded-xl border border-[#748D92]/30 hover:bg-[#2E3944] transition font-['Source_Sans_Pro'] font-semibold"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    setDeleteConfirmTost(false)
                    deleteHabit()
                    navigate(-1)
                  }}
                  className="flex-1 py-3 bg-gradient-to-r from-[#8B0000] to-[#B22222] text-[#D3D9D4] rounded-xl hover:opacity-90 transition font-['Source_Sans_Pro'] font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navbar */}
      <div className="fixed bottom-0 w-full">
        <Navbar />
      </div>
    </div>
  )
}

export default HabitDetails