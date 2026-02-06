import { useParams, useNavigate } from 'react-router-dom'
import { useHabits } from '../context/HabitContext'
import Navbar from '../components/Navbar'
import CalendarView from '../components/CalendarView'
import axios from 'axios'
import { useState } from 'react'
import { useUser } from '../context/UserContext'

const HabitDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { habits, fetchHabits } = useHabits()
  const { user } = useUser()
  const [deleteConfirmTost, setDeleteConfirmTost] = useState(false)

  // Get current theme
  const currentTheme = localStorage.getItem('userTheme') || user?.theme || 'dark'

  // Theme configuration
  const themeConfig = {
    light: {
      // Backgrounds
      bgGradient: 'bg-gradient-to-br from-[#F1F0E8] to-[#E5E1DA]',
      cardBg: 'bg-gradient-to-br from-white to-[#F1F0E8]',
      innerCardBg: 'bg-gradient-to-br from-[#F1F0E8] to-[#E5E1DA]',

      // Text colors
      primaryText: 'text-[#2E3944]',
      secondaryText: 'text-[#5A6D74]',
      accentText: 'text-[#89A8B2]',

      // Borders
      cardBorder: 'border-[#B3C8CF]/40',
      innerBorder: 'border-[#B3C8CF]/30',

      // Gradients
      headerGradient: 'from-[#89A8B2] to-[#B3C8CF]',
      iconGradient: 'from-[#89A8B2] to-[#B3C8CF]',
      progressGradient: 'from-[#89A8B2] to-[#B3C8CF]',
      warningGradient: 'from-[#FF9A8B] to-[#FF6B6B]',

      // Backgrounds for elements
      statsBg: 'bg-[#F1F0E8]',
      detailsBg: 'bg-[#F1F0E8]',

      // Modal
      modalBg: 'bg-gradient-to-br from-white to-[#F1F0E8]',
      cancelBtn: 'bg-[#F1F0E8] text-[#5A6D74] border-[#B3C8CF]/40',

      // Progress bar
      progressBg: 'bg-[#E5E1DA]',
    },
    dark: {
      // Backgrounds
      bgGradient: 'bg-gradient-to-br from-[#212A31] to-[#2E3944]',
      cardBg: 'bg-gradient-to-br from-[#2E3944] to-[#212A31]',
      innerCardBg: 'bg-gradient-to-br from-[#212A31] to-[#2E3944]',

      // Text colors
      primaryText: 'text-[#D3D9D4]',
      secondaryText: 'text-[#748D92]',
      accentText: 'text-[#748D92]',

      // Borders
      cardBorder: 'border-[#748D92]/30',
      innerBorder: 'border-[#748D92]/20',

      // Gradients
      headerGradient: 'from-[#124E66] to-[#748D92]',
      iconGradient: 'from-[#124E66] to-[#748D92]',
      progressGradient: 'from-[#124E66] to-[#748D92]',
      warningGradient: 'from-[#8B0000] to-[#B22222]',

      // Backgrounds for elements
      statsBg: 'bg-[#212A31]',
      detailsBg: 'bg-[#212A31]',

      // Modal
      modalBg: 'bg-gradient-to-br from-[#2E3944] to-[#212A31]',
      cancelBtn: 'bg-[#212A31] text-[#748D92] border-[#748D92]/30',

      // Progress bar
      progressBg: 'bg-[#212A31]',
    }
  }

  // Get the theme styles based on currentTheme
  const theme = themeConfig[currentTheme] || themeConfig.dark

  const habit = habits.find(h => h._id === id)

  if (!habit) {
    return (
      <div className={`h-screen flex flex-col items-center justify-center ${theme.bgGradient}`}>
        <div className={`w-24 h-24 rounded-full bg-gradient-to-r ${theme.iconGradient} flex items-center justify-center mb-4`}>
          <i className={`ri-search-eye-line text-3xl ${theme.primaryText}`}></i>
        </div>
        <p className={`${theme.primaryText} text-lg font-['Merriweather']`}>Habit not found</p>
        <button
          onClick={() => navigate(-1)}
          className={`mt-4 px-6 py-2 bg-gradient-to-r ${theme.iconGradient} ${theme.primaryText} rounded-lg hover:opacity-90 transition`}
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
      if(response.status===200){
        await fetchHabits();
        console.log('Habit deleted successfully:', response.data);
      }

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

  // Helper function to get border color for divider
  const getDividerColor = () => {
    if (currentTheme === 'light') return 'via-[#B3C8CF]/30';
    return 'via-[#748D92]/30';
  };

  return (
    <div className={`flex flex-col h-screen ${theme.bgGradient}`}>

      {/* Header (Fixed) */}
      <div className={`fixed top-0 left-0 w-full bg-gradient-to-r ${theme.headerGradient} z-50 flex items-center justify-center py-4 shadow-lg`}>
        <button
          onClick={() => navigate(-1)}
          className={`absolute left-5 w-10 h-10 rounded-full ${currentTheme === 'light' ? 'bg-white/20' : 'bg-white/10'} backdrop-blur-sm flex items-center justify-center ${currentTheme === 'light' ? 'hover:bg-white/30' : 'hover:bg-white/20'} transition`}
        >
          <i className={`ri-arrow-left-line text-[20px] ${theme.primaryText}`}></i>
        </button>
        <h2 className={`text-[22px] font-bold ${theme.primaryText} font-['Merriweather'] tracking-wide`}>
          Habit Details
        </h2>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 mt-[70px] mb-[80px] overflow-y-auto px-6">

        {/* Main Habit Card */}
        <div className={`${theme.cardBg} rounded-2xl p-6 border ${theme.cardBorder} shadow-xl mb-6`}>
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${theme.iconGradient} flex items-center justify-center shadow-lg`}>
                <i className={`${getCategoryIcon(habit.title)} text-2xl ${theme.primaryText}`}></i>
              </div>
              <div>
                <h2 className={`text-[26px] font-['Merriweather'] font-bold ${theme.primaryText}`}>
                  {habit.title}
                </h2>
                <p className={`${theme.secondaryText} mt-1 font-['Source_Sans_Pro']`}>
                  {habit.description || "No description provided"}
                </p>
              </div>
            </div>

            {/* Completion Badge */}
            <div className="flex flex-col items-end">
              <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${theme.iconGradient} flex items-center justify-center`}>
                <span className={`font-['Montserrat'] font-bold ${theme.primaryText} text-xl`}>
                  {completionPercentage}%
                </span>
              </div>
              <span className={`${theme.secondaryText} text-xs mt-2`}>Completion</span>
            </div>
          </div>

          {/* Divider */}
          <div className={`h-px bg-gradient-to-r from-transparent ${getDividerColor()} to-transparent my-6`}></div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`${theme.statsBg} rounded-xl p-4 border ${theme.innerBorder}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${theme.iconGradient} flex items-center justify-center`}>
                  <i className={`ri-fire-line text-lg ${theme.primaryText}`}></i>
                </div>
                <div>
                  <p className={`${theme.secondaryText} text-xs`}>Current Streak</p>
                  <p className={`font-['Montserrat'] font-bold ${theme.primaryText} text-xl`}>{habit.streak} days</p>
                </div>
              </div>
            </div>

            <div className={`${theme.statsBg} rounded-xl p-4 border ${theme.innerBorder}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${theme.iconGradient} flex items-center justify-center`}>
                  <i className={`ri-trophy-line text-lg ${theme.primaryText}`}></i>
                </div>
                <div>
                  <p className={`${theme.secondaryText} text-xs`}>Longest Streak</p>
                  <p className={`font-['Montserrat'] font-bold ${theme.primaryText} text-xl`}>{habit.longestStreak} days</p>
                </div>
              </div>
            </div>

            <div className={`${theme.statsBg} rounded-xl p-4 border ${theme.innerBorder}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${theme.iconGradient} flex items-center justify-center`}>
                  <i className={`ri-repeat-line text-lg ${theme.primaryText}`}></i>
                </div>
                <div>
                  <p className={`${theme.secondaryText} text-xs`}>Frequency</p>
                  <p className={`font-['Montserrat'] font-bold ${theme.primaryText} text-lg`}>
                    {habit.frequency.charAt(0).toUpperCase() + habit.frequency?.slice(1)}
                  </p>
                </div>
              </div>
            </div>

            <div className={`${theme.statsBg} rounded-xl p-4 border ${theme.innerBorder}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${theme.iconGradient} flex items-center justify-center`}>
                  <i className={`ri-flag-line text-lg ${theme.primaryText}`}></i>
                </div>
                <div>
                  <p className={`${theme.secondaryText} text-xs`}>Weekly Target</p>
                  <p className={`font-['Montserrat'] font-bold ${theme.primaryText} text-xl`}>
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
            className={`flex-1 flex items-center justify-center gap-3 bg-gradient-to-r ${theme.iconGradient} ${theme.primaryText} py-4 rounded-xl hover:opacity-90 transition active:scale-95 font-['Source_Sans_Pro'] font-semibold`}
          >
            <i className="ri-edit-2-line text-lg"></i>
            Edit Habit
          </button>

          <button
            onClick={() => setDeleteConfirmTost(true)}
            className={`flex-1 flex items-center justify-center gap-3 bg-gradient-to-r ${theme.warningGradient} ${theme.primaryText} py-4 rounded-xl hover:opacity-90 transition active:scale-95 font-['Source_Sans_Pro'] font-semibold`}
          >
            <i className="ri-delete-bin-5-line text-lg"></i>
            Delete Habit
          </button>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendar Section */}
          <div className={`${theme.cardBg} rounded-2xl p-6 mb-5 border ${theme.cardBorder} shadow-xl`}>
            <div className="flex items-center gap-2 mb-6">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${theme.iconGradient} flex items-center justify-center`}>
                <i className={`ri-calendar-2-line text-lg ${theme.primaryText}`}></i>
              </div>
              <h3 className={`font-['Merriweather'] font-bold ${theme.primaryText} text-lg`}>
                Habit Calendar
              </h3>
            </div>
            <CalendarView history={habit.history || []} theme={currentTheme} />
          </div>

          {/* Additional Details */}
          <div className={`${theme.cardBg} rounded-2xl p-4 border h-[550px] ${theme.cardBorder} shadow-xl`}>
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${theme.iconGradient} flex items-center justify-center`}>
                <i className={`ri-information-line text-lg ${theme.primaryText}`}></i>
              </div>
              <h3 className={`font-['Merriweather'] font-bold ${theme.primaryText} text-lg`}>
                Additional Details
              </h3>
            </div>

            <div className="space-y-4">
              <div className={`flex items-center justify-between p-4 rounded-xl ${theme.detailsBg} border ${theme.innerBorder}`}>
                <div className="flex items-center gap-3">
                  <i className={`ri-calendar-event-line ${theme.secondaryText}`}></i>
                  <span className={`${theme.primaryText} font-['Source_Sans_Pro']`}>Start Date</span>
                </div>
                <span className={`${theme.primaryText} font-['Montserrat'] font-semibold`}>
                  {new Date(Number(habit.startDate)).toLocaleDateString('en-IN')}
                </span>
              </div>

              <div className={`flex items-center justify-between p-4 rounded-xl ${theme.detailsBg} border ${theme.innerBorder}`}>
                <div className="flex items-center gap-3">
                  <i className={`ri-history-line ${theme.secondaryText}`}></i>
                  <span className={`${theme.primaryText} font-['Source_Sans_Pro']`}>Total Days</span>
                </div>
                <span className={`${theme.primaryText} font-['Montserrat'] font-semibold`}>
                  {habit.history?.length || 0}
                </span>
              </div>

              <div className={`flex items-center justify-between p-4 rounded-xl ${theme.detailsBg} border ${theme.innerBorder}`}>
                <div className="flex items-center gap-3">
                  <i className={`ri-check-double-line ${theme.secondaryText}`}></i>
                  <span className={`${theme.primaryText} font-['Source_Sans_Pro']`}>Completed Days</span>
                </div>
                <span className={`${theme.primaryText} font-['Montserrat'] font-semibold`}>
                  {habit.history?.filter(h => h.completed).length || 0}
                </span>
              </div>

              <div className={`flex items-center justify-between p-4 rounded-xl ${theme.detailsBg} border ${theme.innerBorder}`}>
                <div className="flex items-center gap-3">
                  <i className={`ri-trending-up-line ${theme.secondaryText}`}></i>
                  <span className={`${theme.primaryText} font-['Source_Sans_Pro']`}>Consistency Rate</span>
                </div>
                <span className={`${theme.primaryText} font-['Montserrat'] font-semibold`}>
                  {completionPercentage}%
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-8">
              <div className="flex justify-between mb-2">
                <span className={`${theme.primaryText} text-sm`}>Overall Progress</span>
                <span className={`${theme.primaryText} font-['Montserrat'] font-semibold`}>
                  {completionPercentage}%
                </span>
              </div>
              <div className={`h-3 ${theme.progressBg} rounded-full overflow-hidden border ${theme.innerBorder}`}>
                <div
                  className={`h-full bg-gradient-to-r ${theme.progressGradient} rounded-full transition-all duration-500`}
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
          <div className={`${theme.modalBg} rounded-2xl w-[90%] max-w-md p-8 border ${theme.cardBorder} shadow-2xl`}>
            <div className="flex flex-col items-center text-center">
              <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${theme.warningGradient} flex items-center justify-center mb-6`}>
                <i className={`ri-delete-bin-5-line text-[30px] ${theme.primaryText}`}></i>
              </div>

              <h3 className={`font-['Merriweather'] font-bold ${theme.primaryText} text-2xl mb-3`}>
                Delete Habit
              </h3>

              <p className={`${theme.secondaryText} mb-8 font-['Source_Sans_Pro'] leading-relaxed`}>
                Are you sure you want to delete "{habit.title}"? This action cannot be undone and all progress will be lost.
              </p>

              <div className="flex gap-4 w-full">
                <button
                  onClick={() => setDeleteConfirmTost(false)}
                  className={`flex-1 py-3 ${theme.cancelBtn} rounded-xl hover:opacity-90 transition font-['Source_Sans_Pro'] font-semibold`}
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    setDeleteConfirmTost(false)
                    deleteHabit()
                    navigate(-1)
                  }}
                  className={`flex-1 py-3 bg-gradient-to-r ${theme.warningGradient} ${theme.primaryText} rounded-xl hover:opacity-90 transition font-['Source_Sans_Pro'] font-semibold`}
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