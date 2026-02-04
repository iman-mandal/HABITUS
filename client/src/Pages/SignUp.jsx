import React, { useState, useEffect } from 'react'
import AppLogo from '../Assets/HabitTrackerLogo.png'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useUser } from '../context/UserContext'
import { motion, AnimatePresence } from 'framer-motion'

const SignUp = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [passwordStrength, setPasswordStrength] = useState(0)
  const { setUser } = useUser()

  const navigate = useNavigate()

  // Check password strength
  useEffect(() => {
    const calculateStrength = () => {
      let strength = 0
      if (password.length >= 8) strength += 25
      if (/[A-Z]/.test(password)) strength += 25
      if (/[0-9]/.test(password)) strength += 25
      if (/[^A-Za-z0-9]/.test(password)) strength += 25
      setPasswordStrength(strength)
    }
    calculateStrength()
  }, [password])

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      navigate('/home')
    }
  }, [navigate])

  const submitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    // Validate password strength
    if (passwordStrength < 75) {
      setError('Password is too weak. Include uppercase, numbers, and special characters')
      setLoading(false)
      return
    }

    try {
      const newUser = {
        fullname: {
          firstname: firstName.trim(),
          lastname: lastName.trim()
        },
        email: email.trim(),
        password: password
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/register`,
        newUser
      )

      if (response.status === 201) {
        const data = response.data
        setUser(data.user)
        localStorage.setItem('token', data.token)
        setSuccess('Account created successfully!')

        // Wait a moment before navigating
        setTimeout(() => {
          navigate('/home')
        }, 1500)
      }
    } catch (err) {
      console.error('Signup failed:', err)
      setError(
        err.response?.data?.message ||
        'Failed to create account. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  // Nature-themed background gradient
  const backgroundGradient = "bg-gradient-to-br from-[#F5E8C7] via-[#E8F5E9] to-[#D4EDDA]"

  // Password strength color
  const getStrengthColor = () => {
    if (passwordStrength < 25) return '#FF6B6B'
    if (passwordStrength < 50) return '#FFB347'
    if (passwordStrength < 75) return '#FFD166'
    return '#4CAF50'
  }

  return (
    <div className={`min-h-screen ${backgroundGradient}`}>
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-10 w-40 h-40 rounded-full bg-gradient-to-r from-[#FFD166]/20 to-[#FFB347]/10 blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-60 h-60 rounded-full bg-gradient-to-r from-[#4A7C3F]/10 to-[#2D5A27]/10 blur-3xl"></div>
        <div className="absolute top-1/3 left-1/4 w-32 h-32 rounded-full bg-gradient-to-r from-[#87CEEB]/10 to-[#3498DB]/10 blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="pt-10 pb-6 px-6 text-center"
        >
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-20 h-20 rounded-full bg-gradient-to-r from-[#4A7C3F] to-[#2D5A27] flex items-center justify-center mb-4 shadow-xl"
            >
              <img
                className="h-14 w-14"
                src={AppLogo}
                alt="Habit Tracker Logo"
              />
            </motion.div>

            <h1 className="font-['Merriweather'] text-[28px] font-bold text-[#2D5A27] mb-2">
              Join Habitus
            </h1>
            <p className="font-['Source_Sans_Pro'] text-[#5D6D55] max-w-md">
              Start your journey to building lasting habits and watch your life grow
            </p>
          </div>
        </motion.div>

        {/* Sign Up Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="px-6"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/40 shadow-2xl py-10 px-8">
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#FFD166] to-[#FFB347] flex items-center justify-center mb-4">
                <span className="text-white text-2xl">🌱</span>
              </div>
              <h2 className="font-['Merriweather'] font-bold text-[26px] text-[#2D5A27] mb-2">
                Create Account
              </h2>
              <p className="font-['Source_Sans_Pro'] text-[#5D6D55] text-center">
                Plant the seeds of your new habits
              </p>
            </div>

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
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-['Source_Sans_Pro'] font-semibold text-[#2D5A27] text-sm">
                    First Name
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <span className="text-[#5D6D55]">👤</span>
                    </div>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="John"
                      className="w-full pl-12 pr-4 py-4 bg-gradient-to-r from-[#F9FBF5] to-[#F0F8E8] border border-[#E0E6D6] rounded-xl outline-none focus:ring-2 focus:ring-[#4A7C3F]/30 focus:border-[#4A7C3F] transition-all font-['Source_Sans_Pro'] text-[#2D5A27]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-['Source_Sans_Pro'] font-semibold text-[#2D5A27] text-sm">
                    Last Name
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <span className="text-[#5D6D55]">👥</span>
                    </div>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      className="w-full pl-12 pr-4 py-4 bg-gradient-to-r from-[#F9FBF5] to-[#F0F8E8] border border-[#E0E6D6] rounded-xl outline-none focus:ring-2 focus:ring-[#4A7C3F]/30 focus:border-[#4A7C3F] transition-all font-['Source_Sans_Pro'] text-[#2D5A27]"
                    />
                  </div>
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="font-['Source_Sans_Pro'] font-semibold text-[#2D5A27] text-sm">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <span className="text-[#5D6D55]">📧</span>
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-12 pr-4 py-4 bg-gradient-to-r from-[#F9FBF5] to-[#F0F8E8] border border-[#E0E6D6] rounded-xl outline-none focus:ring-2 focus:ring-[#4A7C3F]/30 focus:border-[#4A7C3F] transition-all font-['Source_Sans_Pro'] text-[#2D5A27]"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="font-['Source_Sans_Pro'] font-semibold text-[#2D5A27] text-sm">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <span className="text-[#5D6D55]">🔒</span>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full pl-12 pr-12 py-4 bg-gradient-to-r from-[#F9FBF5] to-[#F0F8E8] border border-[#E0E6D6] rounded-xl outline-none focus:ring-2 focus:ring-[#4A7C3F]/30 focus:border-[#4A7C3F] transition-all font-['Source_Sans_Pro'] text-[#2D5A27]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                  >
                    <span className="text-[#5D6D55]">
                      {showPassword ? "🙈" : "👁️"}
                    </span>
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {password && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-2 mt-3"
                  >
                    <div className="flex justify-between">
                      <span className="font-['Source_Sans_Pro'] text-[#5D6D55] text-xs">
                        Password strength
                      </span>
                      <span
                        className="font-['Source_Sans_Pro'] font-semibold text-xs"
                        style={{ color: getStrengthColor() }}
                      >
                        {passwordStrength}%
                      </span>
                    </div>
                    <div className="h-2 bg-gradient-to-r from-[#F5E8C7] to-[#F0F8E8] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${passwordStrength}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: getStrengthColor() }}
                      />
                    </div>
                    <p className="font-['Source_Sans_Pro'] text-[#7A7A7A] text-xs">
                      Use 8+ characters with uppercase, numbers, and symbols
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label className="font-['Source_Sans_Pro'] font-semibold text-[#2D5A27] text-sm">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <span className="text-[#5D6D55]">✓</span>
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    className={`w-full pl-12 pr-12 py-4 bg-gradient-to-r from-[#F9FBF5] to-[#F0F8E8] border rounded-xl outline-none focus:ring-2 transition-all font-['Source_Sans_Pro'] text-[#2D5A27] ${confirmPassword && password !== confirmPassword
                        ? 'border-[#FF6B6B] focus:ring-[#FF6B6B]/30'
                        : 'border-[#E0E6D6] focus:ring-[#4A7C3F]/30 focus:border-[#4A7C3F]'
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                  >
                    <span className="text-[#5D6D55]">
                      {showConfirmPassword ? "🙈" : "👁️"}
                    </span>
                  </button>
                </div>

                {/* Password Match Indicator */}
                {confirmPassword && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`flex items-center gap-2 mt-2 ${password === confirmPassword ? 'text-[#4CAF50]' : 'text-[#FF6B6B]'
                      }`}
                  >
                    <span className="text-sm">
                      {password === confirmPassword ? '✓' : '✗'}
                    </span>
                    <span className="font-['Source_Sans_Pro'] text-xs">
                      {password === confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                    </span>
                  </motion.div>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-[#F9FBF5] to-[#F0F8E8] rounded-xl">
                <div className="w-5 h-5 rounded border border-[#E0E6D6] flex items-center justify-center mt-1 flex-shrink-0">
                  <span className="text-[#4A7C3F] text-xs">✓</span>
                </div>
                <p className="font-['Source_Sans_Pro'] text-[#5D6D55] text-sm">
                  By creating an account, you agree to our{' '}
                  <Link to="/terms" className="text-[#4A7C3F] hover:text-[#2D5A27]">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-[#4A7C3F] hover:text-[#2D5A27]">
                    Privacy Policy
                  </Link>
                </p>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading || password !== confirmPassword || passwordStrength < 75}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className={`w-full py-4 rounded-xl font-['Source_Sans_Pro'] font-semibold transition-all relative overflow-hidden ${loading || password !== confirmPassword || passwordStrength < 75
                    ? 'bg-gradient-to-r from-[#7A7A7A] to-[#5D6D55] text-white cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#4A7C3F] to-[#2D5A27] text-white hover:shadow-xl active:scale-95'
                  }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Creating account...</span>
                  </div>
                ) : (
                  <>
                    <span>Start Your Journey</span>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <span className="text-xl">🌿</span>
                    </div>
                  </>
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-8">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#E0E6D6] to-transparent"></div>
              <span className="px-4 font-['Source_Sans_Pro'] text-[#7A7A7A] text-sm">
                Or sign up with
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#E0E6D6] to-transparent"></div>
            </div>

            {/* Social Sign Up */}
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-3 py-3 bg-gradient-to-r from-[#F9FBF5] to-[#F0F8E8] border border-[#E0E6D6] rounded-xl hover:border-[#4A7C3F] transition">
                <span className="text-xl">G</span>
                <span className="font-['Source_Sans_Pro'] font-semibold text-[#2D5A27]">
                  Google
                </span>
              </button>
              <button className="flex items-center justify-center gap-3 py-3 bg-gradient-to-r from-[#F9FBF5] to-[#F0F8E8] border border-[#E0E6D6] rounded-xl hover:border-[#4A7C3F] transition">
                <span className="text-xl">f</span>
                <span className="font-['Source_Sans_Pro'] font-semibold text-[#2D5A27]">
                  Facebook
                </span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Login Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="px-6 py-8 text-center"
        >
          <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-white/40">
            <p className="font-['Source_Sans_Pro'] text-[#5D6D55] mb-4">
              Already have an account?
            </p>
            <Link
              to="/login"
              className="block py-3 px-6 bg-gradient-to-r from-[#87CEEB] to-[#3498DB] text-white font-['Source_Sans_Pro'] font-semibold rounded-xl hover:shadow-lg transition-all active:scale-95"
            >
              Sign In Instead
            </Link>
          </div>

          {/* Footer */}
          <p className="font-['Source_Sans_Pro'] text-[#7A7A7A] text-sm mt-8">
            Your journey to better habits starts here
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default SignUp