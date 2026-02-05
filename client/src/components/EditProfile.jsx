import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
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


    // Theme colors
    const themeColors = {
        light: {
            containerBg: "bg-[#F1F0E8]/90",
            containerBorder: "border-[#B3C8CF]/20",
            cardBg: "from-[#E5E1DA]/50 to-[#F1F0E8]/50",
            cardBorder: "border-[#B3C8CF]/20",
            textPrimary: "#2E3944",
            textSecondary: "#89A8B2",
            textAccent: "#124E66",
            inputBg: "#E5E1DA",
            inputBorder: "border-[#B3C8CF]/30",
            inputFocusBorder: "border-[#89A8B2]",
            inputFocusRing: "ring-[#89A8B2]/30",
            placeholder: "rgba(137, 168, 178, 0.6)",
            buttonBg: "from-[#89A8B2] to-[#B3C8CF]",
            buttonText: "#F1F0E8",
            buttonDisabled: "from-[#F1F0E8] to-[#E5E1DA]",
            buttonDisabledText: "#89A8B2",
            successBg: "from-[#B3C8CF]/10 to-[#89A8B2]/10",
            successBorder: "border-[#B3C8CF]/30",
            successText: "#2E3944",
            errorBg: "from-[#FFB6B6]/10 to-[#FF6B6B]/10",
            errorBorder: "border-[#FFB6B6]/30",
            errorText: "#FF6B6B",
            iconBg: "from-[#89A8B2] to-[#B3C8CF]",
            iconText: "#F1F0E8",
            iconBgAlt: "from-[#B3C8CF] to-[#89A8B2]",
            iconTextAlt: "#2E3944",
            iconHover: "hover:scale-105",
            shadow: "shadow-[#89A8B2]/10",
            requirementMet: "#89A8B2",
            requirementUnmet: "rgba(137, 168, 178, 0.3)"
        },
        dark: {
            containerBg: "bg-[#2E3944]/90",
            containerBorder: "border-[#748D92]/20",
            cardBg: "from-[#212A31]/50 to-[#2E3944]/50",
            cardBorder: "border-[#748D92]/20",
            textPrimary: "#text-[#D3D9D4]",
            textSecondary: "#748D92",
            textAccent: "#124E66",
            inputBg: "#212A31",
            inputBorder: "border-[#2E3944]",
            inputFocusBorder: "border-[#124E66]",
            inputFocusRing: "ring-[#124E66]/50",
            placeholder: "#748D92",
            buttonBg: "from-[#124E66] to-[#212A31]",
            buttonText: "#D3D9D4",
            buttonDisabled: "from-[#2E3944] to-[#212A31]",
            buttonDisabledText: "#748D92",
            successBg: "from-[#748D92]/10 to-[#124E66]/10",
            successBorder: "border-[#748D92]/30",
            successText: "#D3D9D4",
            errorBg: "from-[#FF6B6B]/10 to-[#E74C3C]/10",
            errorBorder: "border-[#FF6B6B]/30",
            errorText: "#FF6B6B",
            iconBg: "from-[#124E66] to-[#212A31]",
            iconText: "#D3D9D4",
            iconBgAlt: "from-[#748D92] to-[#124E66]",
            iconTextAlt: "#D3D9D4",
            iconHover: "hover:scale-105",
            shadow: "shadow-[#124E66]/10",
            requirementMet: "#748D92",
            requirementUnmet: "rgba(116, 141, 146, 0.5)"
        }
    }
    let theme = localStorage.getItem('userTheme') || user.theme;
    const colors = themeColors[theme]

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
        <div className={`${colors.containerBg} backdrop-blur-sm flex flex-col rounded-xl border ${colors.containerBorder}`}>

            {/* Toast Notification */}
            <AnimatePresence>
                {toast.show && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className={`fixed bottom-20 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl z-50 shadow-lg backdrop-blur-sm ${toast.type === 'success'
                            ? `bg-gradient-to-r ${colors.successBg} border ${colors.successBorder}`
                            : `bg-gradient-to-r ${colors.errorBg} border ${colors.errorBorder}`
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${toast.type === 'success'
                                ? `bg-gradient-to-r ${colors.iconBgAlt}`
                                : theme === 'light' ? 'bg-gradient-to-r from-[#FFB6B6] to-[#FF6B6B]' : 'bg-gradient-to-r from-[#FF6B6B] to-[#E74C3C]'
                                }`}>
                                <i className={`ri-${toast.type === 'success' ? 'check' : 'close'}-line ${toast.type === 'success' ? (theme === 'light' ? 'text-[#2E3944]' : 'text-white') : 'text-white'} text-sm`}></i>
                            </div>
                            <span className={`font-['Source_Sans_Pro'] font-semibold ${toast.type === 'success' ? colors.successText : colors.errorText}`}>
                                {toast.text}
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* CONTENT */}
            <div className="my-5 mx-4 flex flex-col gap-5">

                {/* CHANGE NAME */}
                <div className={`flex flex-col py-4 px-4 bg-gradient-to-b ${colors.cardBg} rounded-xl border ${colors.cardBorder} shadow-lg`}>
                    <div
                        onClick={() => setShowNamePanel(!showNamePanel)}
                        className='flex flex-row items-center justify-between cursor-pointer group'
                    >
                        <div className='flex gap-4 items-center'>
                            <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${colors.iconBg} flex items-center justify-center ${colors.iconHover} transition`}>
                                <i className={`ri-edit-box-line text-[22px] ${colors.iconText}`}></i>
                            </div>
                            <div>
                                <h3 className={`text-[17px] font-bold font-["Merriweather"] ${colors.textPrimary}`}>
                                    Change your Name
                                </h3>
                                <p className={`font-["Source_Sans_Pro"] ${colors.textSecondary} text-sm`}>
                                    Update your first and last name
                                </p>
                            </div>
                        </div>
                        <i
                            className={`ri-arrow-right-s-line text-2xl ${colors.textSecondary} transition-transform duration-300 ${showNamePanel ? 'rotate-90' : ''
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
                                className="overflow-hidden mt-5 flex flex-col gap-4"
                            >
                                {/* First Name */}
                                <div className='space-y-2'>
                                    <label className={`font-["Source_Sans_Pro"] font-semibold ${colors.textPrimary} text-sm`}>
                                        First Name
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                            <i className={`ri-user-line ${colors.textSecondary}`}></i>
                                        </div>
                                        <input
                                            className={`w-full pl-12 pr-4 py-3 ${colors.inputBg} border ${colors.inputBorder} rounded-xl outline-none focus:ring-2 ${colors.inputFocusRing} focus:${colors.inputFocusBorder} transition-all font-['Source_Sans_Pro'] ${colors.textPrimary} placeholder:${theme === 'light' ? 'text-[#89A8B2]/60' : 'text-[#748D92]'}`}
                                            value={newFirstName}
                                            onChange={(e) => setNewFirstName(e.target.value)}
                                            placeholder="Enter first name"
                                        />
                                    </div>
                                </div>

                                {/* Last Name */}
                                <div className='space-y-2'>
                                    <label className={`font-["Source_Sans_Pro"] font-semibold ${colors.textPrimary} text-sm`}>
                                        Last Name
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                            <i className={`ri-user-line ${colors.textSecondary}`}></i>
                                        </div>
                                        <input
                                            className={`w-full pl-12 pr-4 py-3 ${colors.inputBg} border ${colors.inputBorder} rounded-xl outline-none focus:ring-2 ${colors.inputFocusRing} focus:${colors.inputFocusBorder} transition-all font-['Source_Sans_Pro'] ${colors.textPrimary} placeholder:${theme === 'light' ? 'text-[#89A8B2]/60' : 'text-[#748D92]'}`}
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
                                    className={`w-full py-3 rounded-xl font-['Source_Sans_Pro'] font-semibold transition-all ${loading
                                        ? `bg-gradient-to-r ${colors.buttonDisabled} ${colors.buttonDisabledText} cursor-not-allowed`
                                        : `bg-gradient-to-r ${colors.buttonBg} ${colors.buttonText} hover:shadow-lg ${theme === 'light' ? 'hover:shadow-[#89A8B2]/20' : 'hover:shadow-[#124E66]/20'}`
                                        }`}
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className={`w-4 h-4 border-2 ${theme === 'light' ? 'border-[#F1F0E8]/30 border-t-[#F1F0E8]' : 'border-[#D3D9D4]/30 border-t-[#D3D9D4]'} rounded-full animate-spin`}></div>
                                            <span>Saving...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <span>Save Changes</span>
                                            <i className="ri-save-3-line ml-2"></i>
                                        </>
                                    )}
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* CHANGE PASSWORD */}
                <div className={`flex flex-col py-4 px-4 bg-gradient-to-b ${colors.cardBg} rounded-xl border ${colors.cardBorder} shadow-lg`}>
                    <div
                        onClick={() => setShowPasswordPanel(!showPasswordPanel)}
                        className='flex flex-row items-center justify-between cursor-pointer group'
                    >
                        <div className='flex gap-4 items-center'>
                            <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${colors.iconBgAlt} flex items-center justify-center ${colors.iconHover} transition`}>
                                <i className={`ri-lock-password-line text-[22px] ${colors.iconText}`}></i>
                            </div>
                            <div>
                                <h3 className={`text-[17px] font-bold font-["Merriweather"] ${colors.textPrimary}`}>
                                    Change Your Password
                                </h3>
                                <p className={`font-["Source_Sans_Pro"] ${colors.textSecondary} text-sm`}>
                                    Update your account password
                                </p>
                            </div>
                        </div>
                        <i
                            className={`ri-arrow-right-s-line text-2xl ${colors.textSecondary} transition-transform duration-300 ${showPasswordPanel ? 'rotate-90' : ''
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
                                className="overflow-hidden mt-5 flex flex-col gap-4"
                            >
                                {/* Old Password */}
                                <div className='space-y-2'>
                                    <label className={`font-["Source_Sans_Pro"] font-semibold ${colors.textPrimary} text-sm`}>
                                        Current Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                            <i className={`ri-lock-line ${colors.textSecondary}`}></i>
                                        </div>
                                        <input
                                            type={showOldPassword ? "text" : "password"}
                                            className={`w-full pl-12 pr-12 py-3 ${colors.inputBg} border ${colors.inputBorder} rounded-xl outline-none focus:ring-2 ${colors.inputFocusRing} focus:${colors.inputFocusBorder} transition-all font-['Source_Sans_Pro'] ${colors.textPrimary} placeholder:${theme === 'light' ? 'text-[#89A8B2]/60' : 'text-[#748D92]'}`}
                                            value={oldPassword}
                                            onChange={(e) => setOldPassword(e.target.value)}
                                            placeholder="Enter current password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowOldPassword(!showOldPassword)}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2"
                                        >
                                            <i className={`ri-${showOldPassword ? 'eye-off-line' : 'eye-line'} ${colors.textSecondary} hover:${colors.textPrimary}`}></i>
                                        </button>
                                    </div>
                                </div>

                                {/* New Password */}
                                <div className='space-y-2'>
                                    <label className={`font-["Source_Sans_Pro"] font-semibold ${colors.textPrimary} text-sm`}>
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                            <i className={`ri-lock-unlock-line ${colors.textSecondary}`}></i>
                                        </div>
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            className={`w-full pl-12 pr-12 py-3 ${colors.inputBg} border ${colors.inputBorder} rounded-xl outline-none focus:ring-2 ${colors.inputFocusRing} focus:${colors.inputFocusBorder} transition-all font-['Source_Sans_Pro'] ${colors.textPrimary} placeholder:${theme === 'light' ? 'text-[#89A8B2]/60' : 'text-[#748D92]'}`}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Enter new password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2"
                                        >
                                            <i className={`ri-${showNewPassword ? 'eye-off-line' : 'eye-line'} ${colors.textSecondary} hover:${colors.textPrimary}`}></i>
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm Password */}
                                <div className='space-y-2'>
                                    <label className={`font-["Source_Sans_Pro"] font-semibold ${colors.textPrimary} text-sm`}>
                                        Confirm New Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                            <i className={`ri-check-double-line ${colors.textSecondary}`}></i>
                                        </div>
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            className={`w-full pl-12 pr-12 py-3 ${colors.inputBg} border rounded-xl outline-none focus:ring-2 transition-all font-['Source_Sans_Pro'] ${colors.textPrimary} placeholder:${theme === 'light' ? 'text-[#89A8B2]/60' : 'text-[#748D92]'} ${confirmPassword && newPassword !== confirmPassword
                                                ? theme === 'light'
                                                    ? 'border-[#FFB6B6] focus:ring-[#FFB6B6]/50'
                                                    : 'border-[#FF6B6B] focus:ring-[#FF6B6B]/50'
                                                : `${colors.inputBorder} ${colors.inputFocusRing} focus:${colors.inputFocusBorder}`
                                                }`}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Confirm new password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2"
                                        >
                                            <i className={`ri-${showConfirmPassword ? 'eye-off-line' : 'eye-line'} ${colors.textSecondary} hover:${colors.textPrimary}`}></i>
                                        </button>
                                    </div>

                                    {/* Password Match Indicator */}
                                    {confirmPassword && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className={`flex items-center gap-2 mt-2 ${newPassword === confirmPassword
                                                ? colors.textSecondary
                                                : theme === 'light' ? 'text-[#FF6B6B]' : 'text-[#FF6B6B]'
                                                }`}
                                        >
                                            <i className={`ri-${newPassword === confirmPassword ? 'check-line' : 'close-line'} text-sm`}></i>
                                            <span className={`font-['Source_Sans_Pro'] text-xs`}>
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
                                    className={`w-full py-3 rounded-xl font-['Source_Sans_Pro'] font-semibold transition-all ${loading || !oldPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword
                                        ? `bg-gradient-to-r ${colors.buttonDisabled} ${colors.buttonDisabledText} cursor-not-allowed`
                                        : `bg-gradient-to-r ${colors.buttonBg} ${colors.buttonText} hover:shadow-lg ${theme === 'light' ? 'hover:shadow-[#89A8B2]/20' : 'hover:shadow-[#124E66]/20'}`
                                        }`}
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className={`w-4 h-4 border-2 ${theme === 'light' ? 'border-[#F1F0E8]/30 border-t-[#F1F0E8]' : 'border-[#D3D9D4]/30 border-t-[#D3D9D4]'} rounded-full animate-spin`}></div>
                                            <span>Updating...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <span>Update Password</span>
                                            <i className="ri-key-2-line ml-2"></i>
                                        </>
                                    )}
                                </motion.button>

                                {/* Password Requirements */}
                                <div className={`p-3 ${theme === 'light' ? 'bg-[#E5E1DA]/50' : 'bg-[#212A31]/50'} rounded-xl border ${colors.cardBorder} mt-2`}>
                                    <p className={`font-['Source_Sans_Pro'] text-sm ${colors.textPrimary} mb-2`}>
                                        Password Requirements:
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <i className={`ri-${newPassword.length >= 6 ? 'check' : 'close'}-line text-xs ${newPassword.length >= 6 ? colors.requirementMet : colors.requirementUnmet}`}></i>
                                        <span className={`font-['Source_Sans_Pro'] text-xs ${newPassword.length >= 6 ? colors.requirementMet : colors.requirementUnmet}`}>
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