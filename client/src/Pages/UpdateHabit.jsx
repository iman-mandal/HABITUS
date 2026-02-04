import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { useHabits } from '../context/HabitContext'
import { motion, AnimatePresence } from 'framer-motion'

const UpdateHabit = () => {
    const { id } = useParams()
    const { habits } = useHabits()
    const habit = habits.find(h => h._id === id)

    const [description, setDescription] = useState('')
    const [frequency, setFrequency] = useState('')
    const [targetPerWeek, setTargetPerWeek] = useState(0)
    const [category, setCategory] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

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

    // Initialize form with habit data
    useEffect(() => {
        if (habit) {
            setDescription(habit.description || '')
            setFrequency(habit.frequency || '')
            setTargetPerWeek(habit.targetPerWeek || 0)
            setCategory(habit.category || '')
        }
    }, [habit])

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            navigate('/login')
        }
    }, [navigate])

    const submitHandler = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess('')

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
            const updatedHabit = {
                description: description.trim(),
                frequency,
                targetPerWeek,
                category
            }

            const response = await axios.put(
                `${import.meta.env.VITE_BASE_URL}/habit/${habit._id}`,
                updatedHabit,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            )

            if (response.status === 200) {
                setSuccess('Habit updated successfully!')
                setTimeout(() => {
                    navigate(-1)
                }, 1500)
            }
        } catch (err) {
            console.error('Error updating habit:', err)
            setError('Failed to update habit. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    // Nature-themed background gradient
    const backgroundGradient = "bg-gradient-to-br from-[#F5E8C7] via-[#E8F5E9] to-[#D4EDDA]"

    // Get category color
    const getCategoryColor = () => {
        const selectedCat = categories.find(c => c.id === category)
        return selectedCat ? selectedCat.color : 'from-[#6B8E23] to-[#4A7C3F]'
    }

    // Get category icon
    const getCategoryIcon = () => {
        const selectedCat = categories.find(c => c.id === category)
        return selectedCat ? selectedCat.icon : '🌿'
    }

    if (!habit) {
        return (
            <div className={`min-h-screen ${backgroundGradient} flex items-center justify-center`}>
                <div className="text-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#F5E8C7] to-[#E8F5E9] flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl">🔍</span>
                    </div>
                    <h2 className="font-['Merriweather'] text-[#2D5A27] text-xl mb-2">Habit not found</h2>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 bg-gradient-to-r from-[#4A7C3F] to-[#2D5A27] text-white font-['Source_Sans_Pro'] font-semibold rounded-xl hover:shadow-lg transition"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className={`min-h-screen ${backgroundGradient}`}>
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-10 right-10 w-40 h-40 rounded-full bg-gradient-to-r from-[#FFD166]/20 to-[#FFB347]/10 blur-3xl"></div>
                <div className="absolute bottom-10 left-10 w-60 h-60 rounded-full bg-gradient-to-r from-[#4A7C3F]/10 to-[#2D5A27]/10 blur-3xl"></div>
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
                            className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:scale-105 transition"
                        >
                            <span className="text-white text-2xl">←</span>
                        </button>
                        <div>
                            <h1 className="font-['Merriweather'] text-[24px] font-bold text-white">
                                Edit Habit
                            </h1>
                            <p className="font-['Source_Sans_Pro'] text-white/80 text-sm">
                                Nurture and refine your growth
                            </p>
                        </div>
                    </div>

                    {/* Habit Preview */}
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
                        <div className="flex items-center gap-3">
                            <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${getCategoryColor()} flex items-center justify-center`}>
                                <span className="text-3xl">{getCategoryIcon()}</span>
                            </div>
                            <div className="flex-1">
                                <h2 className="font-['Merriweather'] font-bold text-white text-lg">
                                    {habit.title}
                                </h2>
                                <p className="font-['Source_Sans_Pro'] text-white/80 text-sm line-clamp-2">
                                    Current streak: {habit.streak || 0} days
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
                        {/* Messages */}
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

                            {success && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mb-6 p-4 bg-gradient-to-r from-[#E8F5E9] to-[#D4EDDA] rounded-xl border border-[#4CAF50]/30"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#4CAF50] to-[#2D5A27] flex items-center justify-center">
                                            <span className="text-white text-lg">✓</span>
                                        </div>
                                        <p className="font-['Source_Sans_Pro'] text-[#2D5A27] font-medium">
                                            {success}
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={submitHandler} className="space-y-6">
                            {/* Description Input */}
                            <div className="space-y-2">
                                <label className="font-['Merriweather'] font-semibold text-[#2D5A27] text-lg">
                                    Why this habit?
                                </label>
                                <div className="relative">
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Update why this habit is important to you..."
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
                                                Target days per week
                                            </p>
                                            <p className="font-['Source_Sans_Pro'] text-[#7A7A7A] text-xs">
                                                Adjust based on your current progress
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

                                    {/* Current vs Target */}
                                    <div className="mt-4 flex items-center justify-between text-sm">
                                        <span className="font-['Source_Sans_Pro'] text-[#5D6D55]">
                                            Current: {habit.streak || 0} day streak
                                        </span>
                                        <span className="font-['Source_Sans_Pro'] text-[#5D6D55]">
                                            Target: {targetPerWeek}/week
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Summary */}
                            <div className="bg-gradient-to-r from-[#F5E8C7] to-[#E8F5E9] rounded-xl p-5 border border-[#E0E6D6]">
                                <h3 className="font-['Merriweather'] font-semibold text-[#2D5A27] mb-3">
                                    Current Progress
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="text-center">
                                        <p className="font-['Source_Sans_Pro'] text-[#5D6D55] text-xs mb-1">Current Streak</p>
                                        <p className="font-['Montserrat'] font-bold text-[#2D5A27] text-lg">{habit.streak || 0} days</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="font-['Source_Sans_Pro'] text-[#5D6D55] text-xs mb-1">Best Streak</p>
                                        <p className="font-['Montserrat'] font-bold text-[#2D5A27] text-lg">{habit.longestStreak || 0} days</p>
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
                                        <span>Updating habit...</span>
                                    </div>
                                ) : (
                                    <>
                                        <span>Save Changes</span>
                                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                            <span className="text-2xl">🌿</span>
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
                                    Editing Tips
                                </h3>
                            </div>
                            <p className="font-['Source_Sans_Pro'] text-[#5D6D55] text-sm">
                                Adjust your target based on your current streak. If you're consistently hitting your target, consider increasing it by 1-2 days. If you're struggling, it's okay to lower the target to build consistency.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default UpdateHabit