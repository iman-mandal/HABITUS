import React, { useState, useEffect } from 'react'
import AppLogo from '../Assets/HabitTrackerLogo.png'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'

const AddHabit = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [frequency, setFrequency] = useState('')
  const [targetPerWeek, setTargetPerWeek] = useState(7)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [category, setCategory] = useState('')
  const [icon, setIcon] = useState('🌱')

  const navigate = useNavigate()

  // Habit categories with icons (dark theme colors)
  const categories = [
    { id: 'health', label: 'Health & Fitness', icon: '💪', color: 'from-[#124E66] to-[#2E3944]' },
    { id: 'mind', label: 'Mind & Wellness', icon: '🧠', color: 'from-[#748D92] to-[#124E66]' },
    { id: 'learning', label: 'Learning', icon: '📚', color: 'from-[#D3D9D4] to-[#748D92]' },
    { id: 'productivity', label: 'Productivity', icon: '⚡', color: 'from-[#2E3944] to-[#124E66]' },
    { id: 'social', label: 'Social & Relationships', icon: '👥', color: 'from-[#FF6B6B] to-[#E74C3C]' },
    { id: 'other', label: 'Other', icon: '🌿', color: 'from-[#124E66] to-[#212A31]' },
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
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validation
    if (!frequency) {
      setError('Please select a frequency')
      setLoading(false)
      return
    }

    if (!category) {
      setError('Please select a category')
      setLoading(false)
      return
    }

    try {
      const newHabit = {
        title: title.trim(),
        description: description.trim(),
        frequency,
        targetPerWeek,
        category,
        icon
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/habit/createHabit`,
        newHabit,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )

      if (response.status === 201) {
        // Show success animation before navigating
        setTimeout(() => {
          navigate(-1)
        }, 1000)
      }
    } catch (err) {
      console.error('Error creating habit:', err)
      setError('Failed to create habit. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Dark theme background gradient
  const backgroundGradient = "bg-gradient-to-br from-[#212A31] via-[#2E3944] to-[#124E66]"

  return (
    <div className={`min-h-screen ${backgroundGradient}`}>
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-gradient-to-r from-[#748D92]/20 to-[#124E66]/20 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-gradient-to-r from-[#D3D9D4]/10 to-[#748D92]/10 blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#124E66] to-[#2E3944] px-6 pt-8 pb-6"
        >
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="w-12 h-12 rounded-full bg-[#748D92]/20 backdrop-blur-sm flex items-center justify-center hover:bg-[#748D92]/30 transition"
            >
              <span className="text-[#D3D9D4] text-2xl">←</span>
            </button>
            <div>
              <h1 className="font-['Merriweather'] text-[24px] font-bold text-[#D3D9D4]">
                New Habit
              </h1>
              <p className="font-['Source_Sans_Pro'] text-[#748D92] text-sm">
                Plant the seed of a new habit
              </p>
            </div>
          </div>

          {/* Habit Preview */}
          <div className="bg-[#748D92]/20 backdrop-blur-sm rounded-2xl p-4 border border-[#748D92]/30">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#748D92]/30 to-transparent flex items-center justify-center">
                <span className="text-3xl">{icon}</span>
              </div>
              <div className="flex-1">
                <h2 className="font-['Merriweather'] font-bold text-[#D3D9D4] text-lg truncate">
                  {title || 'Your Habit Name'}
                </h2>
                <p className="font-['Source_Sans_Pro'] text-[#748D92] text-sm line-clamp-2">
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
          <div className="bg-[#2E3944]/90 backdrop-blur-sm rounded-3xl border border-[#748D92]/20 shadow-2xl py-8 px-6">
            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-4 bg-gradient-to-r from-[#FF6B6B]/10 to-[#E74C3C]/10 rounded-xl border border-[#FF6B6B]/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FF6B6B] to-[#E74C3C] flex items-center justify-center">
                      <span className="text-white text-lg">!</span>
                    </div>
                    <p className="font-['Source_Sans_Pro'] text-[#FF6B6B] font-medium">
                      {error}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={submitHandler} className="space-y-6">
              {/* Title Input */}
              <div className="space-y-2">
                <label className="font-['Merriweather'] font-semibold text-[#D3D9D4] text-lg">
                  Habit Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="What habit do you want to build?"
                    className="w-full pl-5 pr-4 py-4 bg-[#212A31] border border-[#2E3944] rounded-xl outline-none focus:ring-2 focus:ring-[#124E66]/50 focus:border-[#124E66] transition-all font-['Merriweather'] text-[#D3D9D4] text-lg placeholder:text-[#748D92]"
                  />
                </div>
              </div>

              {/* Description Input */}
              <div className="space-y-2">
                <label className="font-['Merriweather'] font-semibold text-[#D3D9D4] text-lg">
                  Description
                </label>
                <div className="relative">
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Why is this habit important to you?"
                    rows="3"
                    className="w-full px-5 py-4 bg-[#212A31] border border-[#2E3944] rounded-xl outline-none focus:ring-2 focus:ring-[#124E66]/50 focus:border-[#124E66] transition-all font-['Source_Sans_Pro'] text-[#D3D9D4] resize-none placeholder:text-[#748D92]"
                  />
                </div>
              </div>

              {/* Category Selection */}
              <div className="space-y-2">
                <label className="font-['Merriweather'] font-semibold text-[#D3D9D4] text-lg">
                  Category
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 ${category === cat.id
                        ? `bg-gradient-to-r ${cat.color} border-[#748D92] scale-105 shadow-lg`
                        : 'bg-[#212A31] border-[#2E3944] hover:border-[#124E66]'
                        }`}
                    >
                      <span className="text-2xl mb-2">{cat.icon}</span>
                      <span className={`font-['Source_Sans_Pro'] font-semibold text-sm text-center ${category === cat.id ? 'text-[#D3D9D4]' : 'text-[#748D92]'
                        }`}>
                        {cat.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Frequency Selection */}
              <div className="space-y-2">
                <label className="font-['Merriweather'] font-semibold text-[#D3D9D4] text-lg">
                  Frequency
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {frequencyOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFrequency(option.value)}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 ${frequency === option.value
                        ? 'bg-gradient-to-r from-[#124E66] to-[#212A31] border-[#748D92] scale-105 shadow-lg'
                        : 'bg-[#212A31] border-[#2E3944] hover:border-[#124E66]'
                        }`}
                    >
                      <span className={`text-2xl mb-2 ${frequency === option.value ? 'text-[#D3D9D4]' : 'text-[#748D92]'
                        }`}>
                        {option.icon}
                      </span>
                      <span className={`font-['Source_Sans_Pro'] font-semibold text-sm ${frequency === option.value ? 'text-[#D3D9D4]' : 'text-[#748D92]'
                        }`}>
                        {option.label}
                      </span>
                      <span className={`text-xs mt-1 ${frequency === option.value ? 'text-[#D3D9D4]/80' : 'text-[#748D92]'
                        }`}>
                        {option.description}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Target per Week */}
              <div className="space-y-2">
                <label className="font-['Merriweather'] font-semibold text-[#D3D9D4] text-lg">
                  Weekly Target
                </label>
                <div className="bg-[#212A31] rounded-xl p-5 border border-[#2E3944]">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-['Source_Sans_Pro'] text-[#748D92] text-sm">
                        How many days per week?
                      </p>
                      <p className="font-['Source_Sans_Pro'] text-[#748D92]/80 text-xs">
                        Start small and build gradually
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-['Montserrat'] font-bold text-[#D3D9D4] text-2xl">
                        {targetPerWeek}
                      </span>
                      <span className="font-['Source_Sans_Pro'] text-[#748D92]">
                        days
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-4">
                    <button
                      type="button"
                      onClick={() => setTargetPerWeek(prev => Math.max(1, prev - 1))}
                      className="w-12 h-12 rounded-full bg-[#2E3944] border border-[#748D92]/30 flex items-center justify-center text-2xl font-bold text-[#D3D9D4] hover:scale-105 hover:border-[#748D92] transition"
                    >
                      -
                    </button>

                    <div className="w-40 h-2 bg-[#2E3944] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#124E66] to-[#748D92] rounded-full transition-all duration-300"
                        style={{ width: `${(targetPerWeek / 7) * 100}%` }}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => setTargetPerWeek(prev => Math.min(7, prev + 1))}
                      className="w-12 h-12 rounded-full bg-[#2E3944] border border-[#748D92]/30 flex items-center justify-center text-2xl font-bold text-[#D3D9D4] hover:scale-105 hover:border-[#748D92] transition"
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
                  ? 'bg-gradient-to-r from-[#2E3944] to-[#212A31] text-[#748D92] cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#124E66] to-[#212A31] text-[#D3D9D4] hover:shadow-xl hover:shadow-[#124E66]/20 active:scale-95'
                  }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-[#D3D9D4]/30 border-t-[#D3D9D4] rounded-full animate-spin"></div>
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
            <div className="mt-8 p-4 bg-gradient-to-r from-[#212A31] to-[#2E3944] rounded-xl border border-[#748D92]/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#D3D9D4] to-[#748D92] flex items-center justify-center">
                  <span className="text-[#212A31]">💡</span>
                </div>
                <h3 className="font-['Merriweather'] font-semibold text-[#D3D9D4]">
                  Pro Tip
                </h3>
              </div>
              <p className="font-['Source_Sans_Pro'] text-[#748D92] text-sm">
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