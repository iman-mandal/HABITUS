import React, { useState, useEffect, useRef } from 'react'
import AppLogo from '../Assets/HabitTrackerLogo.png'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useUser } from '../context/UserContext'
import { motion, AnimatePresence } from 'framer-motion'

const SignUp = () => {
    // Form state
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [otp, setOtp] = useState('')

    // UI state
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [otpSent, setOtpSent] = useState(false)
    const [otpLoading, setOtpLoading] = useState(false)
    const [resendCooldown, setResendCooldown] = useState(0)

    // Password strength state
    const [passwordStrength, setPasswordStrength] = useState(0)
    const [passwordValidation, setPasswordValidation] = useState({
        minLength: false,
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumber: false,
        hasSpecialChar: false
    })

    const { setUser } = useUser()
    const navigate = useNavigate()
    const cooldownInterval = useRef(null)

    // API Base URL with fallback
    const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000'

    // Validation functions
    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    const validateOtp = (otp) => {
        return /^\d{6}$/.test(otp)
    }

    const validatePasswordStrength = (password) => {
        const validation = {
            minLength: password.length >= 8,
            hasUpperCase: /[A-Z]/.test(password),
            hasLowerCase: /[a-z]/.test(password),
            hasNumber: /[0-9]/.test(password),
            hasSpecialChar: /[^A-Za-z0-9]/.test(password)
        }

        const strength = Object.values(validation).filter(Boolean).length * 20
        setPasswordValidation(validation)
        setPasswordStrength(strength)

        return strength >= 80 // 4 out of 5 criteria
    }

    // Check password strength on change
    useEffect(() => {
        if (password) {
            validatePasswordStrength(password)
        } else {
            setPasswordStrength(0)
            setPasswordValidation({
                minLength: false,
                hasUpperCase: false,
                hasLowerCase: false,
                hasNumber: false,
                hasSpecialChar: false
            })
        }
    }, [password])

    // Check if user is already logged in with token validation
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token')
            if (token) {
                try {
                    // Verify token with backend
                    const response = await axios.get(`${API_BASE_URL}/user/verify`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                    if (response.data.valid) {
                        navigate('/home')
                    } else {
                        localStorage.removeItem('token')
                    }
                } catch (err) {
                    localStorage.removeItem('token')
                }
            }
        }
        checkAuth()
    }, [navigate])

    // Cleanup cooldown interval on unmount
    useEffect(() => {
        return () => {
            if (cooldownInterval.current) {
                clearInterval(cooldownInterval.current)
            }
        }
    }, [])

    const resetForm = () => {
        setFirstName('')
        setLastName('')
        setEmail('')
        setPassword('')
        setConfirmPassword('')
        setOtp('')
        setOtpSent(false)
        setError('')
        setSuccess('')
        setPasswordStrength(0)
    }

    const sendOtpHandler = async () => {
        // Validation checks
        if (!email) {
            setError("Please enter your email address")
            return
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email address")
            return
        }

        if (resendCooldown > 0) {
            setError(`Please wait ${resendCooldown} seconds before requesting another OTP`)
            return
        }

        try {
            setOtpLoading(true)
            setError('')

            await axios.post(`${API_BASE_URL}/user/send-otp`, { email })

            setOtpSent(true)
            setSuccess("OTP sent to your email ✅ Please check your inbox")

            // Start cooldown timer
            setResendCooldown(60)
            cooldownInterval.current = setInterval(() => {
                setResendCooldown(prev => {
                    if (prev <= 1) {
                        clearInterval(cooldownInterval.current)
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)

        } catch (err) {
            console.error('OTP send error:', err)
            const errorMessage = err.response?.data?.message ||
                err.message ||
                "Failed to send OTP. Please try again."
            setError(errorMessage)
        } finally {
            setOtpLoading(false)
        }
    }

    const submitHandler = async (e) => {
        e.preventDefault()

        // Prevent double submission
        if (loading) return

        setLoading(true)
        setError('')
        setSuccess('')

        // OTP validation
        if (!otp) {
            setError("Please enter the OTP sent to your email")
            setLoading(false)
            return
        }

        if (!validateOtp(otp)) {
            setError("Please enter a valid 6-digit OTP")
            setLoading(false)
            return
        }

        // Password validation
        if (password !== confirmPassword) {
            setError('Passwords do not match')
            setLoading(false)
            return
        }

        const isPasswordStrong = validatePasswordStrength(password)
        if (!isPasswordStrong) {
            setError('Please create a stronger password (meet at least 4 of the 5 requirements)')
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
                password: password,
                otp: otp
            }

            const response = await axios.post(`${API_BASE_URL}/user/register`, newUser)

            const data = response.data
            setUser(data.user)
            localStorage.setItem('token', data.token)

            setSuccess('Account created successfully! 🎉 Redirecting to dashboard...')

            // Reset form and redirect
            setTimeout(() => {
                resetForm()
                navigate('/home')
            }, 1500)

        } catch (err) {
            console.error('Registration error:', err)
            const errorMessage = err.response?.data?.message ||
                err.message ||
                'Signup failed. Please try again.'
            setError(errorMessage)

            // Clear OTP if it's an OTP-related error
            if (errorMessage.toLowerCase().includes('otp') ||
                errorMessage.toLowerCase().includes('invalid')) {
                setOtp('')
                // Optionally reset OTP sent state
                // setOtpSent(false)
            }
        } finally {
            setLoading(false)
        }
    }

    // Check if form is valid for submission
    const isFormValid = () => {
        return firstName &&
            lastName &&
            email &&
            validateEmail(email) &&
            otp &&
            validateOtp(otp) &&
            password &&
            confirmPassword &&
            password === confirmPassword &&
            passwordStrength >= 80
    }

    // New color scheme background gradient
    const backgroundGradient = "bg-gradient-to-br from-[#212A31] via-[#2E3944] to-[#124E66]"

    // Password strength color
    const getStrengthColor = () => {
        if (passwordStrength < 40) return '#FF6B6B'
        if (passwordStrength < 60) return '#FFB347'
        if (passwordStrength < 80) return '#FFD166'
        return '#748D92'
    }

    const getStrengthText = () => {
        if (passwordStrength < 40) return 'Weak'
        if (passwordStrength < 60) return 'Fair'
        if (passwordStrength < 80) return 'Good'
        return 'Strong'
    }

    return (
        <div className={`min-h-screen ${backgroundGradient}`}>
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-10 right-10 w-40 h-40 rounded-full bg-gradient-to-r from-[#748D92]/20 to-[#124E66]/20 blur-3xl"></div>
                <div className="absolute bottom-10 left-10 w-60 h-60 rounded-full bg-gradient-to-r from-[#D3D9D4]/10 to-[#748D92]/10 blur-3xl"></div>
                <div className="absolute top-1/3 left-1/4 w-32 h-32 rounded-full bg-gradient-to-r from-[#124E66]/20 to-[#2E3944]/20 blur-3xl"></div>
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
                            className="w-20 h-20 rounded-full bg-gradient-to-r from-[#124E66] to-[#2E3944] flex items-center justify-center mb-4 shadow-xl"
                        >
                            <img
                                className="h-14 w-14"
                                src={AppLogo}
                                alt="Habit Tracker Logo"
                            />
                        </motion.div>

                        <h1 className="font-['Merriweather'] text-[28px] font-bold text-[#D3D9D4] mb-2">
                            Join Habitus
                        </h1>
                        <p className="font-['Source_Sans_Pro'] text-[#748D92] max-w-md">
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
                    <div className="bg-[#2E3944]/90 backdrop-blur-sm rounded-3xl border border-[#748D92]/20 shadow-2xl py-10 px-8">
                        <div className="flex flex-col items-center mb-8">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#748D92] to-[#124E66] flex items-center justify-center mb-4">
                                <span className="text-[#D3D9D4] text-2xl">📝</span>
                            </div>
                            <h2 className="font-['Merriweather'] font-bold text-[26px] text-[#D3D9D4] mb-2">
                                Create Account
                            </h2>
                            <p className="font-['Source_Sans_Pro'] text-[#748D92] text-center">
                                Plant the seeds of your new habits
                            </p>
                        </div>

                        {/* Messages */}
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    key="error"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mb-6 p-4 bg-gradient-to-r from-[#FF6B6B]/10 to-[#E74C3C]/10 rounded-xl border border-[#FF6B6B]/30"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FF6B6B] to-[#E74C3C] flex items-center justify-center flex-shrink-0">
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
                                    key="success"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mb-6 p-4 bg-gradient-to-r from-[#748D92]/10 to-[#124E66]/10 rounded-xl border border-[#748D92]/30"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#748D92] to-[#124E66] flex items-center justify-center flex-shrink-0">
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
                            {/* Name Fields */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="font-['Source_Sans_Pro'] font-semibold text-[#D3D9D4] text-sm">
                                        First Name
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                            <span className="text-[#748D92]">👤</span>
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            placeholder="John"
                                            className="w-full pl-12 pr-4 py-4 bg-[#212A31] border border-[#2E3944] rounded-xl outline-none focus:ring-2 focus:ring-[#124E66]/50 focus:border-[#124E66] transition-all font-['Source_Sans_Pro'] text-[#D3D9D4] placeholder:text-[#748D92]"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="font-['Source_Sans_Pro'] font-semibold text-[#D3D9D4] text-sm">
                                        Last Name
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                            <span className="text-[#748D92]">👥</span>
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            placeholder="Doe"
                                            className="w-full pl-12 pr-4 py-4 bg-[#212A31] border border-[#2E3944] rounded-xl outline-none focus:ring-2 focus:ring-[#124E66]/50 focus:border-[#124E66] transition-all font-['Source_Sans_Pro'] text-[#D3D9D4] placeholder:text-[#748D92]"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Email Field */}
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

                            {/* Send OTP Button */}
                            <motion.button
                                type="button"
                                onClick={sendOtpHandler}
                                disabled={otpLoading || !email || !validateEmail(email)}
                                whileTap={{ scale: 0.98 }}
                                className={`w-full py-3 rounded-xl font-['Source_Sans_Pro'] font-semibold transition-all ${otpLoading || !email || !validateEmail(email)
                                        ? 'bg-[#212A31] text-[#748D92] cursor-not-allowed'
                                        : 'bg-gradient-to-r from-[#748D92] to-[#124E66] text-white hover:shadow-lg hover:shadow-[#124E66]/20'
                                    }`}
                            >
                                {otpLoading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Sending OTP...</span>
                                    </div>
                                ) : resendCooldown > 0 ? (
                                    `Resend OTP in ${resendCooldown}s`
                                ) : (
                                    "Send OTP"
                                )}
                            </motion.button>

                            {/* OTP Input */}
                            <AnimatePresence>
                                {otpSent && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-2"
                                    >
                                        <label className="font-['Source_Sans_Pro'] font-semibold text-[#D3D9D4] text-sm">
                                            Enter OTP
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                                <span className="text-[#748D92]">🔐</span>
                                            </div>
                                            <input
                                                type="text"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                                placeholder="Enter 6-digit OTP"
                                                maxLength="6"
                                                className="w-full pl-12 pr-4 py-4 bg-[#212A31] border border-[#2E3944] rounded-xl outline-none focus:ring-2 focus:ring-[#124E66]/50 focus:border-[#124E66] transition-all font-['Source_Sans_Pro'] text-[#D3D9D4] placeholder:text-[#748D92]"
                                            />
                                        </div>
                                        <p className="text-[#748D92] text-xs">
                                            Please check your email for the 6-digit verification code
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <label className="font-['Source_Sans_Pro'] font-semibold text-[#D3D9D4] text-sm">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                        <span className="text-[#748D92]">🔒</span>
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Create a strong password"
                                        className="w-full pl-12 pr-12 py-4 bg-[#212A31] border border-[#2E3944] rounded-xl outline-none focus:ring-2 focus:ring-[#124E66]/50 focus:border-[#124E66] transition-all font-['Source_Sans_Pro'] text-[#D3D9D4] placeholder:text-[#748D92]"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        <span className="text-[#748D92] hover:text-[#D3D9D4] transition">
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
                                        <div className="flex justify-between items-center">
                                            <span className="font-['Source_Sans_Pro'] text-[#748D92] text-xs">
                                                Password strength: <span style={{ color: getStrengthColor() }} className="font-semibold">{getStrengthText()}</span>
                                            </span>
                                            <span
                                                className="font-['Source_Sans_Pro'] font-semibold text-xs"
                                                style={{ color: getStrengthColor() }}
                                            >
                                                {passwordStrength}%
                                            </span>
                                        </div>
                                        <div className="h-2 bg-[#212A31] rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${passwordStrength}%` }}
                                                transition={{ duration: 0.5 }}
                                                className="h-full rounded-full"
                                                style={{ backgroundColor: getStrengthColor() }}
                                            />
                                        </div>

                                        {/* Password requirements checklist */}
                                        <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                                            <div className={`flex items-center gap-1 ${passwordValidation.minLength ? 'text-[#748D92]' : 'text-[#FF6B6B]'}`}>
                                                <span>{passwordValidation.minLength ? '✓' : '○'}</span>
                                                <span>8+ characters</span>
                                            </div>
                                            <div className={`flex items-center gap-1 ${passwordValidation.hasUpperCase ? 'text-[#748D92]' : 'text-[#FF6B6B]'}`}>
                                                <span>{passwordValidation.hasUpperCase ? '✓' : '○'}</span>
                                                <span>Uppercase</span>
                                            </div>
                                            <div className={`flex items-center gap-1 ${passwordValidation.hasLowerCase ? 'text-[#748D92]' : 'text-[#FF6B6B]'}`}>
                                                <span>{passwordValidation.hasLowerCase ? '✓' : '○'}</span>
                                                <span>Lowercase</span>
                                            </div>
                                            <div className={`flex items-center gap-1 ${passwordValidation.hasNumber ? 'text-[#748D92]' : 'text-[#FF6B6B]'}`}>
                                                <span>{passwordValidation.hasNumber ? '✓' : '○'}</span>
                                                <span>Number</span>
                                            </div>
                                            <div className={`flex items-center gap-1 col-span-2 ${passwordValidation.hasSpecialChar ? 'text-[#748D92]' : 'text-[#FF6B6B]'}`}>
                                                <span>{passwordValidation.hasSpecialChar ? '✓' : '○'}</span>
                                                <span>Special character (!@#$%^&*)</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            {/* Confirm Password Field */}
                            <div className="space-y-2">
                                <label className="font-['Source_Sans_Pro'] font-semibold text-[#D3D9D4] text-sm">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                        <span className="text-[#748D92]">✓</span>
                                    </div>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Re-enter your password"
                                        className={`w-full pl-12 pr-12 py-4 bg-[#212A31] border rounded-xl outline-none focus:ring-2 transition-all font-['Source_Sans_Pro'] text-[#D3D9D4] placeholder:text-[#748D92] ${confirmPassword && password !== confirmPassword
                                                ? 'border-[#FF6B6B] focus:ring-[#FF6B6B]/50'
                                                : 'border-[#2E3944] focus:ring-[#124E66]/50 focus:border-[#124E66]'
                                            }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2"
                                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                    >
                                        <span className="text-[#748D92] hover:text-[#D3D9D4] transition">
                                            {showConfirmPassword ? "🙈" : "👁️"}
                                        </span>
                                    </button>
                                </div>

                                {/* Password Match Indicator */}
                                {confirmPassword && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className={`flex items-center gap-2 mt-2 ${password === confirmPassword ? 'text-[#748D92]' : 'text-[#FF6B6B]'
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
                            <div className="flex items-start gap-3 p-3 bg-[#212A31] rounded-xl border border-[#2E3944]">
                                <div className="w-5 h-5 rounded border border-[#748D92]/30 flex items-center justify-center mt-1 flex-shrink-0">
                                    <span className="text-[#748D92] text-xs">✓</span>
                                </div>
                                <p className="font-['Source_Sans_Pro'] text-[#748D92] text-sm">
                                    By creating an account, you agree to our{' '}
                                    <Link to="/terms" className="text-[#748D92] hover:text-[#D3D9D4] transition">
                                        Terms of Service
                                    </Link>{' '}
                                    and{' '}
                                    <Link to="/privacy" className="text-[#748D92] hover:text-[#D3D9D4] transition">
                                        Privacy Policy
                                    </Link>
                                </p>
                            </div>

                            {/* Submit Button */}
                            <motion.button
                                type="submit"
                                disabled={loading || !isFormValid()}
                                whileTap={{ scale: loading || !isFormValid() ? 1 : 0.98 }}
                                className={`w-full py-4 rounded-xl font-['Source_Sans_Pro'] font-semibold transition-all relative overflow-hidden ${loading || !isFormValid()
                                        ? 'bg-gradient-to-r from-[#2E3944] to-[#212A31] text-[#748D92] cursor-not-allowed'
                                        : 'bg-gradient-to-r from-[#124E66] to-[#212A31] text-[#D3D9D4] hover:shadow-xl hover:shadow-[#124E66]/20 active:scale-95'
                                    }`}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="w-5 h-5 border-2 border-[#D3D9D4]/30 border-t-[#D3D9D4] rounded-full animate-spin"></div>
                                        <span>Creating account...</span>
                                    </div>
                                ) : (
                                    <>
                                        <span>Start Your Journey</span>
                                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                            <span className="text-xl">🚀</span>
                                        </div>
                                    </>
                                )}
                            </motion.button>
                        </form>

                        {/* Divider */}
                        <div className="flex items-center my-8">
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#748D92]/30 to-transparent"></div>
                            <span className="px-4 font-['Source_Sans_Pro'] text-[#748D92] text-sm">
                                Or sign up with
                            </span>
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#748D92]/30 to-transparent"></div>
                        </div>

                        {/* Social Sign Up */}
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                className="flex items-center justify-center gap-3 py-3 bg-[#212A31] border border-[#2E3944] rounded-xl hover:border-[#124E66] transition group"
                                onClick={() => {/* Implement Google OAuth */ }}
                            >
                                <span className="text-xl text-[#748D92] group-hover:text-[#D3D9D4] transition">G</span>
                                <span className="font-['Source_Sans_Pro'] font-semibold text-[#748D92] group-hover:text-[#D3D9D4] transition">
                                    Google
                                </span>
                            </button>
                            <button
                                className="flex items-center justify-center gap-3 py-3 bg-[#212A31] border border-[#2E3944] rounded-xl hover:border-[#124E66] transition group"
                                onClick={() => {/* Implement Facebook OAuth */ }}
                            >
                                <span className="text-xl text-[#748D92] group-hover:text-[#D3D9D4] transition">f</span>
                                <span className="font-['Source_Sans_Pro'] font-semibold text-[#748D92] group-hover:text-[#D3D9D4] transition">
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
                    <div className="bg-[#2E3944]/40 backdrop-blur-sm rounded-2xl p-6 border border-[#748D92]/20">
                        <p className="font-['Source_Sans_Pro'] text-[#748D92] mb-4">
                            Already have an account?
                        </p>
                        <Link
                            to="/login"
                            className="block py-3 px-6 bg-gradient-to-r from-[#748D92] to-[#124E66] text-[#D3D9D4] font-['Source_Sans_Pro'] font-semibold rounded-xl hover:shadow-lg hover:shadow-[#124E66]/20 transition-all active:scale-95"
                        >
                            Sign In Instead
                        </Link>
                    </div>

                    {/* Footer */}
                    <p className="font-['Source_Sans_Pro'] text-[#748D92] text-sm mt-8">
                        Your journey to better habits starts here
                    </p>
                </motion.div>
            </div>
        </div>
    )
}

export default SignUp