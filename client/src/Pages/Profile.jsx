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

  // Get current theme from user or default to 'dark'
  const storedTheme = localStorage.getItem('userTheme');
  const currentTheme = storedTheme === 'dark' ? 'dark' : 'light';
  const themeClass = currentTheme === 'light' ? 'light-theme' : 'dark-theme';

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

  // Store theme in localStorage
  localStorage.setItem('userTheme', user?.theme);

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
    }
  }, [navigate])

  // Format date for display
  const formatMemberSince = (date) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  // Get status class
  const getStatusClass = (value, currentValue) => {
    return value === currentValue ? 'selected' : '';
  };

  // Get theme option class
  const getThemeOptionClass = (themeValue) => {
    const baseClass = `profile-theme-option ${themeClass}`;
    return currentTheme === themeValue ? `${baseClass} selected` : baseClass;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`profile-container ${themeClass}`}
    >
      {/* PROFILE HEADER */}
      <div className={`profile-header ${themeClass}`}>
        <div className="profile-header-content">
          <div className="profile-avatar-container">
            <div className={`profile-avatar ${themeClass}`}>
              <i className="ri-user-3-fill"></i>
            </div>
            <div className={`profile-avatar-badge ${themeClass}`}>
              <i className="ri-check-fill"></i>
            </div>
          </div>

          <h2 className={`profile-name ${themeClass} profile-mb-1`}>
            {user?.fullname?.firstname} {user?.fullname?.lastname}
          </h2>
          <p className={`profile-email ${themeClass} profile-mb-4`}>
            {user?.email}
          </p>

          <div className="profile-member-since">
            <i className="ri-calendar-line"></i>
            <span>
              Member since {formatMemberSince(user?.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* SETTINGS LIST */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="profile-settings"
      >
        <div className="profile-settings-grid">

          {/* EDIT PROFILE */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`profile-setting-card profile-setting-edit ${themeClass}`}
          >
            <div
              onClick={() => setEditProfilePanel(!editProfilePanel)}
              className="profile-setting-header profile-cursor-pointer"
            >
              <div className="profile-setting-left">
                <div className={`profile-setting-icon ${themeClass}`}>
                  <i className="ri-user-fill"></i>
                </div>
                <div className="profile-setting-info">
                  <h3 className={themeClass}>
                    Edit Profile
                  </h3>
                  <p className={themeClass}>
                    Update your personal information
                  </p>
                </div>
              </div>

              <div className="profile-setting-right">
                <i
                  className={`profile-setting-arrow ri-arrow-right-s-line ${themeClass} ${editProfilePanel ? 'open' : ''}`}
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
                  className={`profile-setting-panel ${themeClass}`}
                >
                  <EditProfile
                    user={user}
                    setUser={setUser}
                    setEditProfilePanel={setEditProfilePanel}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* NOTIFICATION */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`profile-setting-card profile-setting-notification ${themeClass}`}
          >
            <div
              onClick={() => setNotificationPanel(!notificationPanel)}
              className="profile-setting-header profile-cursor-pointer"
            >
              <div className="profile-setting-left">
                <div className={`profile-setting-icon ${themeClass}`}>
                  <i className="ri-notification-4-line"></i>
                </div>
                <div className="profile-setting-info">
                  <h3 className={themeClass}>
                    Notifications
                  </h3>
                  <p className={themeClass}>
                    Daily reminders and updates
                  </p>
                </div>
              </div>

              <div className="profile-setting-right">
                <span className={`profile-setting-status ${notification === 'on' ? 'on' : 'off'} ${themeClass}`}>
                  {notification === 'on' ? 'ON' : 'OFF'}
                </span>
                <i
                  className={`profile-setting-arrow ri-arrow-right-s-line ${themeClass} ${notificationPanel ? 'open' : ''}`}
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
                  className={`profile-setting-panel ${themeClass}`}
                >
                  <div className="profile-panel-content">
                    <h4 className={`profile-notification-title ${themeClass} profile-mb-4`}>
                      Notification Settings
                    </h4>
                    <div className="profile-notification-grid">
                      <button
                        onClick={() => {
                          setNotification("on")
                          setNotificationPanel(false)
                        }}
                        className={`profile-notification-option ${themeClass} ${getStatusClass("on", notification)}`}
                      >
                        <div className={`profile-notification-icon ${themeClass}`}>
                          <i className="ri-notification-4-line"></i>
                        </div>
                        <span className={`profile-notification-label ${themeClass}`}>
                          On
                        </span>
                        <span className={`profile-notification-desc ${themeClass}`}>
                          Daily reminders
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          setNotification("off")
                          setNotificationPanel(false)
                        }}
                        className={`profile-notification-option ${themeClass} ${getStatusClass("off", notification)} warning`}
                      >
                        <div className={`profile-notification-icon ${themeClass}`}>
                          <i className="ri-notification-off-line"></i>
                        </div>
                        <span className={`profile-notification-label ${themeClass}`}>
                          Off
                        </span>
                        <span className={`profile-notification-desc ${themeClass}`}>
                          Silent mode
                        </span>
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
            className={`profile-setting-card profile-setting-theme ${themeClass}`}
          >
            <div
              onClick={() => setThemePanel(!themePanel)}
              className="profile-setting-header profile-cursor-pointer"
            >
              <div className="profile-setting-left">
                <div className={`profile-setting-icon ${themeClass}`}>
                  <i className="ri-contrast-2-line"></i>
                </div>
                <div className="profile-setting-info">
                  <h3 className={themeClass}>
                    Theme
                  </h3>
                  <p className={themeClass}>
                    Customize your experience
                  </p>
                </div>
              </div>

              <div className="profile-setting-right">
                <span className={`profile-setting-status ${themeClass} profile-capitalize`}>
                  {currentTheme}
                </span>
                <i
                  className={`profile-setting-arrow ri-arrow-right-s-line ${themeClass} ${themePanel ? 'open' : ''}`}
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
                  className={`profile-setting-panel ${themeClass}`}
                >
                  <div className="profile-panel-content">
                    <h4 className={`profile-theme-title ${themeClass} profile-mb-4`}>
                      Choose Theme
                    </h4>
                    <div className="profile-theme-grid">
                      <button
                        onClick={() => {
                          updateTheme("light");
                          setThemePanel(false)
                        }}
                        disabled={updatingTheme}
                        className={getThemeOptionClass("light")}
                      >
                        <div className={`profile-theme-icon ${themeClass}`}>
                          {updatingTheme ? (
                            <div className={`profile-theme-spinner ${themeClass}`}></div>
                          ) : (
                            <i className="ri-sun-line"></i>
                          )}
                        </div>
                        <span className={`profile-theme-label ${themeClass}`}>
                          Light
                        </span>
                        <span className={`profile-theme-desc ${themeClass}`}>
                          Bright theme
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          updateTheme("dark");
                          setThemePanel(false);
                        }}
                        disabled={updatingTheme}
                        className={`${getThemeOptionClass("dark")} dark-border`}
                      >
                        <div className={`profile-theme-icon ${themeClass}`}>
                          {updatingTheme ? (
                            <div className={`profile-theme-spinner ${themeClass}`}></div>
                          ) : (
                            <i className="ri-moon-line"></i>
                          )}
                        </div>
                        <span className={`profile-theme-label ${themeClass}`}>
                          Dark
                        </span>
                        <span className={`profile-theme-desc ${themeClass}`}>
                          Default theme
                        </span>
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
            className={`profile-setting-card profile-setting-reset ${themeClass}`}
          >
            <div
              onClick={() => setResetDataPanel(!resetDataPanel)}
              className="profile-setting-header profile-cursor-pointer"
            >
              <div className="profile-setting-left">
                <div className={`profile-setting-icon ${themeClass}`}>
                  <i className="ri-delete-bin-5-line"></i>
                </div>
                <div className="profile-setting-info">
                  <h3 className={themeClass}>
                    Data Management
                  </h3>
                  <p className={themeClass}>
                    Reset your habit data
                  </p>
                </div>
              </div>

              <i
                className={`profile-setting-arrow ri-arrow-right-s-line ${themeClass} ${resetDataPanel ? 'open' : ''}`}
              ></i>
            </div>

            <AnimatePresence>
              {resetDataPanel && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`profile-setting-panel ${themeClass}`}
                >
                  <div className="profile-panel-content">
                    <div className="profile-reset-content profile-mb-4">
                      <div className={`profile-reset-icon ${themeClass}`}>
                        <i className="ri-error-warning-line"></i>
                      </div>
                      <h4 className={`profile-reset-title ${themeClass} profile-mb-2`}>
                        Reset All Habits
                      </h4>
                      <p className={`profile-reset-desc ${themeClass}`}>
                        This will permanently delete all your habits and progress data. This action cannot be undone.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setResetDataPanel(false)
                      }}
                      className={`profile-reset-btn ${themeClass}`}
                    >
                      <i className="ri-delete-bin-5-line"></i>
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
      <div className="profile-logout-section">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setLogoutConfirmTost(true)}
          className={`profile-logout-btn ${themeClass}`}
        >
          <i className="ri-logout-box-r-line"></i>
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
            className={`profile-modal-overlay ${themeClass}`}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`profile-modal ${themeClass}`}
            >
              <div className="profile-modal-content">
                <div className={`profile-modal-icon ${themeClass}`}>
                  <i className="ri-logout-box-r-line"></i>
                </div>

                <h3 className={`profile-modal-title ${themeClass} profile-mb-2`}>
                  Logout Account
                </h3>

                <p className={`profile-modal-text ${themeClass} profile-mb-6`}>
                  Are you sure you want to logout? You can always log back in at any time.
                </p>

                <div className="profile-modal-buttons">
                  <button
                    onClick={() => setLogoutConfirmTost(false)}
                    className={`profile-modal-btn profile-modal-cancel ${themeClass}`}
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() => {
                      setLogoutConfirmTost(false)
                      UserLogout()
                    }}
                    className="profile-modal-btn profile-modal-logout"
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
      <div className="profile-navbar">
        <Navbar />
      </div>
    </motion.div>
  )
}

export default Profile