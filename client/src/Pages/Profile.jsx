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

  const [theme, setTheme] = useState('dark')
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gradient-to-b from-[#212A31] via-[#2E3944] to-[#124E66]"
    >
      {/* PROFILE HEADER */}
      <div className="pt-8 pb-6 px-6 bg-gradient-to-r from-[#124E66] to-[#2E3944]">
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <div className="w-28 h-28 rounded-full bg-gradient-to-r from-[#748D92] to-[#124E66] flex items-center justify-center shadow-xl">
              <i className="ri-user-3-fill text-5xl text-[#D3D9D4]"></i>
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-r from-[#748D92] to-[#124E66] flex items-center justify-center border-4 border-[#2E3944]">
              <i className="ri-check-fill text-[#D3D9D4] text-sm"></i>
            </div>
          </div>

          <h2 className="font-['Merriweather'] text-[26px] font-bold text-[#D3D9D4] mb-1">
            {user?.fullname?.firstname} {user?.fullname?.lastname}
          </h2>
          <p className="font-['Source_Sans_Pro'] text-[#748D92] text-center mb-4">
            {user?.email}
          </p>

          <div className="flex items-center gap-2">
            <i className="ri-calendar-line text-[#748D92]"></i>
            <span className="font-['Source_Sans_Pro'] text-[#748D92] text-sm">
              Member since {new Date(user?.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
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
            className="bg-[#2E3944]/80 backdrop-blur-sm rounded-2xl border border-[#748D92]/20 shadow-lg overflow-hidden"
          >
            <div
              onClick={() => setEditProfilePanel(!editProfilePanel)}
              className="flex py-4 px-5 items-center justify-between cursor-pointer group"
            >
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#124E66] to-[#212A31] flex items-center justify-center">
                  <i className="ri-user-fill text-xl text-[#D3D9D4]"></i>
                </div>
                <div>
                  <h3 className="font-['Merriweather'] font-bold text-[17px] text-[#D3D9D4]">
                    Edit Profile
                  </h3>
                  <p className="font-['Source_Sans_Pro'] text-[#748D92] text-sm">
                    Update your personal information
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <i
                  className={`ri-arrow-right-s-line text-2xl text-[#748D92] transition-transform duration-300 ${editProfilePanel ? 'rotate-90' : ''
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
                  className="overflow-hidden border-t border-[#748D92]/20"
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
            className="bg-[#2E3944]/80 backdrop-blur-sm rounded-2xl border border-[#748D92]/20 shadow-lg overflow-hidden"
          >
            <div
              onClick={() => setNotificationPanel(!notificationPanel)}
              className="flex py-4 px-5 items-center justify-between cursor-pointer group"
            >
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#748D92] to-[#124E66] flex items-center justify-center">
                  <i className="ri-notification-4-line text-xl text-[#D3D9D4]"></i>
                </div>
                <div>
                  <h3 className="font-['Merriweather'] font-bold text-[17px] text-[#D3D9D4]">
                    Notifications
                  </h3>
                  <p className="font-['Source_Sans_Pro'] text-[#748D92] text-sm">
                    Daily reminders and updates
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`font-['Source_Sans_Pro'] text-sm ${notification === 'on' ? 'text-[#748D92]' : 'text-[#748D92]/60'
                  }`}>
                  {notification === 'on' ? 'ON' : 'OFF'}
                </span>
                <i
                  className={`ri-arrow-right-s-line text-2xl text-[#748D92] transition-transform duration-300 ${notificationPanel ? 'rotate-90' : ''
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
                  className="overflow-hidden border-t border-[#748D92]/20"
                >
                  <div className="p-5">
                    <h4 className="font-['Merriweather'] font-semibold text-[#D3D9D4] mb-4">
                      Notification Settings
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => {
                          setNotification("on")
                          setNotificationPanel(false)
                        }}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300 ${notification === "on"
                          ? "bg-gradient-to-r from-[#124E66]/30 to-[#212A31]/30 border-2 border-[#748D92]"
                          : "bg-[#212A31] border border-[#2E3944] hover:border-[#124E66]"
                          }`}
                      >
                        <div className={`w-10 h-10 rounded-full mb-2 flex items-center justify-center ${notification === "on"
                          ? "bg-gradient-to-r from-[#748D92] to-[#124E66]"
                          : "bg-[#2E3944]"
                          }`}>
                          <i className={`ri-notification-4-line text-lg ${notification === "on" ? "text-[#D3D9D4]" : "text-[#748D92]"
                            }`}></i>
                        </div>
                        <span className="font-['Source_Sans_Pro'] font-semibold text-[#D3D9D4]">
                          On
                        </span>
                        <span className="text-[#748D92] text-xs mt-1">Daily reminders</span>
                      </button>

                      <button
                        onClick={() => {
                          setNotification("off")
                          setNotificationPanel(false)
                        }}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300 ${notification === "off"
                          ? "bg-gradient-to-r from-[#124E66]/30 to-[#212A31]/30 border-2 border-[#FF6B6B]"
                          : "bg-[#212A31] border border-[#2E3944] hover:border-[#124E66]"
                          }`}
                      >
                        <div className={`w-10 h-10 rounded-full mb-2 flex items-center justify-center ${notification === "off"
                          ? "bg-gradient-to-r from-[#FF6B6B] to-[#E74C3C]"
                          : "bg-[#2E3944]"
                          }`}>
                          <i className={`ri-notification-off-line text-lg ${notification === "off" ? "text-white" : "text-[#748D92]"
                            }`}></i>
                        </div>
                        <span className="font-['Source_Sans_Pro'] font-semibold text-[#D3D9D4]">
                          Off
                        </span>
                        <span className="text-[#748D92] text-xs mt-1">Silent mode</span>
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
            className="bg-[#2E3944]/80 backdrop-blur-sm rounded-2xl border border-[#748D92]/20 shadow-lg overflow-hidden"
          >
            <div
              onClick={() => setThemePanel(!themePanel)}
              className="flex py-4 px-5 items-center justify-between cursor-pointer group"
            >
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#124E66] to-[#2E3944] flex items-center justify-center">
                  <i className="ri-contrast-2-line text-xl text-[#D3D9D4]"></i>
                </div>
                <div>
                  <h3 className="font-['Merriweather'] font-bold text-[17px] text-[#D3D9D4]">
                    Theme
                  </h3>
                  <p className="font-['Source_Sans_Pro'] text-[#748D92] text-sm">
                    Customize your experience
                  </p>
                </div>
              </div>
                
              <div className="flex items-center gap-2">
                <span className="font-['Source_Sans_Pro'] text-sm text-[#748D92] capitalize">
                  {theme}
                </span>
                <i
                  className={`ri-arrow-right-s-line text-2xl text-[#748D92] transition-transform duration-300 ${themePanel ? 'rotate-90' : ''
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
                  className="overflow-hidden border-t border-[#748D92]/20"
                >
                  <div className="p-5">
                    <h4 className="font-['Merriweather'] font-semibold text-[#D3D9D4] mb-4">
                      Choose Theme
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => {
                          setTheme("light")
                          setThemePanel(false)
                        }}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300 ${theme === "light"
                          ? "bg-gradient-to-r from-[#124E66]/30 to-[#212A31]/30 border-2 border-[#748D92]"
                          : "bg-[#212A31] border border-[#2E3944] hover:border-[#124E66]"
                          }`}
                      >
                        <div className={`w-10 h-10 rounded-full mb-2 flex items-center justify-center ${theme === "light"
                          ? "bg-gradient-to-r from-[#D3D9D4] to-[#748D92]"
                          : "bg-[#2E3944]"
                          }`}>
                          <i className={`ri-sun-line text-lg ${theme === "light" ? "text-[#212A31]" : "text-[#748D92]"
                            }`}></i>
                        </div>
                        <span className="font-['Source_Sans_Pro'] font-semibold text-[#D3D9D4]">
                          Light
                        </span>
                        <span className="text-[#748D92] text-xs mt-1">Bright theme</span>
                      </button>

                      <button
                        onClick={() => {
                          setTheme("dark")
                          setThemePanel(false)
                        }}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300 ${theme === "dark"
                          ? "bg-gradient-to-r from-[#124E66]/30 to-[#212A31]/30 border-2 border-[#124E66]"
                          : "bg-[#212A31] border border-[#2E3944] hover:border-[#124E66]"
                          }`}
                      >
                        <div className={`w-10 h-10 rounded-full mb-2 flex items-center justify-center ${theme === "dark"
                          ? "bg-gradient-to-r from-[#124E66] to-[#212A31]"
                          : "bg-[#2E3944]"
                          }`}>
                          <i className={`ri-moon-line text-lg ${theme === "dark" ? "text-[#D3D9D4]" : "text-[#748D92]"
                            }`}></i>
                        </div>
                        <span className="font-['Source_Sans_Pro'] font-semibold text-[#D3D9D4]">
                          Dark
                        </span>
                        <span className="text-[#748D92] text-xs mt-1">Default theme</span>
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
            className="bg-[#2E3944]/80 backdrop-blur-sm rounded-2xl border border-[#748D92]/20 shadow-lg overflow-hidden"
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
                  <h3 className="font-['Merriweather'] font-bold text-[17px] text-[#D3D9D4]">
                    Data Management
                  </h3>
                  <p className="font-['Source_Sans_Pro'] text-[#748D92] text-sm">
                    Reset your habit data
                  </p>
                </div>
              </div>

              <i
                className={`ri-arrow-right-s-line text-2xl text-[#748D92] transition-transform duration-300 ${resetDataPanel ? 'rotate-90' : ''
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
                  className="overflow-hidden border-t border-[#748D92]/20"
                >
                  <div className="p-5">
                    <div className="flex flex-col items-center text-center mb-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#FF6B6B]/20 to-[#E74C3C]/20 flex items-center justify-center mb-3">
                        <i className="ri-error-warning-line text-2xl text-[#FF6B6B]"></i>
                      </div>
                      <h4 className="font-['Merriweather'] font-semibold text-[#D3D9D4] mb-2">
                        Reset All Habits
                      </h4>
                      <p className="font-['Source_Sans_Pro'] text-[#748D92] text-sm">
                        This will permanently delete all your habits and progress data. This action cannot be undone.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setResetDataPanel(false)
                        // Add your reset logic here
                        // navigate('/home')
                      }}
                      className="w-full py-3 bg-gradient-to-r from-[#FF6B6B] to-[#E74C3C] text-white font-['Source_Sans_Pro'] font-semibold rounded-xl hover:shadow-lg hover:shadow-[#FF6B6B]/20 transition-all active:scale-95"
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
          className="w-full py-4 bg-gradient-to-r from-[#124E66] to-[#212A31] text-[#D3D9D4] font-['Source_Sans_Pro'] font-semibold rounded-xl hover:shadow-xl hover:shadow-[#124E66]/20 transition-all active:scale-95 flex items-center justify-center gap-3"
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
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-b from-[#2E3944] to-[#212A31] rounded-2xl w-[90%] max-w-sm p-6 border border-[#748D92]/20 shadow-2xl"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#FF6B6B] to-[#E74C3C] flex items-center justify-center mb-4">
                  <i className="ri-logout-box-r-line text-3xl text-white"></i>
                </div>

                <h3 className="font-['Merriweather'] font-bold text-[22px] text-[#D3D9D4] mb-2">
                  Logout Account
                </h3>

                <p className="font-['Source_Sans_Pro'] text-[#748D92] mb-6">
                  Are you sure you want to logout? You can always log back in at any time.
                </p>

                <div className="flex justify-between gap-4 w-full">
                  <button
                    onClick={() => setLogoutConfirmTost(false)}
                    className="flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-[#2E3944] to-[#212A31] text-[#748D92] font-['Source_Sans_Pro'] font-semibold hover:shadow-lg hover:shadow-[#212A31]/20 active:scale-95 transition border border-[#748D92]/20"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() => {
                      setLogoutConfirmTost(false)
                      UserLogout()
                    }}
                    className="flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-[#FF6B6B] to-[#E74C3C] text-white font-['Source_Sans_Pro'] font-semibold hover:shadow-lg hover:shadow-[#FF6B6B]/20 active:scale-95 transition"
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