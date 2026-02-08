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
  const isLightTheme = currentTheme === 'light';
  const themeClass = isLightTheme ? 'light-theme' : 'dark-theme';

  // Habit categories
  const categories = [
    { id: 'health', label: 'Health & Fitness', icon: '💪' },
    { id: 'mind', label: 'Mind & Wellness', icon: '🧠' },
    { id: 'learning', label: 'Learning', icon: '📚' },
    { id: 'productivity', label: 'Productivity', icon: '⚡' },
    { id: 'social', label: 'Social & Relationships', icon: '👥' },
    { id: 'other', label: 'Other', icon: '🌿' },
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
    <div className={`add-habit-container ${themeClass}`}>
      {/* Decorative elements */}
      <div className="add-habit-absolute add-habit-inset-0 add-habit-overflow-hidden">
        <div className={`add-habit-decorative-circle-1 ${themeClass}`}></div>
        <div className={`add-habit-decorative-circle-2 ${themeClass}`}></div>
      </div>

      <div className="add-habit-relative add-habit-z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`add-habit-header ${themeClass}`}
        >
          <div className="add-habit-flex add-habit-items-center add-habit-gap-4 add-habit-mb-6">
            <button
              onClick={() => navigate(-1)}
              className={`add-habit-back-btn ${themeClass}`}
            >
              <span className={`add-habit-title`}>←</span>
            </button>
            <div>
              <h1 className={`add-habit-title ${themeClass}`}>
                New Habit
              </h1>
              <p className={`add-habit-subtitle ${themeClass}`}>
                Plant the seed of a new habit
              </p>
            </div>
          </div>

          {/* Habit Preview */}
          <div className={`add-habit-preview ${themeClass}`}>
            <div className="add-habit-flex add-habit-items-center add-habit-gap-3">
              <div className={`add-habit-preview-icon ${themeClass}`}>
                <span className="text-3xl">{icon}</span>
              </div>
              <div className="add-habit-flex-1">
                <h2 className={`add-habit-title ${themeClass} add-habit-truncate`}>
                  {title || 'Your Habit Name'}
                </h2>
                <p className={`add-habit-subtitle ${themeClass} add-habit-line-clamp-2`}>
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
          className="add-habit-form-container"
        >
          <div className={`add-habit-form ${themeClass}`}>
            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`add-habit-error ${themeClass}`}
                >
                  <div className="add-habit-flex add-habit-items-center add-habit-gap-3">
                    <div className={`add-habit-error-icon ${themeClass}`}>
                      <span className="text-white text-lg">!</span>
                    </div>
                    <p className={`add-habit-error-text ${themeClass}`}>
                      {error}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={submitHandler} className="add-habit-space-y-6">
              {/* Title Input */}
              <div className="add-habit-space-y-2">
                <label className={`add-habit-label ${themeClass}`}>
                  Habit Name
                </label>
                <div className="add-habit-relative">
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="What habit do you want to build?"
                    className={`add-habit-input ${themeClass}`}
                  />
                </div>
              </div>

              {/* Description Input */}
              <div className="add-habit-space-y-2">
                <label className={`add-habit-label ${themeClass}`}>
                  Description
                </label>
                <div className="add-habit-relative">
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Why is this habit important to you?"
                    rows="3"
                    className={`add-habit-textarea ${themeClass}`}
                  />
                </div>
              </div>

              {/* Category Selection */}
              <div className="add-habit-space-y-2">
                <label className={`add-habit-label ${themeClass}`}>
                  Category
                </label>
                <div className="add-habit-grid-3">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`add-habit-option-btn ${category === cat.id ? `selected add-habit-category-${cat.id} ${themeClass}` : ''}`}
                    >
                      <span className="add-habit-option-icon">{cat.icon}</span>
                      <span className={`add-habit-option-label ${category === cat.id ? themeClass : ''}`}>
                        {cat.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Frequency Selection */}
              <div className="add-habit-space-y-2">
                <label className={`add-habit-label ${themeClass}`}>
                  Frequency
                </label>
                <div className="add-habit-grid-3">
                  {frequencyOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFrequency(option.value)}
                      className={`add-habit-option-btn ${frequency === option.value ? `selected add-habit-frequency ${themeClass}` : ''}`}
                    >
                      <span className="add-habit-option-icon">{option.icon}</span>
                      <span className={`add-habit-option-label ${frequency === option.value ? themeClass : ''}`}>
                        {option.label}
                      </span>
                      <span className={`add-habit-option-description ${frequency === option.value ? themeClass : ''}`}>
                        {option.description}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Target per Week */}
              <div className="add-habit-space-y-2">
                <label className={`add-habit-label ${themeClass}`}>
                  Weekly Target
                </label>
                <div className={`add-habit-target-section ${themeClass}`}>
                  <div className="add-habit-flex add-habit-items-center add-habit-justify-center add-habit-mb-4">
                    <div>
                      <p className={`add-habit-subtitle ${themeClass}`}>
                        How many days per week?
                      </p>
                      <p className={`add-habit-subtitle ${themeClass}`} style={{ opacity: 0.8 }}>
                        Start small and build gradually
                      </p>
                    </div>
                    <div className="add-habit-flex add-habit-items-center add-habit-gap-2">
                      <span className={`add-habit-target-value ${themeClass}`}>
                        {targetPerWeek}
                      </span>
                      <span className={`add-habit-subtitle ${themeClass}`}>
                        days
                      </span>
                    </div>
                  </div>

                  <div className="add-habit-flex add-habit-items-center add-habit-justify-center add-habit-gap-4">
                    <button
                      type="button"
                      onClick={() => setTargetPerWeek(prev => Math.max(1, prev - 1))}
                      className={`add-habit-control-btn ${themeClass}`}
                    >
                      -
                    </button>

                    <div className={`add-habit-progress-container ${themeClass}`}>
                      <div
                        className={`add-habit-progress-fill ${themeClass}`}
                        style={{ width: `${(targetPerWeek / 7) * 100}%` }}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => setTargetPerWeek(prev => Math.min(7, prev + 1))}
                      className={`add-habit-control-btn ${themeClass}`}
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
                className={`add-habit-submit-btn ${themeClass}`}
              >
                {loading ? (
                  <div className="add-habit-flex add-habit-items-center add-habit-justify-center add-habit-gap-3">
                    <div className={`add-habit-spinner ${themeClass}`}></div>
                    <span>Planting habit...</span>
                  </div>
                ) : (
                  <>
                    <span>Plant This Habit</span>
                    <div className="add-habit-submit-icon">
                      <span>🌱</span>
                    </div>
                  </>
                )}
              </motion.button>
            </form>

            {/* Tips */}
            <div className={`add-habit-tips ${themeClass}`}>
              <div className="add-habit-flex add-habit-items-center add-habit-gap-3 add-habit-mb-3">
                <div className={`add-habit-tips-icon ${themeClass}`}>
                  <span>💡</span>
                </div>
                <h3 className={`add-habit-label ${themeClass}`}>
                  Pro Tip
                </h3>
              </div>
              <p className={`add-habit-tips-text ${themeClass}`}>
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