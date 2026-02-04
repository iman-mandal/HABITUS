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

  // Habit categories with icons
  const categories = [
    { id: 'health', label: 'Health & Fitness', icon: '💪', color: 'from-[#4CAF50] to-[#2D5A27]' },
    { id: 'mind', label: 'Mind & Wellness', icon: '🧠', color: 'from-[#87CEEB] to-[#3498DB]' },
    { id: 'learning', label: 'Learning', icon: '📚', color: 'from-[#9B59B6] to-[#8E44AD]' },
    { id: 'productivity', label: 'Productivity', icon: '⚡', color: 'from-[#FFD166] to-[#FFB347]' },
    { id: 'social', label: 'Social & Relationships', icon: '👥', color: 'from-[#FF6B6B] to-[#E74C3C]' },
    { id: 'other', label: 'Other', icon: '🌿', color: 'from-[#6B8E23] to-[#4A7C3F]' },
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

  // Nature-themed background gradient
  const backgroundGradient = "bg-gradient-to-br from-[#F5E8C7] via-[#E8F5E9] to-[#D4EDDA]"

  return (
    <div className={`min-h-screen ${backgroundGradient}`}>
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-gradient-to-r from-[#FFD166]/20 to-[#FFB347]/10 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-gradient-to-r from-[#4A7C3F]/10 to-[#2D5A27]/10 blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#2D5A27] to-[#4A7C3F] px-6 pt-8 pb-6"
        >
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
            >
              <span className="text-white text-2xl">←</span>
            </button>
            <div>
              <h1 className="font-['Merriweather'] text-[24px] font-bold text-white">
                New Habit
              </h1>
              <p className="font-['Source_Sans_Pro'] text-white/80 text-sm">
                Plant the seed of a new habit
              </p>
            </div>
          </div>

          {/* Habit Preview */}
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-white/30 to-transparent flex items-center justify-center">
                <span className="text-3xl">{icon}</span>
              </div>
              <div className="flex-1">
                <h2 className="font-['Merriweather'] font-bold text-white text-lg truncate">
                  {title || 'Your Habit Name'}
                </h2>
                <p className="font-['Source_Sans_Pro'] text-white/80 text-sm line-clamp-2">
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
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/40 shadow-2xl py-8 px-6">
            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-4 bg-gradient-to-r from-[#FFE8E8] to-[#FFC9C9] rounded-xl border border-[#FF6B6B]/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FF6B6B] to-[#E74C3C] flex items-center justify-center">
                      <span className="text-white text-lg">!</span>
                    </div>
                    <p className="font-['Source_Sans_Pro'] text-[#E74C3C] font-medium">
                      {error}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={submitHandler} className="space-y-6">
              {/* Title Input */}
              <div className="space-y-2">
                <label className="font-['Merriweather'] font-semibold text-[#2D5A27] text-lg">
                  Habit Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="What habit do you want to build?"
                    className="w-full pl-5 pr-4 py-4 bg-gradient-to-r from-[#F9FBF5] to-[#F0F8E8] border border-[#E0E6D6] rounded-xl outline-none focus:ring-2 focus:ring-[#4A7C3F]/30 focus:border-[#4A7C3F] transition-all font-['Merriweather'] text-[#2D5A27] text-lg placeholder:text-[#7A7A7A]"
                  />
                </div>
              </div>

              {/* Description Input */}
              <div className="space-y-2">
                <label className="font-['Merriweather'] font-semibold text-[#2D5A27] text-lg">
                  Description
                </label>
                <div className="relative">
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Why is this habit important to you?"
                    rows="3"
                    className="w-full px-5 py-4 bg-gradient-to-r from-[#F9FBF5] to-[#F0F8E8] border border-[#E0E6D6] rounded-xl outline-none focus:ring-2 focus:ring-[#4A7C3F]/30 focus:border-[#4A7C3F] transition-all font-['Source_Sans_Pro'] text-[#2D5A27] resize-none placeholder:text-[#7A7A7A]"
                  />
                </div>
              </div>

              {/* Category Selection */}
              <div className="space-y-2">
                <label className="font-['Merriweather'] font-semibold text-[#2D5A27] text-lg">
                  Category
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 ${category === cat.id
                          ? `bg-gradient-to-r ${cat.color} border-white scale-105 shadow-lg`
                          : 'bg-gradient-to-r from-[#F9FBF5] to-[#F0F8E8] border-[#E0E6D6] hover:border-[#4A7C3F]'
                        }`}
                    >
                      <span className="text-2xl mb-2">{cat.icon}</span>
                      <span className={`font-['Source_Sans_Pro'] font-semibold text-sm text-center ${category === cat.id ? 'text-white' : 'text-[#2D5A27]'
                        }`}>
                        {cat.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Frequency Selection */}
              <div className="space-y-2">
                <label className="font-['Merriweather'] font-semibold text-[#2D5A27] text-lg">
                  Frequency
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {frequencyOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFrequency(option.value)}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 ${frequency === option.value
                          ? 'bg-gradient-to-r from-[#4A7C3F] to-[#2D5A27] border-white scale-105 shadow-lg'
                          : 'bg-gradient-to-r from-[#F9FBF5] to-[#F0F8E8] border-[#E0E6D6] hover:border-[#4A7C3F]'
                        }`}
                    >
                      <span className={`text-2xl mb-2 ${frequency === option.value ? 'text-white' : 'text-[#2D5A27]'
                        }`}>
                        {option.icon}
                      </span>
                      <span className={`font-['Source_Sans_Pro'] font-semibold text-sm ${frequency === option.value ? 'text-white' : 'text-[#2D5A27]'
                        }`}>
                        {option.label}
                      </span>
                      <span className={`text-xs mt-1 ${frequency === option.value ? 'text-white/80' : 'text-[#7A7A7A]'
                        }`}>
                        {option.description}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Target per Week */}
              <div className="space-y-2">
                <label className="font-['Merriweather'] font-semibold text-[#2D5A27] text-lg">
                  Weekly Target
                </label>
                <div className="bg-gradient-to-r from-[#F9FBF5] to-[#F0F8E8] rounded-xl p-5 border border-[#E0E6D6]">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-['Source_Sans_Pro'] text-[#5D6D55] text-sm">
                        How many days per week?
                      </p>
                      <p className="font-['Source_Sans_Pro'] text-[#7A7A7A] text-xs">
                        Start small and build gradually
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-['Montserrat'] font-bold text-[#2D5A27] text-2xl">
                        {targetPerWeek}
                      </span>
                      <span className="font-['Source_Sans_Pro'] text-[#5D6D55]">
                        days
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-4">
                    <button
                      type="button"
                      onClick={() => setTargetPerWeek(prev => Math.max(1, prev - 1))}
                      className="w-12 h-12 rounded-full bg-gradient-to-r from-[#F5E8C7] to-[#E8F5E9] border border-[#E0E6D6] flex items-center justify-center text-2xl font-bold text-[#2D5A27] hover:scale-105 transition"
                    >
                      -
                    </button>

                    <div className="w-40 h-2 bg-gradient-to-r from-[#F5E8C7] to-[#E8F5E9] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#4A7C3F] to-[#2D5A27] rounded-full transition-all duration-300"
                        style={{ width: `${(targetPerWeek / 7) * 100}%` }}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => setTargetPerWeek(prev => Math.min(7, prev + 1))}
                      className="w-12 h-12 rounded-full bg-gradient-to-r from-[#F5E8C7] to-[#E8F5E9] border border-[#E0E6D6] flex items-center justify-center text-2xl font-bold text-[#2D5A27] hover:scale-105 transition"
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
                    ? 'bg-gradient-to-r from-[#7A7A7A] to-[#5D6D55] text-white cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#4A7C3F] to-[#2D5A27] text-white hover:shadow-xl active:scale-95'
                  }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
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
            <div className="mt-8 p-4 bg-gradient-to-r from-[#F5E8C7] to-[#E8F5E9] rounded-xl border border-[#E0E6D6]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FFD166] to-[#FFB347] flex items-center justify-center">
                  <span className="text-white">💡</span>
                </div>
                <h3 className="font-['Merriweather'] font-semibold text-[#2D5A27]">
                  Pro Tip
                </h3>
              </div>
              <p className="font-['Source_Sans_Pro'] text-[#5D6D55] text-sm">
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