import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../global.css'
import { motion, AnimatePresence } from 'framer-motion'

const EditProfile = ({ user, setUser, setEditProfilePanel }) => {
    const navigate = useNavigate()

    const [newFirstName, setNewFirstName] = useState('')
    const [newLastName, setNewLastName] = useState('')
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showNamePanel, setShowNamePanel] = useState(false)
    const [showPasswordPanel, setShowPasswordPanel] = useState(false)
    const [loading, setLoading] = useState(false)
    const [toast, setToast] = useState({ show: false, text: '', type: 'success' })
    const [showOldPassword, setShowOldPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    // Get theme from localStorage or user
    const theme = localStorage.getItem('userTheme') || user?.theme || 'dark'

    // Set CSS variables based on theme
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.style.setProperty('--input-focus-border', '#124E66')
            document.documentElement.style.setProperty('--input-focus-ring', 'rgba(18, 78, 102, 0.5)')
            document.documentElement.style.setProperty('--placeholder-color', 'rgba(116, 141, 146, 0.6)')
        } else {
            document.documentElement.style.setProperty('--input-focus-border', '#89A8B2')
            document.documentElement.style.setProperty('--input-focus-ring', 'rgba(137, 168, 178, 0.3)')
            document.documentElement.style.setProperty('--placeholder-color', 'rgba(137, 168, 178, 0.6)')
        }
    }, [theme])

    useEffect(() => {
        if (toast.show) {
            const timer = setTimeout(() => {
                setToast({ ...toast, show: false })
            }, 3000)

            return () => clearTimeout(timer)
        }
    }, [toast])

    useEffect(() => {
        if (user?.fullname) {
            setNewFirstName(user.fullname.firstname)
            setNewLastName(user.fullname.lastname)
        }
    }, [user])

    // Update Name
    const handleSaveName = async () => {
        try {
            setLoading(true)

            const res = await axios.put(
                `${import.meta.env.VITE_BASE_URL}/user/update-profile`,
                {
                    firstname: newFirstName,
                    lastname: newLastName
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            )

            setUser(res.data.user)
            setShowNamePanel(false)
            setToast({ show: true, text: 'Name updated successfully!', type: 'success' })

        } catch (err) {
            setToast({ show: true, text: 'Something went wrong! Failed to change Name', type: 'error' })
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    // Change Password
    const handleChangePassword = async () => {
        try {
            // Validate passwords match
            if (newPassword !== confirmPassword) {
                setToast({ show: true, text: 'Passwords do not match!', type: 'error' })
                return
            }

            // Validate password strength
            if (newPassword.length < 6) {
                setToast({ show: true, text: 'Password must be at least 6 characters!', type: 'error' })
                return
            }

            setLoading(true)

            await axios.put(
                `${import.meta.env.VITE_BASE_URL}/user/change-password`,
                {
                    oldPassword,
                    newPassword
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            )

            setOldPassword('')
            setNewPassword('')
            setConfirmPassword('')
            setShowPasswordPanel(false)
            setToast({ show: true, text: 'Password updated successfully!', type: 'success' })

        } catch (err) {
            setToast({ show: true, text: 'Something went wrong! Failed to change Password', type: 'error' })
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={`edit-profile-container ${theme === 'dark' ? 'edit-profile-dark' : 'edit-profile-light'}`}>

            {/* Toast Notification */}
            <AnimatePresence>
                {toast.show && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className={`toast-notification ${toast.type === 'success'
                            ? `${theme === 'dark' ? 'toast-success-dark' : 'toast-success-light'}`
                            : `${theme === 'dark' ? 'toast-error-dark' : 'toast-error-light'}`
                            }`}
                    >
                        <div className={`toast-icon ${toast.type === 'success'
                            ? `${theme === 'dark' ? 'toast-icon-success-dark' : 'toast-icon-success-light'}`
                            : `${theme === 'dark' ? 'toast-icon-error-dark' : 'toast-icon-error-light'}`
                            }`}>
                            <i className={`toast-icon-text ri-${toast.type === 'success' ? 'check' : 'close'}-line ${theme === 'light' && toast.type === 'success' ? 'text-[#2E3944]' : 'text-white'}`}></i>
                        </div>
                        <span className={`toast-text ${toast.type === 'success'
                            ? `${theme === 'dark' ? 'toast-text-success-dark' : 'toast-text-success-light'}`
                            : 'toast-text-error'
                            }`}>
                            {toast.text}
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* CONTENT */}
            <div className="edit-profile-content">

                {/* CHANGE NAME */}
                <div className={`edit-profile-card ${theme === 'dark' ? 'edit-profile-card-dark' : 'edit-profile-card-light'}`}>
                    <div
                        onClick={() => setShowNamePanel(!showNamePanel)}
                        className='card-header'
                    >
                        <div className='card-header-group'>
                            <div className={`icon-container ${theme === 'dark' ? 'icon-container-primary-dark' : 'icon-container-primary-light'}`}>
                                <i className={`ri-edit-box-line text-[22px] ${theme === 'dark' ? 'icon-text-dark' : 'icon-text-light'}`}></i>
                            </div>
                            <div>
                                <h3 className={`card-title ${theme === 'dark' ? 'text-primary-dark' : 'text-primary-light'}`}>
                                    Change your Name
                                </h3>
                                <p className={`card-subtitle ${theme === 'dark' ? 'text-secondary-dark' : 'text-secondary-light'}`}>
                                    Update your first and last name
                                </p>
                            </div>
                        </div>
                        <i
                            className={`arrow-icon ri-arrow-right-s-line ${theme === 'dark' ? 'text-secondary-dark' : 'text-secondary-light'} ${showNamePanel ? 'arrow-rotated' : ''
                                }`}
                        ></i>
                    </div>

                    <AnimatePresence>
                        {showNamePanel && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, y: -10 }}
                                animate={{ opacity: 1, height: 'auto', y: 0 }}
                                exit={{ opacity: 0, height: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="form-section"
                            >
                                {/* First Name */}
                                <div className='form-group'>
                                    <label className={`form-label ${theme === 'dark' ? 'text-primary-dark' : 'text-primary-light'}`}>
                                        First Name
                                    </label>
                                    <div className="input-group">
                                        <div className="input-icon">
                                            <i className={`ri-user-line ${theme === 'dark' ? 'text-secondary-dark' : 'text-secondary-light'}`}></i>
                                        </div>
                                        <input
                                            className={`input-field ${theme === 'dark' ? 'input-field-dark' : 'input-field-light'}`}
                                            value={newFirstName}
                                            onChange={(e) => setNewFirstName(e.target.value)}
                                            placeholder="Enter first name"
                                        />
                                    </div>
                                </div>

                                {/* Last Name */}
                                <div className='form-group'>
                                    <label className={`form-label ${theme === 'dark' ? 'text-primary-dark' : 'text-primary-light'}`}>
                                        Last Name
                                    </label>
                                    <div className="input-group">
                                        <div className="input-icon">
                                            <i className={`ri-user-line ${theme === 'dark' ? 'text-secondary-dark' : 'text-secondary-light'}`}></i>
                                        </div>
                                        <input
                                            className={`input-field ${theme === 'dark' ? 'input-field-dark' : 'input-field-light'}`}
                                            value={newLastName}
                                            onChange={(e) => setNewLastName(e.target.value)}
                                            placeholder="Enter last name"
                                        />
                                    </div>
                                </div>

                                <motion.button
                                    onClick={() => {
                                        handleSaveName()
                                        setEditProfilePanel(false)
                                    }}
                                    disabled={loading}
                                    whileTap={{ scale: 0.95 }}
                                    className={`submit-button ${loading || !newFirstName || !newLastName
                                        ? `${theme === 'dark' ? 'submit-button-disabled-dark' : 'submit-button-disabled-light'} disabled`
                                        : `${theme === 'dark' ? 'submit-button-dark' : 'submit-button-light'}`
                                        }`}
                                >
                                    {loading ? (
                                        <div className="loading-spinner">
                                            <div className={`spinner ${theme === 'dark' ? 'spinner-dark' : 'spinner-light'}`}></div>
                                            <span>Saving...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <span>Save Changes</span>
                                            <i className="ri-save-3-line"></i>
                                        </>
                                    )}
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* CHANGE PASSWORD */}
                <div className={`edit-profile-card ${theme === 'dark' ? 'edit-profile-card-dark' : 'edit-profile-card-light'}`}>
                    <div
                        onClick={() => setShowPasswordPanel(!showPasswordPanel)}
                        className='card-header'
                    >
                        <div className='card-header-group'>
                            <div className={`icon-container ${theme === 'dark' ? 'icon-container-alt-dark' : 'icon-container-alt-light'}`}>
                                <i className={`ri-lock-password-line text-[22px] ${theme === 'dark' ? 'icon-text-dark' : 'icon-text-light'}`}></i>
                            </div>
                            <div>
                                <h3 className={`card-title ${theme === 'dark' ? 'text-primary-dark' : 'text-primary-light'}`}>
                                    Change Your Password
                                </h3>
                                <p className={`card-subtitle ${theme === 'dark' ? 'text-secondary-dark' : 'text-secondary-light'}`}>
                                    Update your account password
                                </p>
                            </div>
                        </div>
                        <i
                            className={`arrow-icon ri-arrow-right-s-line ${theme === 'dark' ? 'text-secondary-dark' : 'text-secondary-light'} ${showPasswordPanel ? 'arrow-rotated' : ''
                                }`}
                        ></i>
                    </div>

                    <AnimatePresence>
                        {showPasswordPanel && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, y: -10 }}
                                animate={{ opacity: 1, height: 'auto', y: 0 }}
                                exit={{ opacity: 0, height: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="form-section"
                            >
                                {/* Old Password */}
                                <div className='form-group'>
                                    <label className={`form-label ${theme === 'dark' ? 'text-primary-dark' : 'text-primary-light'}`}>
                                        Current Password
                                    </label>
                                    <div className="input-group">
                                        <div className="input-icon">
                                            <i className={`ri-lock-line ${theme === 'dark' ? 'text-secondary-dark' : 'text-secondary-light'}`}></i>
                                        </div>
                                        <input
                                            type={showOldPassword ? "text" : "password"}
                                            className={`input-field ${theme === 'dark' ? 'input-field-dark' : 'input-field-light'}`}
                                            value={oldPassword}
                                            onChange={(e) => setOldPassword(e.target.value)}
                                            placeholder="Enter current password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowOldPassword(!showOldPassword)}
                                            className="password-toggle"
                                        >
                                            <i className={`ri-${showOldPassword ? 'eye-off-line' : 'eye-line'} ${theme === 'dark' ? 'text-secondary-dark' : 'text-secondary-light'}`}></i>
                                        </button>
                                    </div>
                                </div>

                                {/* New Password */}
                                <div className='form-group'>
                                    <label className={`form-label ${theme === 'dark' ? 'text-primary-dark' : 'text-primary-light'}`}>
                                        New Password
                                    </label>
                                    <div className="input-group">
                                        <div className="input-icon">
                                            <i className={`ri-lock-unlock-line ${theme === 'dark' ? 'text-secondary-dark' : 'text-secondary-light'}`}></i>
                                        </div>
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            className={`input-field ${theme === 'dark' ? 'input-field-dark' : 'input-field-light'}`}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Enter new password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="password-toggle"
                                        >
                                            <i className={`ri-${showNewPassword ? 'eye-off-line' : 'eye-line'} ${theme === 'dark' ? 'text-secondary-dark' : 'text-secondary-light'}`}></i>
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm Password */}
                                <div className='form-group'>
                                    <label className={`form-label ${theme === 'dark' ? 'text-primary-dark' : 'text-primary-light'}`}>
                                        Confirm New Password
                                    </label>
                                    <div className="input-group">
                                        <div className="input-icon">
                                            <i className={`ri-check-double-line ${theme === 'dark' ? 'text-secondary-dark' : 'text-secondary-light'}`}></i>
                                        </div>
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            className={`input-field ${theme === 'dark' ? 'input-field-dark' : 'input-field-light'} ${confirmPassword && newPassword !== confirmPassword
                                                ? `${theme === 'dark' ? 'input-error-dark' : 'input-error-light'}`
                                                : ''
                                                }`}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Confirm new password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="password-toggle"
                                        >
                                            <i className={`ri-${showConfirmPassword ? 'eye-off-line' : 'eye-line'} ${theme === 'dark' ? 'text-secondary-dark' : 'text-secondary-light'}`}></i>
                                        </button>
                                    </div>

                                    {/* Password Match Indicator */}
                                    {confirmPassword && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className={`password-match ${newPassword === confirmPassword
                                                ? `${theme === 'dark' ? 'password-match-success-dark' : 'password-match-success-light'}`
                                                : 'password-match-error'
                                                }`}
                                        >
                                            <i className={`password-match-icon ri-${newPassword === confirmPassword ? 'check-line' : 'close-line'}`}></i>
                                            <span className={`password-match-text text-xs`}>
                                                {newPassword === confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                                            </span>
                                        </motion.div>
                                    )}
                                </div>

                                <motion.button
                                    onClick={() => {
                                        handleChangePassword()
                                        setEditProfilePanel(false)
                                    }}
                                    disabled={loading || !oldPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                                    whileTap={{ scale: 0.95 }}
                                    className={`submit-button ${loading || !oldPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword
                                        ? `${theme === 'dark' ? 'submit-button-disabled-dark' : 'submit-button-disabled-light'} disabled`
                                        : `${theme === 'dark' ? 'submit-button-dark' : 'submit-button-light'}`
                                        }`}
                                >
                                    {loading ? (
                                        <div className="loading-spinner">
                                            <div className={`spinner ${theme === 'dark' ? 'spinner-dark' : 'spinner-light'}`}></div>
                                            <span>Updating...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <span>Update Password</span>
                                            <i className="ri-key-2-line"></i>
                                        </>
                                    )}
                                </motion.button>

                                {/* Password Requirements */}
                                <div className={`requirements-box ${theme === 'dark' ? 'requirements-box-dark' : 'requirements-box-light'}`}>
                                    <p className={`requirements-title ${theme === 'dark' ? 'text-primary-dark' : 'text-primary-light'}`}>
                                        Password Requirements:
                                    </p>
                                    <div className="requirements-list">
                                        <i className={`requirement-icon ri-${newPassword.length >= 6 ? 'check' : 'close'}-line ${newPassword.length >= 6
                                            ? `${theme === 'dark' ? 'requirement-met-dark' : 'requirement-met-light'}`
                                            : `${theme === 'dark' ? 'requirement-unmet-dark' : 'requirement-unmet-light'}`
                                            }`}></i>
                                        <span className={`requirement-text ${newPassword.length >= 6
                                            ? `${theme === 'dark' ? 'requirement-met-dark' : 'requirement-met-light'}`
                                            : `${theme === 'dark' ? 'requirement-unmet-dark' : 'requirement-unmet-light'}`
                                            }`}>
                                            At least 6 characters
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </div>
        </div>
    )
}

export default EditProfile