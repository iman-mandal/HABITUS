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

    // Password strength color
    const getStrengthColor = () => {
        if (passwordStrength < 25) return '#FF6B6B'
        if (passwordStrength < 50) return '#FFB347'
        if (passwordStrength < 75) return '#FFD166'
        return '#748D92'
    }

    // Check if confirm password has error
    const getConfirmPasswordClass = () => {
        const baseClass = 'signup-input';
        return confirmPassword && password !== confirmPassword ? `${baseClass} error` : baseClass;
    };

    return (
        <div className="signup-container">
            {/* Decorative elements */}
            <div className="signup-decorative">
                <div className="signup-decorative-circle-1"></div>
                <div className="signup-decorative-circle-2"></div>
                <div className="signup-decorative-circle-3"></div>
            </div>

            <div className="signup-main">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="signup-header"
                >
                    <div className="signup-header-content">
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            className="signup-logo"
                        >
                            <img
                                src={AppLogo}
                                alt="Habit Tracker Logo"
                            />
                        </motion.div>

                        <h1 className="signup-title">
                            Join Habitus
                        </h1>
                        <p className="signup-subtitle">
                            Start your journey to building lasting habits and watch your life grow
                        </p>
                    </div>
                </motion.div>

                {/* Sign Up Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="signup-form-container"
                >
                    <div className="signup-form-wrapper">
                        <div className="signup-form-header">
                            <div className="signup-form-icon">
                                <span>📝</span>
                            </div>
                            <h2 className="signup-form-title">
                                Create Account
                            </h2>
                            <p className="signup-form-subtitle">
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
                                    className="signup-message signup-error"
                                >
                                    <div className="signup-message-content">
                                        <div className="signup-message-icon">
                                            <span>!</span>
                                        </div>
                                        <p className="signup-message-text">
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
                                    className="signup-message signup-success"
                                >
                                    <div className="signup-message-content">
                                        <div className="signup-message-icon">
                                            <span>✓</span>
                                        </div>
                                        <p className="signup-message-text">
                                            {success}
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={submitHandler} className="signup-form">
                            {/* Name Fields */}
                            <div className="signup-name-fields">
                                <div className="signup-field-group">
                                    <label className="signup-label">
                                        First Name
                                    </label>
                                    <div className="signup-input-container">
                                        <div className="signup-input-icon">
                                            <span>👤</span>
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            placeholder="John"
                                            className="signup-input"
                                        />
                                    </div>
                                </div>

                                <div className="signup-field-group">
                                    <label className="signup-label">
                                        Last Name
                                    </label>
                                    <div className="signup-input-container">
                                        <div className="signup-input-icon">
                                            <span>👥</span>
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            placeholder="Doe"
                                            className="signup-input"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Email Field */}
                            <div className="signup-field-group">
                                <label className="signup-label">
                                    Email Address
                                </label>
                                <div className="signup-input-container">
                                    <div className="signup-input-icon">
                                        <span>📧</span>
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="signup-input"
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="signup-field-group">
                                <label className="signup-label">
                                    Password
                                </label>
                                <div className="signup-input-container">
                                    <div className="signup-input-icon">
                                        <span>🔒</span>
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Create a strong password"
                                        className="signup-input"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="signup-password-toggle"
                                    >
                                        <span>{showPassword ? "🙈" : "👁️"}</span>
                                    </button>
                                </div>

                                {/* Password Strength Indicator */}
                                {password && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="signup-password-strength"
                                    >
                                        <div className="signup-strength-header">
                                            <span className="signup-strength-label">
                                                Password strength
                                            </span>
                                            <span
                                                className="signup-strength-value"
                                                style={{ color: getStrengthColor() }}
                                            >
                                                {passwordStrength}%
                                            </span>
                                        </div>
                                        <div className="signup-strength-bar">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${passwordStrength}%` }}
                                                transition={{ duration: 0.5 }}
                                                className="signup-strength-fill"
                                                style={{ backgroundColor: getStrengthColor() }}
                                            />
                                        </div>
                                        <p className="signup-strength-hint">
                                            Use 8+ characters with uppercase, numbers, and symbols
                                        </p>
                                    </motion.div>
                                )}
                            </div>

                            {/* Confirm Password Field */}
                            <div className="signup-field-group">
                                <label className="signup-label">
                                    Confirm Password
                                </label>
                                <div className="signup-input-container">
                                    <div className="signup-input-icon">
                                        <span>✓</span>
                                    </div>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Re-enter your password"
                                        className={getConfirmPasswordClass()}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="signup-password-toggle"
                                    >
                                        <span>{showConfirmPassword ? "🙈" : "👁️"}</span>
                                    </button>
                                </div>

                                {/* Password Match Indicator */}
                                {confirmPassword && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className={`signup-password-match ${password === confirmPassword ? 'match' : 'no-match'}`}
                                    >
                                        <span className="signup-match-icon">
                                            {password === confirmPassword ? '✓' : '✗'}
                                        </span>
                                        <span className="signup-match-text">
                                            {password === confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                                        </span>
                                    </motion.div>
                                )}
                            </div>

                            {/* Terms and Conditions */}
                            <div className="signup-terms">
                                <div className="signup-terms-check">
                                    <span>✓</span>
                                </div>
                                <p className="signup-terms-text">
                                    By creating an account, you agree to our{' '}
                                    <Link to="/terms" className="signup-terms-link">
                                        Terms of Service
                                    </Link>{' '}
                                    and{' '}
                                    <Link to="/privacy" className="signup-terms-link">
                                        Privacy Policy
                                    </Link>
                                </p>
                            </div>

                            {/* Submit Button */}
                            <motion.button
                                type="submit"
                                disabled={loading || password !== confirmPassword || passwordStrength < 75}
                                whileTap={{ scale: loading ? 1 : 0.98 }}
                                className={`signup-submit-btn ${loading || password !== confirmPassword || passwordStrength < 75 ? 'signup-disabled' : ''}`}
                            >
                                {loading ? (
                                    <div className="signup-flex signup-items-center signup-justify-center signup-gap-3">
                                        <div className="signup-spinner"></div>
                                        <span>Creating account...</span>
                                    </div>
                                ) : (
                                    <>
                                        <span>Start Your Journey</span>
                                        <div className="signup-submit-icon">
                                            <span>🚀</span>
                                        </div>
                                    </>
                                )}
                            </motion.button>
                        </form>

                        {/* Divider */}
                        <div className="signup-divider">
                            <div className="signup-divider-line"></div>
                            <span className="signup-divider-text">
                                Or sign up with
                            </span>
                            <div className="signup-divider-line"></div>
                        </div>

                        {/* Social Sign Up */}
                        <div className="signup-social-grid">
                            <button className="signup-social-btn">
                                <span className="signup-social-icon">G</span>
                                <span className="signup-social-label">Google</span>
                            </button>
                            <button className="signup-social-btn">
                                <span className="signup-social-icon">f</span>
                                <span className="signup-social-label">Facebook</span>
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Login Link */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="signup-login-section"
                >
                    <div className="signup-login-box">
                        <p className="signup-login-text">
                            Already have an account?
                        </p>
                        <Link
                            to="/login"
                            className="signup-login-link"
                        >
                            Sign In Instead
                        </Link>
                    </div>

                    {/* Footer */}
                    <p className="signup-footer">
                        Your journey to better habits starts here
                    </p>
                </motion.div>
            </div>
        </div>
    )
}

export default SignUp