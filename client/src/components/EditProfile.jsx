import React, { useEffect, useState } from 'react'
import { useUser } from '../context/UserContext'
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
        <div className="bg-[#2E3944]/90 backdrop-blur-sm flex flex-col rounded-xl border border-[#748D92]/20">

            {/* Toast Notification */}
            <AnimatePresence>
                {toast.show && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className={`fixed bottom-20 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl z-50 shadow-lg ${toast.type === 'success'
                            ? 'bg-gradient-to-r from-[#748D92]/10 to-[#124E66]/10 border border-[#748D92]/30'
                            : 'bg-gradient-to-r from-[#FF6B6B]/10 to-[#E74C3C]/10 border border-[#FF6B6B]/30'
                            } backdrop-blur-sm`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${toast.type === 'success'
                                ? 'bg-gradient-to-r from-[#748D92] to-[#124E66]'
                                : 'bg-gradient-to-r from-[#FF6B6B] to-[#E74C3C]'
                                }`}>
                                <i className={`ri-${toast.type === 'success' ? 'check' : 'close'}-line text-white text-sm`}></i>
                            </div>
                            <span className={`font-['Source_Sans_Pro'] font-semibold ${toast.type === 'success' ? 'text-[#D3D9D4]' : 'text-[#FF6B6B]'
                                }`}>
                                {toast.text}
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* CONTENT */}
            <div className="my-5 mx-4 flex flex-col gap-5">

                {/* CHANGE NAME */}
                <div className='flex flex-col py-4 px-4 bg-gradient-to-b from-[#212A31]/50 to-[#2E3944]/50 rounded-xl border border-[#748D92]/20 shadow-lg'>
                    <div
                        onClick={() => setShowNamePanel(!showNamePanel)}
                        className='flex flex-row items-center justify-between cursor-pointer group'
                    >
                        <div className='flex gap-4 items-center'>
                            <div className='w-12 h-12 rounded-full bg-gradient-to-r from-[#124E66] to-[#212A31] flex items-center justify-center group-hover:scale-105 transition'>
                                <i className="ri-edit-box-line text-[22px] text-[#D3D9D4]"></i>
                            </div>
                            <div>
                                <h3 className='text-[17px] font-bold font-["Merriweather"] text-[#D3D9D4]'>
                                    Change your Name
                                </h3>
                                <p className='font-["Source_Sans_Pro"] text-[#748D92] text-sm'>
                                    Update your first and last name
                                </p>
                            </div>
                        </div>
                        <i
                            className={`ri-arrow-right-s-line text-2xl text-[#748D92] transition-transform duration-300 ${showNamePanel ? 'rotate-90' : ''
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
                                    <label className='font-["Source_Sans_Pro"] font-semibold text-[#D3D9D4] text-sm'>
                                        First Name
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                            <i className="ri-user-line text-[#748D92]"></i>
                                        </div>
                                        <input
                                            className="w-full pl-12 pr-4 py-3 bg-[#212A31] border border-[#2E3944] rounded-xl outline-none focus:ring-2 focus:ring-[#124E66]/50 focus:border-[#124E66] transition-all font-['Source_Sans_Pro'] text-[#D3D9D4] placeholder:text-[#748D92]"
                                            value={newFirstName}
                                            onChange={(e) => setNewFirstName(e.target.value)}
                                            placeholder="Enter first name"
                                        />
                                    </div>
                                </div>

                                {/* Last Name */}
                                <div className='space-y-2'>
                                    <label className='font-["Source_Sans_Pro"] font-semibold text-[#D3D9D4] text-sm'>
                                        Last Name
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                            <i className="ri-user-line text-[#748D92]"></i>
                                        </div>
                                        <input
                                            className="w-full pl-12 pr-4 py-3 bg-[#212A31] border border-[#2E3944] rounded-xl outline-none focus:ring-2 focus:ring-[#124E66]/50 focus:border-[#124E66] transition-all font-['Source_Sans_Pro'] text-[#D3D9D4] placeholder:text-[#748D92]"
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
                                        ? 'bg-gradient-to-r from-[#2E3944] to-[#212A31] text-[#748D92] cursor-not-allowed'
                                        : 'bg-gradient-to-r from-[#124E66] to-[#212A31] text-[#D3D9D4] hover:shadow-lg hover:shadow-[#124E66]/20'
                                        }`}
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-[#D3D9D4]/30 border-t-[#D3D9D4] rounded-full animate-spin"></div>
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
                <div className='flex flex-col py-4 px-4 bg-gradient-to-b from-[#212A31]/50 to-[#2E3944]/50 rounded-xl border border-[#748D92]/20 shadow-lg'>
                    <div
                        onClick={() => setShowPasswordPanel(!showPasswordPanel)}
                        className='flex flex-row items-center justify-between cursor-pointer group'
                    >
                        <div className='flex gap-4 items-center'>
                            <div className='w-12 h-12 rounded-full bg-gradient-to-r from-[#748D92] to-[#124E66] flex items-center justify-center group-hover:scale-105 transition'>
                                <i className="ri-lock-password-line text-[22px] text-[#D3D9D4]"></i>
                            </div>
                            <div>
                                <h3 className='text-[17px] font-bold font-["Merriweather"] text-[#D3D9D4]'>
                                    Change Your Password
                                </h3>
                                <p className='font-["Source_Sans_Pro"] text-[#748D92] text-sm'>
                                    Update your account password
                                </p>
                            </div>
                        </div>
                        <i
                            className={`ri-arrow-right-s-line text-2xl text-[#748D92] transition-transform duration-300 ${showPasswordPanel ? 'rotate-90' : ''
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
                                    <label className='font-["Source_Sans_Pro"] font-semibold text-[#D3D9D4] text-sm'>
                                        Current Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                            <i className="ri-lock-line text-[#748D92]"></i>
                                        </div>
                                        <input
                                            type={showOldPassword ? "text" : "password"}
                                            className="w-full pl-12 pr-12 py-3 bg-[#212A31] border border-[#2E3944] rounded-xl outline-none focus:ring-2 focus:ring-[#124E66]/50 focus:border-[#124E66] transition-all font-['Source_Sans_Pro'] text-[#D3D9D4] placeholder:text-[#748D92]"
                                            value={oldPassword}
                                            onChange={(e) => setOldPassword(e.target.value)}
                                            placeholder="Enter current password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowOldPassword(!showOldPassword)}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2"
                                        >
                                            <i className={`ri-${showOldPassword ? 'eye-off-line' : 'eye-line'} text-[#748D92] hover:text-[#D3D9D4]`}></i>
                                        </button>
                                    </div>
                                </div>

                                {/* New Password */}
                                <div className='space-y-2'>
                                    <label className='font-["Source_Sans_Pro"] font-semibold text-[#D3D9D4] text-sm'>
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                            <i className="ri-lock-unlock-line text-[#748D92]"></i>
                                        </div>
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            className="w-full pl-12 pr-12 py-3 bg-[#212A31] border border-[#2E3944] rounded-xl outline-none focus:ring-2 focus:ring-[#124E66]/50 focus:border-[#124E66] transition-all font-['Source_Sans_Pro'] text-[#D3D9D4] placeholder:text-[#748D92]"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Enter new password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2"
                                        >
                                            <i className={`ri-${showNewPassword ? 'eye-off-line' : 'eye-line'} text-[#748D92] hover:text-[#D3D9D4]`}></i>
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm Password */}
                                <div className='space-y-2'>
                                    <label className='font-["Source_Sans_Pro"] font-semibold text-[#D3D9D4] text-sm'>
                                        Confirm New Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                            <i className="ri-check-double-line text-[#748D92]"></i>
                                        </div>
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            className={`w-full pl-12 pr-12 py-3 bg-[#212A31] border rounded-xl outline-none focus:ring-2 transition-all font-['Source_Sans_Pro'] text-[#D3D9D4] placeholder:text-[#748D92] ${confirmPassword && newPassword !== confirmPassword
                                                ? 'border-[#FF6B6B] focus:ring-[#FF6B6B]/50'
                                                : 'border-[#2E3944] focus:ring-[#124E66]/50 focus:border-[#124E66]'
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
                                            <i className={`ri-${showConfirmPassword ? 'eye-off-line' : 'eye-line'} text-[#748D92] hover:text-[#D3D9D4]`}></i>
                                        </button>
                                    </div>

                                    {/* Password Match Indicator */}
                                    {confirmPassword && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className={`flex items-center gap-2 mt-2 ${newPassword === confirmPassword ? 'text-[#748D92]' : 'text-[#FF6B6B]'
                                                }`}
                                        >
                                            <i className={`ri-${newPassword === confirmPassword ? 'check-line' : 'close-line'} text-sm`}></i>
                                            <span className="font-['Source_Sans_Pro'] text-xs">
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
                                        ? 'bg-gradient-to-r from-[#2E3944] to-[#212A31] text-[#748D92] cursor-not-allowed'
                                        : 'bg-gradient-to-r from-[#124E66] to-[#212A31] text-[#D3D9D4] hover:shadow-lg hover:shadow-[#124E66]/20'
                                        }`}
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-[#D3D9D4]/30 border-t-[#D3D9D4] rounded-full animate-spin"></div>
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
                                <div className="p-3 bg-[#212A31]/50 rounded-xl border border-[#748D92]/20 mt-2">
                                    <p className="font-['Source_Sans_Pro'] text-sm text-[#D3D9D4] mb-2">
                                        Password Requirements:
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <i className={`ri-${newPassword.length >= 6 ? 'check' : 'close'}-line text-xs ${newPassword.length >= 6 ? 'text-[#748D92]' : 'text-[#748D92]/50'
                                            }`}></i>
                                        <span className={`font-['Source_Sans_Pro'] text-xs ${newPassword.length >= 6 ? 'text-[#748D92]' : 'text-[#748D92]/50'
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