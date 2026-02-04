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

    // Dark theme background gradient
    const backgroundGradient = "bg-gradient-to-br from-[#212A31] via-[#2E3944] to-[#124E66]"

    // Get category color
    const getCategoryColor = () => {
        const selectedCat = categories.find(c => c.id === category)
        return selectedCat ? selectedCat.color : 'from-[#124E66] to-[#212A31]'
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
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#212A31] to-[#2E3944] flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl text-[#748D92]">🔍</span>
                    </div>
                    <h2 className="font-['Merriweather'] text-[#D3D9D4] text-xl mb-2">Habit not found</h2>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 bg-gradient-to-r from-[#124E66] to-[#212A31] text-[#D3D9D4] font-['Source_Sans_Pro'] font-semibold rounded-xl hover:shadow-lg hover:shadow-[#124E66]/20 transition"
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
                <div className="absolute top-10 right-10 w-40 h-40 rounded-full bg-gradient-to-r from-[#748D92]/20 to-[#124E66]/20 blur-3xl"></div>
                <div className="absolute bottom-10 left-10 w-60 h-60 rounded-full bg-gradient-to-r from-[#D3D9D4]/10 to-[#748D92]/10 blur-3xl"></div>
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
                            className="w-12 h-12 rounded-full bg-[#748D92]/20 backdrop-blur-sm flex items-center justify-center hover:scale-105 hover:bg-[#748D92]/30 transition"
                        >
                            <span className="text-[#D3D9D4] text-2xl">←</span>
                        </button>
                        <div>
                            <h1 className="font-['Merriweather'] text-[24px] font-bold text-[#D3D9D4]">
                                Edit Habit
                            </h1>
                            <p className="font-['Source_Sans_Pro'] text-[#748D92] text-sm">
                                Nurture and refine your growth
                            </p>
                        </div>
                    </div>

                    {/* Habit Preview */}
                    <div className="bg-[#748D92]/20 backdrop-blur-sm rounded-2xl p-4 border border-[#748D92]/30">
                        <div className="flex items-center gap-3">
                            <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${getCategoryColor()} flex items-center justify-center`}>
                                <span className="text-3xl">{getCategoryIcon()}</span>
                            </div>
                            <div className="flex-1">
                                <h2 className="font-['Merriweather'] font-bold text-[#D3D9D4] text-lg">
                                    {habit.title}
                                </h2>
                                <p className="font-['Source_Sans_Pro'] text-[#748D92] text-sm line-clamp-2">
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
                    <div className="bg-[#2E3944]/90 backdrop-blur-sm rounded-3xl border border-[#748D92]/20 shadow-2xl py-8 px-6">
                        {/* Messages */}
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

                            {success && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mb-6 p-4 bg-gradient-to-r from-[#748D92]/10 to-[#124E66]/10 rounded-xl border border-[#748D92]/30"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#748D92] to-[#124E66] flex items-center justify-center">
                                            <span className="text-[#D3D9D4] text-lg">✓</span>
                                        </div>
                                        <p className="font-['Source_Sans_Pro'] text-[#D3D9D4] font-medium">
                                            {success}
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={submitHandler} className="space-y-6">
                            {/* Description Input */}
                            <div className="space-y-2">
                                <label className="font-['Merriweather'] font-semibold text-[#D3D9D4] text-lg">
                                    Why this habit?
                                </label>
                                <div className="relative">
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Update why this habit is important to you..."
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
                                                Target days per week
                                            </p>
                                            <p className="font-['Source_Sans_Pro'] text-[#748D92]/80 text-xs">
                                                Adjust based on your current progress
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

                                    {/* Current vs Target */}
                                    <div className="mt-4 flex items-center justify-between text-sm">
                                        <span className="font-['Source_Sans_Pro'] text-[#748D92]">
                                            Current: {habit.streak || 0} day streak
                                        </span>
                                        <span className="font-['Source_Sans_Pro'] text-[#748D92]">
                                            Target: {targetPerWeek}/week
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Summary */}
                            <div className="bg-gradient-to-r from-[#212A31] to-[#2E3944] rounded-xl p-5 border border-[#748D92]/20">
                                <h3 className="font-['Merriweather'] font-semibold text-[#D3D9D4] mb-3">
                                    Current Progress
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="text-center">
                                        <p className="font-['Source_Sans_Pro'] text-[#748D92] text-xs mb-1">Current Streak</p>
                                        <p className="font-['Montserrat'] font-bold text-[#D3D9D4] text-lg">{habit.streak || 0} days</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="font-['Source_Sans_Pro'] text-[#748D92] text-xs mb-1">Best Streak</p>
                                        <p className="font-['Montserrat'] font-bold text-[#D3D9D4] text-lg">{habit.longestStreak || 0} days</p>
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
                        <div className="mt-8 p-4 bg-gradient-to-r from-[#212A31] to-[#2E3944] rounded-xl border border-[#748D92]/20">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#D3D9D4] to-[#748D92] flex items-center justify-center">
                                    <span className="text-[#212A31]">💡</span>
                                </div>
                                <h3 className="font-['Merriweather'] font-semibold text-[#D3D9D4]">
                                    Editing Tips
                                </h3>
                            </div>
                            <p className="font-['Source_Sans_Pro'] text-[#748D92] text-sm">
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