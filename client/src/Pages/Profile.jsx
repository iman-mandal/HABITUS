import React, { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import 'remixicon/fonts/remixicon.css'
import axios from 'axios'
import { useUser } from '../context/UserContext.jsx'
import EditProfile from '../components/EditProfile.jsx'
import { motion, AnimatePresence } from 'framer-motion'

const Profile = () => {
  const { user, setUser } = useUser()
  const navigate = useNavigate()

  const [theme, setTheme] = useState('light')
  const [notification, setNotification] = useState('on')
  const [notificationPanel, setNotificationPanel] = useState(false)
  const [editProfilePanel, setEditProfilePanel] = useState(false)
  const [themePanel, setThemePanel] = useState(false)
  const [logoutConfirmTost, setLogoutConfirmTost] = useState(false)
  const [resetDataPanel, setResetDataPanel] = useState(false)

  const UserLogout = useCallback(async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/user/logout`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )

      if (response.status === 200) {
        localStorage.removeItem('token')
        navigate('/login')
      }
    } catch (err) {
      console.error('Logout failed:', err)
      localStorage.removeItem('token')
      navigate('/login')
    }
  }, [navigate])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
    }
  }, [navigate])

  // Nature-themed color variables
  const natureColors = {
    primary: '#2D5A27',
    secondary: '#4A7C3F',
    accent: '#FFD166',
    lightBg: '#F5E8C7',
    cardBg: '#FFFFFF',
    textDark: '#2D3748',
    textLight: '#5D6D55',
    danger: '#E74C3C',
    success: '#4CAF50',
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gradient-to-b from-[#F5E8C7] to-[#E8F5E9]"
    >
      {/* PROFILE HEADER */}
      <div className="pt-8 pb-6 px-6 bg-gradient-to-r from-[#2D5A27] to-[#4A7C3F]">
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <div className="w-28 h-28 rounded-full bg-gradient-to-r from-[#FFD166] to-[#FFB347] flex items-center justify-center shadow-xl">
              <i className="ri-user-3-fill text-5xl text-white"></i>
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-r from-[#4CAF50] to-[#2D5A27] flex items-center justify-center border-4 border-white">
              <i className="ri-check-fill text-white text-sm"></i>
            </div>
          </div>

          <h2 className="font-['Merriweather'] text-[26px] font-bold text-white mb-1">
            {user?.fullname?.firstname} {user?.fullname?.lastname}
          </h2>
          <p className="font-['Source_Sans_Pro'] text-white/80 text-center mb-4">
            {user?.email}
          </p>

          <div className="flex items-center gap-2">
            <i className="ri-leaf-fill text-white/60"></i>
            <span className="font-['Source_Sans_Pro'] text-white/60 text-sm">
              Cultivating good habits since {new Date(user?.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>
      </div>

      {/* SETTINGS LIST */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="px-6 py-6"
      >
        <div className="space-y-4">

          {/* EDIT PROFILE */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl border border-[#E0E6D6] shadow-lg overflow-hidden"
          >
            <div
              onClick={() => setEditProfilePanel(!editProfilePanel)}
              className="flex py-4 px-5 items-center justify-between cursor-pointer group"
            >
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#4A7C3F] to-[#6B8E23] flex items-center justify-center">
                  <i className="ri-user-fill text-xl text-white"></i>
                </div>
                <div>
                  <h3 className="font-['Merriweather'] font-bold text-[17px] text-[#2D5A27]">
                    Edit Profile
                  </h3>
                  <p className="font-['Source_Sans_Pro'] text-[#5D6D55] text-sm">
                    Update your personal information
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <i
                  className={`ri-arrow-right-s-line text-2xl text-[#5D6D55] transition-transform duration-300 ${editProfilePanel ? 'rotate-90' : ''
                    }`}
                ></i>
              </div>
            </div>

            {/* ANIMATED PANEL */}
            <AnimatePresence>
              {editProfilePanel && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden border-t border-[#E0E6D6]"
                >
                  <EditProfile user={user} setUser={setUser}
                    setEditProfilePanel={setEditProfilePanel} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* NOTIFICATION */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl border border-[#E0E6D6] shadow-lg overflow-hidden"
          >
            <div
              onClick={() => setNotificationPanel(!notificationPanel)}
              className="flex py-4 px-5 items-center justify-between cursor-pointer group"
            >
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FFD166] to-[#FFB347] flex items-center justify-center">
                  <i className="ri-notification-4-line text-xl text-white"></i>
                </div>
                <div>
                  <h3 className="font-['Merriweather'] font-bold text-[17px] text-[#2D5A27]">
                    Notifications
                  </h3>
                  <p className="font-['Source_Sans_Pro'] text-[#5D6D55] text-sm">
                    Daily reminders and updates
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`font-['Source_Sans_Pro'] text-sm ${notification === 'on' ? 'text-[#4CAF50]' : 'text-[#7A7A7A]'
                  }`}>
                  {notification === 'on' ? 'ON' : 'OFF'}
                </span>
                <i
                  className={`ri-arrow-right-s-line text-2xl text-[#5D6D55] transition-transform duration-300 ${notificationPanel ? 'rotate-90' : ''
                    }`}
                ></i>
              </div>
            </div>

            <AnimatePresence>
              {notificationPanel && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden border-t border-[#E0E6D6]"
                >
                  <div className="p-5">
                    <h4 className="font-['Merriweather'] font-semibold text-[#2D5A27] mb-4">
                      Notification Settings
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => {
                          setNotification("on")
                          setNotificationPanel(false)
                        }}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300 ${notification === "on"
                            ? "bg-gradient-to-r from-[#F0F8E8] to-[#E8F5E9] border-2 border-[#4CAF50]"
                            : "bg-gradient-to-r from-[#F9FBF5] to-[#F0F8E8] border border-[#E0E6D6] hover:border-[#4A7C3F]"
                          }`}
                      >
                        <div className={`w-10 h-10 rounded-full mb-2 flex items-center justify-center ${notification === "on"
                            ? "bg-gradient-to-r from-[#4CAF50] to-[#2D5A27]"
                            : "bg-gradient-to-r from-[#F5E8C7] to-[#E8F5E9]"
                          }`}>
                          <i className={`ri-notification-4-line text-lg ${notification === "on" ? "text-white" : "text-[#5D6D55]"
                            }`}></i>
                        </div>
                        <span className="font-['Source_Sans_Pro'] font-semibold text-[#2D5A27]">
                          On
                        </span>
                        <span className="text-[#5D6D55] text-xs mt-1">Daily reminders</span>
                      </button>

                      <button
                        onClick={() => {
                          setNotification("off")
                          setNotificationPanel(false)
                        }}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300 ${notification === "off"
                            ? "bg-gradient-to-r from-[#F0F8E8] to-[#E8F5E9] border-2 border-[#FF6B6B]"
                            : "bg-gradient-to-r from-[#F9FBF5] to-[#F0F8E8] border border-[#E0E6D6] hover:border-[#4A7C3F]"
                          }`}
                      >
                        <div className={`w-10 h-10 rounded-full mb-2 flex items-center justify-center ${notification === "off"
                            ? "bg-gradient-to-r from-[#FF6B6B] to-[#E74C3C]"
                            : "bg-gradient-to-r from-[#F5E8C7] to-[#E8F5E9]"
                          }`}>
                          <i className={`ri-notification-off-line text-lg ${notification === "off" ? "text-white" : "text-[#5D6D55]"
                            }`}></i>
                        </div>
                        <span className="font-['Source_Sans_Pro'] font-semibold text-[#2D5A27]">
                          Off
                        </span>
                        <span className="text-[#5D6D55] text-xs mt-1">Silent mode</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* THEME */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl border border-[#E0E6D6] shadow-lg overflow-hidden"
          >
            <div
              onClick={() => setThemePanel(!themePanel)}
              className="flex py-4 px-5 items-center justify-between cursor-pointer group"
            >
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#9B59B6] to-[#8E44AD] flex items-center justify-center">
                  <i className="ri-contrast-2-line text-xl text-white"></i>
                </div>
                <div>
                  <h3 className="font-['Merriweather'] font-bold text-[17px] text-[#2D5A27]">
                    Theme
                  </h3>
                  <p className="font-['Source_Sans_Pro'] text-[#5D6D55] text-sm">
                    Customize your experience
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-['Source_Sans_Pro'] text-sm text-[#5D6D55] capitalize">
                  {theme}
                </span>
                <i
                  className={`ri-arrow-right-s-line text-2xl text-[#5D6D55] transition-transform duration-300 ${themePanel ? 'rotate-90' : ''
                    }`}
                ></i>
              </div>
            </div>

            <AnimatePresence>
              {themePanel && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden border-t border-[#E0E6D6]"
                >
                  <div className="p-5">
                    <h4 className="font-['Merriweather'] font-semibold text-[#2D5A27] mb-4">
                      Choose Theme
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => {
                          setTheme("light")
                          setThemePanel(false)
                        }}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300 ${theme === "light"
                            ? "bg-gradient-to-r from-[#F0F8E8] to-[#E8F5E9] border-2 border-[#FFD166]"
                            : "bg-gradient-to-r from-[#F9FBF5] to-[#F0F8E8] border border-[#E0E6D6] hover:border-[#4A7C3F]"
                          }`}
                      >
                        <div className={`w-10 h-10 rounded-full mb-2 flex items-center justify-center ${theme === "light"
                            ? "bg-gradient-to-r from-[#FFD166] to-[#FFB347]"
                            : "bg-gradient-to-r from-[#F5E8C7] to-[#E8F5E9]"
                          }`}>
                          <i className={`ri-sun-line text-lg ${theme === "light" ? "text-white" : "text-[#5D6D55]"
                            }`}></i>
                        </div>
                        <span className="font-['Source_Sans_Pro'] font-semibold text-[#2D5A27]">
                          Light
                        </span>
                        <span className="text-[#5D6D55] text-xs mt-1">Nature light</span>
                      </button>

                      <button
                        onClick={() => {
                          setTheme("dark")
                          setThemePanel(false)
                        }}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300 ${theme === "dark"
                            ? "bg-gradient-to-r from-[#F0F8E8] to-[#E8F5E9] border-2 border-[#2D5A27]"
                            : "bg-gradient-to-r from-[#F9FBF5] to-[#F0F8E8] border border-[#E0E6D6] hover:border-[#4A7C3F]"
                          }`}
                      >
                        <div className={`w-10 h-10 rounded-full mb-2 flex items-center justify-center ${theme === "dark"
                            ? "bg-gradient-to-r from-[#2D5A27] to-[#1A3B16]"
                            : "bg-gradient-to-r from-[#F5E8C7] to-[#E8F5E9]"
                          }`}>
                          <i className={`ri-moon-line text-lg ${theme === "dark" ? "text-white" : "text-[#5D6D55]"
                            }`}></i>
                        </div>
                        <span className="font-['Source_Sans_Pro'] font-semibold text-[#2D5A27]">
                          Dark
                        </span>
                        <span className="text-[#5D6D55] text-xs mt-1">Forest night</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* DATA RESET */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl border border-[#E0E6D6] shadow-lg overflow-hidden"
          >
            <div
              onClick={() => setResetDataPanel(!resetDataPanel)}
              className="flex py-4 px-5 items-center justify-between cursor-pointer group"
            >
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF6B6B] to-[#E74C3C] flex items-center justify-center">
                  <i className="ri-delete-bin-5-line text-xl text-white"></i>
                </div>
                <div>
                  <h3 className="font-['Merriweather'] font-bold text-[17px] text-[#2D5A27]">
                    Data Management
                  </h3>
                  <p className="font-['Source_Sans_Pro'] text-[#5D6D55] text-sm">
                    Reset your habit data
                  </p>
                </div>
              </div>

              <i
                className={`ri-arrow-right-s-line text-2xl text-[#5D6D55] transition-transform duration-300 ${resetDataPanel ? 'rotate-90' : ''
                  }`}
              ></i>
            </div>

            <AnimatePresence>
              {resetDataPanel && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden border-t border-[#E0E6D6]"
                >
                  <div className="p-5">
                    <div className="flex flex-col items-center text-center mb-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#FFE8E8] to-[#FFC9C9] flex items-center justify-center mb-3">
                        <i className="ri-error-warning-line text-2xl text-[#E74C3C]"></i>
                      </div>
                      <h4 className="font-['Merriweather'] font-semibold text-[#2D5A27] mb-2">
                        Reset All Habits
                      </h4>
                      <p className="font-['Source_Sans_Pro'] text-[#5D6D55] text-sm">
                        This will permanently delete all your habits and progress data. This action cannot be undone.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setResetDataPanel(false)
                        // Add your reset logic here
                        // navigate('/home')
                      }}
                      className="w-full py-3 bg-gradient-to-r from-[#FF6B6B] to-[#E74C3C] text-white font-['Source_Sans_Pro'] font-semibold rounded-xl hover:shadow-lg transition-all active:scale-95"
                    >
                      <i className="ri-delete-bin-5-line mr-2"></i>
                      Reset All Habits
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>

      {/* LOGOUT */}
      <div className="px-6 pb-24">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setLogoutConfirmTost(true)}
          className="w-full py-4 bg-gradient-to-r from-[#2D5A27] to-[#4A7C3F] text-white font-['Source_Sans_Pro'] font-semibold rounded-xl hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3"
        >
          <i className="ri-logout-box-r-line text-lg"></i>
          Logout
        </motion.button>
      </div>

      {/* LOGOUT CONFIRMATION MODAL */}
      <AnimatePresence>
        {logoutConfirmTost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-b from-white to-[#F5E8C7] rounded-2xl w-[90%] max-w-sm p-6 border border-[#E0E6D6] shadow-2xl"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#FF6B6B] to-[#E74C3C] flex items-center justify-center mb-4">
                  <i className="ri-logout-box-r-line text-3xl text-white"></i>
                </div>

                <h3 className="font-['Merriweather'] font-bold text-[22px] text-[#2D5A27] mb-2">
                  Logout Account
                </h3>

                <p className="font-['Source_Sans_Pro'] text-[#5D6D55] mb-6">
                  Are you sure you want to logout? You can always log back in at any time.
                </p>

                <div className="flex justify-between gap-4 w-full">
                  <button
                    onClick={() => setLogoutConfirmTost(false)}
                    className="flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-[#F0F0F0] to-[#E0E0E0] text-[#5D6D55] font-['Source_Sans_Pro'] font-semibold hover:shadow-lg active:scale-95 transition"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() => {
                      setLogoutConfirmTost(false)
                      UserLogout()
                    }}
                    className="flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-[#FF6B6B] to-[#E74C3C] text-white font-['Source_Sans_Pro'] font-semibold hover:shadow-lg active:scale-95 transition"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NAVBAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <Navbar />
      </div>
    </motion.div>
  )
}

export default Profile