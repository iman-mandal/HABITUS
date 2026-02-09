import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { useUser } from '../context/UserContext'
import { useHabits } from '../context/HabitContext'

const AddHabit = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [frequency, setFrequency] = useState('')
  const [targetPerWeek, setTargetPerWeek] = useState(7)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [category, setCategory] = useState('')
  const [icon, setIcon] = useState('🌱')
  const { fetchHabits } = useHabits();
  const navigate = useNavigate()
  const { user } = useUser()

  // Get current theme
  const currentTheme = localStorage.getItem('userTheme') || 'dark' || user.theme;

  // Theme configuration
  const themeConfig = {
    light: {
      // Main backgrounds
      bgGradient: 'bg-gradient-to-br from-[#F1F0E8] via-[#E5E1DA] to-[#B3C8CF]',
      headerGradient: 'from-[#89A8B2] to-[#B3C8CF]',
      formBg: 'bg-white/90',

      // Text colors
      primaryText: 'text-[#2E3944]',
      secondaryText: 'text-[#5A6D74]',
      accentText: 'text-[#89A8B2]',

      // Borders
      cardBorder: 'border-[#B3C8CF]/40',
      inputBorder: 'border-[#E5E1DA]',
      inputFocusBorder: 'border-[#89A8B2]',
      inputFocusRing: 'ring-[#89A8B2]/50',

      // Input backgrounds
      inputBg: 'bg-white',
      previewBg: 'bg-[#B3C8CF]/20',
      previewBorder: 'border-[#B3C8CF]/30',

      // Category colors
      categoryColors: {
        health: 'from-[#89A8B2] to-[#5A6D74]',
        mind: 'from-[#B3C8CF] to-[#89A8B2]',
        learning: 'from-[#E5E1DA] to-[#B3C8CF]',
        productivity: 'from-[#5A6D74] to-[#89A8B2]',
        social: 'from-[#FF9A8B] to-[#FF6B6B]',
        other: 'from-[#89A8B2] to-[#2E3944]',
      },

      // Button colors
      buttonEnabled: 'bg-gradient-to-r from-[#89A8B2] to-[#5A6D74] text-white',
      buttonDisabled: 'bg-gradient-to-r from-[#E5E1DA] to-[#F1F0E8] text-[#5A6D74]',
      buttonHover: 'hover:shadow-xl hover:shadow-[#89A8B2]/20',

      // Progress bar
      progressBg: 'bg-[#E5E1DA]',
      progressFill: 'from-[#89A8B2] to-[#B3C8CF]',

      // Error
      errorBg: 'bg-gradient-to-r from-[#FF9A8B]/10 to-[#FF6B6B]/10',
      errorBorder: 'border-[#FF9A8B]/30',
      errorText: 'text-[#FF6B6B]',

      // Tips box
      tipsBg: 'bg-gradient-to-r from-[#F1F0E8] to-[#E5E1DA]',
      tipsBorder: 'border-[#B3C8CF]/20',
      tipsIconBg: 'from-[#2E3944] to-[#5A6D74]',
      tipsIconText: 'text-white',

      // Control buttons
      controlBtn: 'bg-white border-[#B3C8CF]/40 text-[#2E3944]',
      controlBtnHover: 'hover:border-[#89A8B2]',

      // Back button
      backBtn: 'bg-[#B3C8CF]/20',
      backBtnHover: 'hover:bg-[#B3C8CF]/30',

      // Spinner
      spinnerBorder: 'border-[#5A6D74]/30 border-t-[#5A6D74]',
    },
    dark: {
      // Main backgrounds
      bgGradient: 'bg-gradient-to-br from-[#212A31] via-[#2E3944] to-[#124E66]',
      headerGradient: 'from-[#124E66] to-[#2E3944]',
      formBg: 'bg-[#2E3944]/90',

      // Text colors
      primaryText: 'text-[#D3D9D4]',
      secondaryText: 'text-[#748D92]',
      accentText: 'text-[#748D92]',

      // Borders
      cardBorder: 'border-[#748D92]/20',
      inputBorder: 'border-[#2E3944]',
      inputFocusBorder: 'border-[#124E66]',
      inputFocusRing: 'ring-[#124E66]/50',

      // Input backgrounds
      inputBg: 'bg-[#212A31]',
      previewBg: 'bg-[#748D92]/20',
      previewBorder: 'border-[#748D92]/30',

      // Category colors
      categoryColors: {
        health: 'from-[#124E66] to-[#2E3944]',
        mind: 'from-[#748D92] to-[#124E66]',
        learning: 'from-[#D3D9D4] to-[#748D92]',
        productivity: 'from-[#2E3944] to-[#124E66]',
        social: 'from-[#FF6B6B] to-[#E74C3C]',
        other: 'from-[#124E66] to-[#212A31]',
      },

      // Button colors
      buttonEnabled: 'bg-gradient-to-r from-[#124E66] to-[#212A31] text-[#D3D9D4]',
      buttonDisabled: 'bg-gradient-to-r from-[#2E3944] to-[#212A31] text-[#748D92]',
      buttonHover: 'hover:shadow-xl hover:shadow-[#124E66]/20',

      // Progress bar
      progressBg: 'bg-[#2E3944]',
      progressFill: 'from-[#124E66] to-[#748D92]',

      // Error
      errorBg: 'bg-gradient-to-r from-[#FF6B6B]/10 to-[#E74C3C]/10',
      errorBorder: 'border-[#FF6B6B]/30',
      errorText: 'text-[#FF6B6B]',

      // Tips box
      tipsBg: 'bg-gradient-to-r from-[#212A31] to-[#2E3944]',
      tipsBorder: 'border-[#748D92]/20',
      tipsIconBg: 'from-[#D3D9D4] to-[#748D92]',
      tipsIconText: 'text-[#212A31]',

      // Control buttons
      controlBtn: 'bg-[#2E3944] border-[#748D92]/30 text-[#D3D9D4]',
      controlBtnHover: 'hover:border-[#748D92]',

      // Back button
      backBtn: 'bg-[#748D92]/20',
      backBtnHover: 'hover:bg-[#748D92]/30',

      // Spinner
      spinnerBorder: 'border-[#D3D9D4]/30 border-t-[#D3D9D4]',
    }
  }

  const theme = themeConfig[currentTheme]

  // Habit categories with icons
  const categories = [
    { id: 'health', label: 'Health & Fitness', icon: '💪', color: theme.categoryColors.health },
    { id: 'mind', label: 'Mind & Wellness', icon: '🧠', color: theme.categoryColors.mind },
    { id: 'learning', label: 'Learning', icon: '📚', color: theme.categoryColors.learning },
    { id: 'productivity', label: 'Productivity', icon: '⚡', color: theme.categoryColors.productivity },
    { id: 'social', label: 'Social & Relationships', icon: '👥', color: theme.categoryColors.social },
    { id: 'other', label: 'Other', icon: '🌿', color: theme.categoryColors.other },
  ]

  // Frequency options
  const frequencyOptions = [
    { value: 'daily', label: 'Daily', description: 'Every day', icon: '🌅' },
    { value: 'weekly', label: 'Weekly', description: 'Several times a week', icon: '📅' },
    { value: 'monthly', label: 'Monthly', description: 'Once a month', icon: '🗓️' },
  ]

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
    }
  }, [navigate])

  // Update icon based on category
  useEffect(() => {
    const selectedCat = categories.find(c => c.id === category)
    if (selectedCat) {
      setIcon(selectedCat.icon)
    }
  }, [category])

  const submitHandler = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    // Validation
    if (!frequency) {
      setError('Please select a frequency');
      setLoading(false);
      return;
    }

    if (!category) {
      setError('Please select a category');
      setLoading(false);
      return;
    }

    if (!title.trim() || !description.trim()) {
      setError('Title and description are required');
      setLoading(false);
      return;
    }

    try {
      const newHabit = {
        title: title.trim(),
        description: description.trim(),
        frequency,
        targetPerWeek,
        category,
        icon
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/habit/createHabit`,
        newHabit,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.status === 201) {
        await fetchHabits();
        // Optional success UI delay
        setTimeout(() => {
          navigate(-1);
        }, 800);
      }

    } catch (err) {
      console.error('Error creating habit:', err?.response?.data || err.message);
      setError(err?.response?.data?.message || 'Failed to create habit');
    } finally {
      setLoading(false);
    }
  };




  return (
    <div className={`min-h-screen ${theme.bgGradient}`}>
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-10 left-10 w-40 h-40 rounded-full bg-gradient-to-r ${currentTheme === 'light' ? 'from-[#B3C8CF]/20 to-[#89A8B2]/20' : 'from-[#748D92]/20 to-[#124E66]/20'} blur-3xl`}></div>
        <div className={`absolute bottom-10 right-10 w-60 h-60 rounded-full bg-gradient-to-r ${currentTheme === 'light' ? 'from-[#F1F0E8]/10 to-[#B3C8CF]/10' : 'from-[#D3D9D4]/10 to-[#748D92]/10'} blur-3xl`}></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-gradient-to-r ${theme.headerGradient} px-6 pt-8 pb-6`}
        >
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className={`w-12 h-12 rounded-full ${theme.backBtn} backdrop-blur-sm flex items-center justify-center ${theme.backBtnHover} transition`}
            >
              <span className={`${theme.primaryText} text-2xl`}>←</span>
            </button>
            <div>
              <h1 className={`font-['Merriweather'] text-[24px] font-bold ${theme.primaryText}`}>
                New Habit
              </h1>
              <p className={`font-['Source_Sans_Pro'] ${theme.secondaryText} text-sm`}>
                Plant the seed of a new habit
              </p>
            </div>
          </div>

          {/* Habit Preview */}
          <div className={`${theme.previewBg} backdrop-blur-sm rounded-2xl p-4 border ${theme.previewBorder}`}>
            <div className="flex items-center gap-3">
              <div className={`w-16 h-16 rounded-full ${currentTheme === 'light' ? 'bg-[#B3C8CF]/30' : 'bg-[#748D92]/30'} to-transparent flex items-center justify-center`}>
                <span className="text-3xl">{icon}</span>
              </div>
              <div className="flex-1">
                <h2 className={`font-['Merriweather'] font-bold ${theme.primaryText} text-lg truncate`}>
                  {title || 'Your Habit Name'}
                </h2>
                <p className={`font-['Source_Sans_Pro'] ${theme.secondaryText} text-sm line-clamp-2`}>
                  {description || 'Add a description...'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="px-6 py-8"
        >
          <div className={`${theme.formBg} backdrop-blur-sm rounded-3xl border ${theme.cardBorder} shadow-2xl py-8 px-6`}>
            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`mb-6 p-4 ${theme.errorBg} rounded-xl border ${theme.errorBorder}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${currentTheme === 'light' ? 'bg-gradient-to-r from-[#FF9A8B] to-[#FF6B6B]' : 'bg-gradient-to-r from-[#FF6B6B] to-[#E74C3C]'} flex items-center justify-center`}>
                      <span className="text-white text-lg">!</span>
                    </div>
                    <p className={`font-['Source_Sans_Pro'] ${theme.errorText} font-medium`}>
                      {error}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={submitHandler} className="space-y-6">
              {/* Title Input */}
              <div className="space-y-2">
                <label className={`font-['Merriweather'] font-semibold ${theme.primaryText} text-lg`}>
                  Habit Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="What habit do you want to build?"
                    className={`w-full pl-5 pr-4 py-4 ${theme.inputBg} border ${theme.inputBorder} rounded-xl outline-none focus:ring-2 ${theme.inputFocusRing} focus:border-${currentTheme === 'light' ? '[#89A8B2]' : '[#124E66]'} transition-all font-['Merriweather'] ${theme.primaryText} text-lg placeholder:${theme.secondaryText}`}
                  />
                </div>
              </div>

              {/* Description Input */}
              <div className="space-y-2">
                <label className={`font-['Merriweather'] font-semibold ${theme.primaryText} text-lg`}>
                  Description
                </label>
                <div className="relative">
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Why is this habit important to you?"
                    rows="3"
                    className={`w-full px-5 py-4 ${theme.inputBg} border ${theme.inputBorder} rounded-xl outline-none focus:ring-2 ${theme.inputFocusRing} focus:border-${currentTheme === 'light' ? '[#89A8B2]' : '[#124E66]'} transition-all font-['Source_Sans_Pro'] ${theme.primaryText} resize-none placeholder:${theme.secondaryText}`}
                  />
                </div>
              </div>

              {/* Category Selection */}
              <div className="space-y-2">
                <label className={`font-['Merriweather'] font-semibold ${theme.primaryText} text-lg`}>
                  Category
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 ${category === cat.id
                        ? `bg-gradient-to-r ${cat.color} ${currentTheme === 'light' ? 'border-[#89A8B2]' : 'border-[#748D92]'} scale-105 shadow-lg`
                        : `${theme.inputBg} ${theme.inputBorder} ${currentTheme === 'light' ? 'hover:border-[#89A8B2]' : 'hover:border-[#124E66]'}`
                        }`}
                    >
                      <span className="text-2xl mb-2">{cat.icon}</span>
                      <span className={`font-['Source_Sans_Pro'] font-semibold text-sm text-center ${category === cat.id ? theme.primaryText : theme.secondaryText
                        }`}>
                        {cat.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Frequency Selection */}
              <div className="space-y-2">
                <label className={`font-['Merriweather'] font-semibold ${theme.primaryText} text-lg`}>
                  Frequency
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {frequencyOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFrequency(option.value)}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 ${frequency === option.value
                        ? `${currentTheme === 'light' ? 'bg-gradient-to-r from-[#89A8B2] to-[#5A6D74]' : 'bg-gradient-to-r from-[#124E66] to-[#212A31]'} ${currentTheme === 'light' ? 'border-[#89A8B2]' : 'border-[#748D92]'} scale-105 shadow-lg`
                        : `${theme.inputBg} ${theme.inputBorder} ${currentTheme === 'light' ? 'hover:border-[#89A8B2]' : 'hover:border-[#124E66]'}`
                        }`}
                    >
                      <span className={`text-2xl mb-2 ${frequency === option.value ? theme.primaryText : theme.secondaryText
                        }`}>
                        {option.icon}
                      </span>
                      <span className={`font-['Source_Sans_Pro'] font-semibold text-sm ${frequency === option.value ? theme.primaryText : theme.secondaryText
                        }`}>
                        {option.label}
                      </span>
                      <span className={`text-xs mt-1 ${frequency === option.value ? `${theme.primaryText}/80` : theme.secondaryText
                        }`}>
                        {option.description}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Target per Week */}
              <div className="space-y-2">
                <label className={`font-['Merriweather'] font-semibold ${theme.primaryText} text-lg`}>
                  Weekly Target
                </label>
                <div className={`${theme.inputBg} rounded-xl p-5 border ${theme.inputBorder}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className={`font-['Source_Sans_Pro'] ${theme.secondaryText} text-sm`}>
                        How many days per week?
                      </p>
                      <p className={`font-['Source_Sans_Pro'] ${theme.secondaryText}/80 text-xs`}>
                        Start small and build gradually
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`font-['Montserrat'] font-bold ${theme.primaryText} text-2xl`}>
                        {targetPerWeek}
                      </span>
                      <span className={`font-['Source_Sans_Pro'] ${theme.secondaryText}`}>
                        days
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-4">
                    <button
                      type="button"
                      onClick={() => setTargetPerWeek(prev => Math.max(1, prev - 1))}
                      className={`w-12 h-12 rounded-full ${theme.controlBtn} flex items-center justify-center text-2xl font-bold ${theme.primaryText} hover:scale-105 ${theme.controlBtnHover} transition`}
                    >
                      -
                    </button>

                    <div className={`w-40 h-2 ${theme.progressBg} rounded-full overflow-hidden`}>
                      <div
                        className={`h-full bg-gradient-to-r ${theme.progressFill} rounded-full transition-all duration-300`}
                        style={{ width: `${(targetPerWeek / 7) * 100}%` }}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => setTargetPerWeek(prev => Math.min(7, prev + 1))}
                      className={`w-12 h-12 rounded-full ${theme.controlBtn} flex items-center justify-center text-2xl font-bold ${theme.primaryText} hover:scale-105 ${theme.controlBtnHover} transition`}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading || !frequency || !category}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className={`w-full py-5 rounded-xl font-['Source_Sans_Pro'] font-semibold text-lg transition-all relative overflow-hidden mt-4 ${loading || !frequency || !category
                  ? `${theme.buttonDisabled} cursor-not-allowed`
                  : `${theme.buttonEnabled} ${theme.buttonHover} active:scale-95`
                  }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className={`w-5 h-5 border-2 ${theme.spinnerBorder} rounded-full animate-spin`}></div>
                    <span>Planting habit...</span>
                  </div>
                ) : (
                  <>
                    <span>Plant This Habit</span>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <span className="text-2xl">🌱</span>
                    </div>
                  </>
                )}
              </motion.button>
            </form>

            {/* Tips */}
            <div className={`mt-8 p-4 ${theme.tipsBg} rounded-xl border ${theme.tipsBorder}`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${theme.tipsIconBg} flex items-center justify-center`}>
                  <span className={theme.tipsIconText}>💡</span>
                </div>
                <h3 className={`font-['Merriweather'] font-semibold ${theme.primaryText}`}>
                  Pro Tip
                </h3>
              </div>
              <p className={`font-['Source_Sans_Pro'] ${theme.secondaryText} text-sm`}>
                Start with a small, achievable target. It's better to consistently achieve 3 days per week than to aim for 7 and get discouraged.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AddHabit