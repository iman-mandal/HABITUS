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

  const [notification, setNotification] = useState('on')
  const [notificationPanel, setNotificationPanel] = useState(false)
  const [editProfilePanel, setEditProfilePanel] = useState(false)
  const [themePanel, setThemePanel] = useState(false)
  const [logoutConfirmTost, setLogoutConfirmTost] = useState(false)
  const [resetDataPanel, setResetDataPanel] = useState(false)
  const [updatingTheme, setUpdatingTheme] = useState(false)



  // Theme configuration object
  const themeConfig = {
    light: {
      bgGradient: 'bg-gradient-to-b from-[#F1F0E8] via-[#E5E1DA] to-[#B3C8CF]',
      headerGradient: 'bg-gradient-to-r from-[#89A8B2] to-[#B3C8CF]',
      cardBg: 'bg-white/80',
      cardBorder: 'border-[#B3C8CF]/30',
      primaryText: 'text-[#2E3944]',
      secondaryText: 'text-[#5A6D74]',
      accentText: 'text-[#89A8B2]',
      iconBg: 'bg-gradient-to-r from-[#B3C8CF] to-[#89A8B2]',
      iconColor: 'text-[#2E3944]',
      logoutBtn: 'bg-gradient-to-r from-[#B3C8CF] to-[#E5E1DA] text-[#2E3944]',
      modalBg: 'bg-gradient-to-b from-white to-[#F1F0E8]',
      modalBorder: 'border-[#B3C8CF]/30',
      cancelBtn: 'bg-gradient-to-r from-[#E5E1DA] to-[#F1F0E8] text-[#5A6D74]',
      warningGradient: 'bg-gradient-to-r from-[#FF9A8B] to-[#FF6B6B]',
      warningLight: 'bg-gradient-to-r from-[#FF9A8B]/20 to-[#FF6B6B]/20',
      activeBorder: 'border-[#89A8B2]',
      activeBg: 'bg-gradient-to-r from-[#89A8B2]/30 to-[#B3C8CF]/30',
      hoverBorder: 'hover:border-[#89A8B2]',
      spinnerBorder: 'border-[#89A8B2]/30 border-t-[#89A8B2]'
    },
    dark: {
      bgGradient: 'bg-gradient-to-b from-[#212A31] via-[#2E3944] to-[#124E66]',
      headerGradient: 'bg-gradient-to-r from-[#124E66] to-[#2E3944]',
      cardBg: 'bg-[#2E3944]/80',
      cardBorder: 'border-[#748D92]/20',
      primaryText: 'text-[#D3D9D4]',
      secondaryText: 'text-[#748D92]',
      accentText: 'text-[#748D92]',
      iconBg: 'bg-gradient-to-r from-[#748D92] to-[#124E66]',
      iconColor: 'text-[#D3D9D4]',
      logoutBtn: 'bg-gradient-to-r from-[#16233d] to-[#212A31] text-[#D3D9D4]',
      modalBg: 'bg-gradient-to-b from-[#2E3944] to-[#212A31]',
      modalBorder: 'border-[#748D92]/20',
      cancelBtn: 'bg-gradient-to-r from-[#2E3944] to-[#212A31] text-[#748D92]',
      warningGradient: 'bg-gradient-to-r from-[#FF6B6B] to-[#E74C3C]',
      warningLight: 'bg-gradient-to-r from-[#FF6B6B]/20 to-[#E74C3C]/20',
      activeBorder: 'border-[#748D92]',
      activeBg: 'bg-gradient-to-r from-[#124E66]/30 to-[#212A31]/30',
      hoverBorder: 'hover:border-[#124E66]',
      spinnerBorder: 'border-[#748D92]/30 border-t-[#748D92]'
    }
  }
  // Get current theme from user or default to 'dark'
  const storedTheme = localStorage.getItem('userTheme');
  const currentTheme = storedTheme === 'dark' ? 'dark' : 'light';
  const theme = themeConfig[currentTheme];


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

  const updateTheme = useCallback(async (newTheme) => {
    try {
      setUpdatingTheme(true)
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/user/theme`,
        { theme: newTheme },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )

      if (response.status === 200) {
        setUser(prev => ({
          ...prev,
          theme: newTheme
        }))
      }
    } catch (error) {
      console.error('Theme update failed', error)
    } finally {
      setUpdatingTheme(false)
    }
  }, [setUser])

  // In your Profile component's updateTheme function:
  localStorage.setItem('userTheme', user?.theme);

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
      className={`min-h-screen ${theme.bgGradient}`}
    >
      {/* PROFILE HEADER */}
      <div className={`pt-8 pb-6 px-6 ${theme.headerGradient}`}>
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <div className={`w-28 h-28 rounded-full ${theme.iconBg} flex items-center justify-center shadow-xl`}>
              <i className={`ri-user-3-fill text-5xl ${theme.iconColor}`}></i>
            </div>
            <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-full ${theme.iconBg} flex items-center justify-center border-4 ${currentTheme === 'light' ? 'border-[#E5E1DA]' : 'border-[#2E3944]'}`}>
              <i className={`ri-check-fill ${theme.iconColor} text-sm`}></i>
            </div>
          </div>

          <h2 className={`font-['Merriweather'] text-[26px] font-bold ${theme.primaryText} mb-1`}>
            {user?.fullname?.firstname} {user?.fullname?.lastname}
          </h2>
          <p className={`font-['Source_Sans_Pro'] ${theme.secondaryText} text-center mb-4`}>
            {user?.email}
          </p>

          <div className="flex items-center gap-2">
            <i className={`ri-calendar-line ${theme.secondaryText}`}></i>
            <span className={`font-['Source_Sans_Pro'] ${theme.secondaryText} text-sm`}>
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
            className={`${theme.cardBg} backdrop-blur-sm rounded-2xl border ${theme.cardBorder} shadow-lg overflow-hidden`}
          >
            <div
              onClick={() => setEditProfilePanel(!editProfilePanel)}
              className="flex py-4 px-5 items-center justify-between cursor-pointer group"
            >
              <div className="flex gap-4 items-center">
                <div className={`w-12 h-12 rounded-full ${currentTheme === 'light' ? 'bg-gradient-to-r from-[#89A8B2] to-[#B3C8CF]' : 'bg-gradient-to-r from-[#124E66] to-[#212A31]'} flex items-center justify-center`}>
                  <i className={`ri-user-fill text-xl ${theme.iconColor}`}></i>
                </div>
                <div>
                  <h3 className={`font-['Merriweather'] font-bold text-[17px] ${theme.primaryText}`}>
                    Edit Profile
                  </h3>
                  <p className={`font-['Source_Sans_Pro'] ${theme.secondaryText} text-sm`}>
                    Update your personal information
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <i
                  className={`ri-arrow-right-s-line text-2xl ${theme.accentText} transition-transform duration-300 ${editProfilePanel ? 'rotate-90' : ''
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
                  className={`overflow-hidden border-t ${theme.cardBorder}`}
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
            className={`${theme.cardBg} backdrop-blur-sm rounded-2xl border ${theme.cardBorder} shadow-lg overflow-hidden`}
          >
            <div
              onClick={() => setNotificationPanel(!notificationPanel)}
              className="flex py-4 px-5 items-center justify-between cursor-pointer group"
            >
              <div className="flex gap-4 items-center">
                <div className={`w-12 h-12 rounded-full ${theme.iconBg} flex items-center justify-center`}>
                  <i className={`ri-notification-4-line text-xl ${theme.iconColor}`}></i>
                </div>
                <div>
                  <h3 className={`font-['Merriweather'] font-bold text-[17px] ${theme.primaryText}`}>
                    Notifications
                  </h3>
                  <p className={`font-['Source_Sans_Pro'] ${theme.secondaryText} text-sm`}>
                    Daily reminders and updates
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`font-['Source_Sans_Pro'] text-sm ${notification === 'on' ? theme.accentText : theme.secondaryText + '/60'}`}>
                  {notification === 'on' ? 'ON' : 'OFF'}
                </span>
                <i
                  className={`ri-arrow-right-s-line text-2xl ${theme.accentText} transition-transform duration-300 ${notificationPanel ? 'rotate-90' : ''
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
                  className={`overflow-hidden border-t ${theme.cardBorder}`}
                >
                  <div className="p-5">
                    <h4 className={`font-['Merriweather'] font-semibold ${theme.primaryText} mb-4`}>
                      Notification Settings
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => {
                          setNotification("on")
                          setNotificationPanel(false)
                        }}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300 ${notification === "on"
                          ? `${theme.activeBg} border-2 ${theme.activeBorder}`
                          : `${currentTheme === 'light' ? 'bg-white border border-[#E5E1DA]' : 'bg-[#212A31] border border-[#2E3944]'} ${theme.hoverBorder}`
                          }`}
                      >
                        <div className={`w-10 h-10 rounded-full mb-2 flex items-center justify-center ${notification === "on"
                          ? theme.iconBg
                          : currentTheme === 'light' ? 'bg-[#F1F0E8]' : 'bg-[#2E3944]'
                          }`}>
                          <i className={`ri-notification-4-line text-lg ${notification === "on" ? theme.iconColor : theme.accentText
                            }`}></i>
                        </div>
                        <span className={`font-['Source_Sans_Pro'] font-semibold ${theme.primaryText}`}>
                          On
                        </span>
                        <span className={`${theme.secondaryText} text-xs mt-1`}>Daily reminders</span>
                      </button>

                      <button
                        onClick={() => {
                          setNotification("off")
                          setNotificationPanel(false)
                        }}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300 ${notification === "off"
                          ? `${theme.activeBg} border-2 ${theme.warningGradient}`
                          : `${currentTheme === 'light' ? 'bg-white border border-[#E5E1DA]' : 'bg-[#212A31] border border-[#2E3944]'} ${theme.hoverBorder}`
                          }`}
                      >
                        <div className={`w-10 h-10 rounded-full mb-2 flex items-center justify-center ${notification === "off"
                          ? theme.warningGradient
                          : currentTheme === 'light' ? 'bg-[#F1F0E8]' : 'bg-[#2E3944]'
                          }`}>
                          <i className={`ri-notification-off-line text-lg ${notification === "off" ? "text-white" : theme.accentText
                            }`}></i>
                        </div>
                        <span className={`font-['Source_Sans_Pro'] font-semibold ${theme.primaryText}`}>
                          Off
                        </span>
                        <span className={`${theme.secondaryText} text-xs mt-1`}>Silent mode</span>
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
            className={`${theme.cardBg} backdrop-blur-sm rounded-2xl border ${theme.cardBorder} shadow-lg overflow-hidden`}
          >
            <div
              onClick={() => setThemePanel(!themePanel)}
              className="flex py-4 px-5 items-center justify-between cursor-pointer group"
            >
              <div className="flex gap-4 items-center">
                <div className={`w-12 h-12 rounded-full ${currentTheme === 'light' ? 'bg-gradient-to-r from-[#89A8B2] to-[#B3C8CF]' : 'bg-gradient-to-r from-[#124E66] to-[#2E3944]'} flex items-center justify-center`}>
                  <i className={`ri-contrast-2-line text-xl ${theme.iconColor}`}></i>
                </div>
                <div>
                  <h3 className={`font-['Merriweather'] font-bold text-[17px] ${theme.primaryText}`}>
                    Theme
                  </h3>
                  <p className={`font-['Source_Sans_Pro'] ${theme.secondaryText} text-sm`}>
                    Customize your experience
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`font-['Source_Sans_Pro'] text-sm ${theme.accentText} capitalize`}>
                  {currentTheme}
                </span>
                <i
                  className={`ri-arrow-right-s-line text-2xl ${theme.accentText} transition-transform duration-300 ${themePanel ? 'rotate-90' : ''
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
                  className={`overflow-hidden border-t ${theme.cardBorder}`}
                >
                  <div className="p-5">
                    <h4 className={`font-['Merriweather'] font-semibold ${theme.primaryText} mb-4`}>
                      Choose Theme
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => {
                          updateTheme("light");
                          setThemePanel(!themePanel)
                        }}
                        disabled={updatingTheme}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300 ${currentTheme === "light"
                          ? `${theme.activeBg} border-2 ${theme.activeBorder}`
                          : `${currentTheme === 'light' ? 'bg-white border border-[#E5E1DA]' : 'bg-[#212A31] border border-[#2E3944]'} ${theme.hoverBorder}`
                          } ${updatingTheme ? 'opacity-70 cursor-not-allowed' : ''}`}
                      >
                        <div className={`w-10 h-10 rounded-full mb-2 flex items-center justify-center ${currentTheme === "light"
                          ? currentTheme === 'light' ? 'bg-gradient-to-r from-[#F1F0E8] to-[#E5E1DA]' : 'bg-gradient-to-r from-[#D3D9D4] to-[#748D92]'
                          : currentTheme === 'light' ? 'bg-[#F1F0E8]' : 'bg-[#2E3944]'
                          }`}>
                          {updatingTheme ? (
                            <div className={`w-5 h-5 border-2 ${theme.spinnerBorder} rounded-full animate-spin`}></div>
                          ) : (
                            <i className={`ri-sun-line text-lg ${currentTheme === "light" ? currentTheme === 'light' ? 'text-[#89A8B2]' : 'text-[#212A31]' : theme.accentText
                              }`}></i>
                          )}
                        </div>
                        <span className={`font-['Source_Sans_Pro'] font-semibold ${theme.primaryText}`}>
                          Light
                        </span>
                        <span className={`${theme.secondaryText} text-xs mt-1`}>Bright theme</span>
                      </button>

                      <button
                        onClick={() => {
                          updateTheme("dark");
                          setThemePanel(!themePanel);
                        }}
                        disabled={updatingTheme}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300 ${currentTheme === "dark"
                          ? `${theme.activeBg} border-2 ${currentTheme === 'light' ? 'border-[#2E3944]' : 'border-[#124E66]'}`
                          : `${currentTheme === 'light' ? 'bg-white border border-[#E5E1DA]' : 'bg-[#212A31] border border-[#2E3944]'} ${theme.hoverBorder}`
                          } ${updatingTheme ? 'opacity-70 cursor-not-allowed' : ''}`}
                      >
                        <div className={`w-10 h-10 rounded-full mb-2 flex items-center justify-center ${currentTheme === "dark"
                          ? currentTheme === 'light' ? 'bg-gradient-to-r from-[#2E3944] to-[#124E66]' : 'bg-gradient-to-r from-[#124E66] to-[#212A31]'
                          : currentTheme === 'light' ? 'bg-[#F1F0E8]' : 'bg-[#2E3944]'
                          }`}>
                          {updatingTheme ? (
                            <div className={`w-5 h-5 border-2 ${theme.spinnerBorder} rounded-full animate-spin`}></div>
                          ) : (
                            <i className={`ri-moon-line text-lg ${currentTheme === "dark" ? currentTheme === 'light' ? 'text-white' : theme.iconColor : theme.accentText
                              }`}></i>
                          )}
                        </div>
                        <span className={`font-['Source_Sans_Pro'] font-semibold ${theme.primaryText}`}>
                          Dark
                        </span>
                        <span className={`${theme.secondaryText} text-xs mt-1`}>Default theme</span>
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
            className={`${theme.cardBg} backdrop-blur-sm rounded-2xl border ${theme.cardBorder} shadow-lg overflow-hidden`}
          >
            <div
              onClick={() => setResetDataPanel(!resetDataPanel)}
              className="flex py-4 px-5 items-center justify-between cursor-pointer group"
            >
              <div className="flex gap-4 items-center">
                <div className={`w-12 h-12 rounded-full ${theme.warningGradient} flex items-center justify-center`}>
                  <i className="ri-delete-bin-5-line text-xl text-white"></i>
                </div>
                <div>
                  <h3 className={`font-['Merriweather'] font-bold text-[17px] ${theme.primaryText}`}>
                    Data Management
                  </h3>
                  <p className={`font-['Source_Sans_Pro'] ${theme.secondaryText} text-sm`}>
                    Reset your habit data
                  </p>
                </div>
              </div>

              <i
                className={`ri-arrow-right-s-line text-2xl ${theme.accentText} transition-transform duration-300 ${resetDataPanel ? 'rotate-90' : ''
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
                  className={`overflow-hidden border-t ${theme.cardBorder}`}
                >
                  <div className="p-5">
                    <div className="flex flex-col items-center text-center mb-4">
                      <div className={`w-16 h-16 rounded-full ${theme.warningLight} flex items-center justify-center mb-3`}>
                        <i className="ri-error-warning-line text-2xl text-[#FF6B6B]"></i>
                      </div>
                      <h4 className={`font-['Merriweather'] font-semibold ${theme.primaryText} mb-2`}>
                        Reset All Habits
                      </h4>
                      <p className={`font-['Source_Sans_Pro'] ${theme.secondaryText} text-sm`}>
                        This will permanently delete all your habits and progress data. This action cannot be undone.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setResetDataPanel(false)
                      }}
                      className={`w-full py-3 ${theme.warningGradient} text-white font-['Source_Sans_Pro'] font-semibold rounded-xl hover:shadow-lg hover:shadow-[#FF6B6B]/20 transition-all active:scale-95`}
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
          className={`w-full py-4 ${theme.logoutBtn} font-['Source_Sans_Pro'] font-semibold rounded-xl hover:shadow-xl ${currentTheme === 'light' ? 'hover:shadow-[#89A8B2]/20' : 'hover:shadow-[#124E66]/20'} transition-all active:scale-95 flex items-center justify-center gap-3`}
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
            className={`fixed inset-0 ${currentTheme === 'light' ? 'bg-black/40' : 'bg-black/70'} flex items-center justify-center z-50 backdrop-blur-sm`}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`${theme.modalBg} rounded-2xl w-[90%] max-w-sm p-6 border ${theme.modalBorder} shadow-2xl`}
            >
              <div className="flex flex-col items-center text-center">
                <div className={`w-20 h-20 rounded-full ${theme.warningGradient} flex items-center justify-center mb-4`}>
                  <i className="ri-logout-box-r-line text-3xl text-white"></i>
                </div>

                <h3 className={`font-['Merriweather'] font-bold text-[22px] ${theme.primaryText} mb-2`}>
                  Logout Account
                </h3>

                <p className={`font-['Source_Sans_Pro'] ${theme.secondaryText} mb-6`}>
                  Are you sure you want to logout? You can always log back in at any time.
                </p>

                <div className="flex justify-between gap-4 w-full">
                  <button
                    onClick={() => setLogoutConfirmTost(false)}
                    className={`flex-1 px-5 py-3 rounded-xl ${theme.cancelBtn} font-['Source_Sans_Pro'] font-semibold hover:shadow-lg ${currentTheme === 'light' ? 'hover:shadow-[#B3C8CF]/20' : 'hover:shadow-[#212A31]/20'} active:scale-95 transition border ${theme.modalBorder}`}
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() => {
                      setLogoutConfirmTost(false)
                      UserLogout()
                    }}
                    className={`flex-1 px-5 py-3 rounded-xl ${theme.warningGradient} text-white font-['Source_Sans_Pro'] font-semibold hover:shadow-lg hover:shadow-[#FF6B6B]/20 active:scale-95 transition`}
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