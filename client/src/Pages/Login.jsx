import React, { useState, useEffect } from 'react'
import AppLogo from '../Assets/HabitTrackerLogo.png'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useUser } from '../context/UserContext'
import { motion, AnimatePresence } from 'framer-motion'

const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { setUser } = useUser()

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

    try {
      const newUser = {
        email: email.trim(),
        password: password
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/login`,
        newUser
      )

      if (response.status === 200) {
        const data = response.data
        setUser(data.user)
        localStorage.setItem('token', data.token)
        navigate('/home')
      }
    } catch (err) {
      console.error('Login failed:', err)
      setError(
        err.response?.data?.message ||
        'Invalid email or password. Please try again.'
      )
    } finally {
      setLoading(false)
      setEmail('')
      setPassword('')
    }
  }

  // New color scheme background gradient
  const backgroundGradient = "bg-gradient-to-br from-[#212A31] via-[#2E3944] to-[#124E66]"

  return (
    <div className={`min-h-screen ${backgroundGradient}`}>
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-gradient-to-r from-[#748D92]/20 to-[#124E66]/20 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-gradient-to-r from-[#D3D9D4]/10 to-[#748D92]/10 blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-32 h-32 rounded-full bg-gradient-to-r from-[#124E66]/20 to-[#2E3944]/20 blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="pt-12 pb-8 px-6 text-center"
        >
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-24 h-24 rounded-full bg-gradient-to-r from-[#124E66] to-[#2E3944] flex items-center justify-center mb-4 shadow-xl"
            >
              <img
                className="h-16 w-16"
                src={AppLogo}
                alt="Habit Tracker Logo"
              />
            </motion.div>

            <h1 className="font-['Merriweather'] text-[32px] font-bold text-[#D3D9D4] mb-2">
              Habitus
            </h1>
            <p className="font-['Source_Sans_Pro'] text-[#748D92]">
              Cultivate good habits, grow your life
            </p>
          </div>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="px-6"
        >
          <div className="bg-[#2E3944]/90 backdrop-blur-sm rounded-3xl border border-[#748D92]/20 shadow-2xl py-10 px-8">
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#124E66] to-[#212A31] flex items-center justify-center mb-4">
                <span className="text-[#D3D9D4] text-2xl">🔒</span>
              </div>
              <h2 className="font-['Merriweather'] font-bold text-[28px] text-[#D3D9D4] mb-2">
                Welcome Back
              </h2>
              <p className="font-['Source_Sans_Pro'] text-[#748D92] text-center">
                Continue your journey to better habits
              </p>
            </div>

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
              {/* Email Input */}
              <div className="space-y-2">
                <label className="font-['Source_Sans_Pro'] font-semibold text-[#D3D9D4] text-sm">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <span className="text-[#748D92]">📧</span>
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-12 pr-4 py-4 bg-[#212A31] border border-[#2E3944] rounded-xl outline-none focus:ring-2 focus:ring-[#124E66]/50 focus:border-[#124E66] transition-all font-['Source_Sans_Pro'] text-[#D3D9D4] placeholder:text-[#748D92]"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="font-['Source_Sans_Pro'] font-semibold text-[#D3D9D4] text-sm">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="font-['Source_Sans_Pro'] text-[#748D92] text-sm hover:text-[#D3D9D4] transition"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <span className="text-[#748D92]">🔒</span>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-12 py-4 bg-[#212A31] border border-[#2E3944] rounded-xl outline-none focus:ring-2 focus:ring-[#124E66]/50 focus:border-[#124E66] transition-all font-['Source_Sans_Pro'] text-[#D3D9D4] placeholder:text-[#748D92]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                  >
                    <span className="text-[#748D92] hover:text-[#D3D9D4] transition">
                      {showPassword ? "🙈" : "👁️"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className={`w-full py-4 rounded-xl font-['Source_Sans_Pro'] font-semibold text-white transition-all relative overflow-hidden ${loading
                  ? 'bg-gradient-to-r from-[#2E3944] to-[#212A31] cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#124E66] to-[#212A31] hover:shadow-xl hover:shadow-[#124E66]/20 active:scale-95'
                  }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <>
                    <span>Sign In</span>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <span className="text-xl">→</span>
                    </div>
                  </>
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-8">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#748D92]/30 to-transparent"></div>
              <span className="px-4 font-['Source_Sans_Pro'] text-[#748D92] text-sm">
                Or continue with
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#748D92]/30 to-transparent"></div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              <button className="flex items-center justify-center gap-3 py-3 bg-[#212A31] border border-[#2E3944] rounded-xl hover:border-[#124E66] transition group">
                <span className="text-xl text-[#748D92] group-hover:text-[#D3D9D4] transition">G</span>
                <span className="font-['Source_Sans_Pro'] font-semibold text-[#748D92] group-hover:text-[#D3D9D4] transition">
                  Google
                </span>
              </button>
              <button className="flex items-center justify-center gap-3 py-3 bg-[#212A31] border border-[#2E3944] rounded-xl hover:border-[#124E66] transition group">
                <span className="text-xl text-[#748D92] group-hover:text-[#D3D9D4] transition">f</span>
                <span className="font-['Source_Sans_Pro'] font-semibold text-[#748D92] group-hover:text-[#D3D9D4] transition">
                  Facebook
                </span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Sign Up Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="px-6 py-8 text-center"
        >
          <div className="bg-[#2E3944]/40 backdrop-blur-sm rounded-2xl p-6 border border-[#748D92]/20">
            <p className="font-['Source_Sans_Pro'] text-[#748D92] mb-4">
              Don't have an account yet?
            </p>
            <Link
              to="/signup"
              className="block py-3 px-6 bg-gradient-to-r from-[#748D92] to-[#124E66] text-[#D3D9D4] font-['Source_Sans_Pro'] font-semibold rounded-xl hover:shadow-lg hover:shadow-[#124E66]/20 transition-all active:scale-95"
            >
              Create Your Account
            </Link>
          </div>

          {/* Footer */}
          <p className="font-['Source_Sans_Pro'] text-[#748D92] text-sm mt-8">
            By signing in, you agree to our Terms and Privacy Policy
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default Login