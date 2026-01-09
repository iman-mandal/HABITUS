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

  const [editProfilePanel, setEditProfilePanel] = useState(false)

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-blue-50"
    >
      {/* PROFILE HEADER */}
      <div className="flex flex-col pt-5 font-serif items-center justify-center">
        <h2 className="text-center text-[24px] font-semibold">
          Profile & Settings
        </h2>
        <i className="ri-account-circle-line -mt-5 text-[130px]"></i>

        <div className="flex flex-col -mt-9">
          <h2 className="text-center font-semibold text-[18px]">
            {user?.fullname?.firstname} {user?.fullname?.lastname}
          </h2>
          <h5 className="text-[15px] font-medium text-center">
            {user?.email}
          </h5>
        </div>
      </div>

      {/* SETTINGS LIST */}
      <div className="flex flex-col mt-4 gap-3 mx-3">

        {/* EDIT PROFILE */}
        <div className="bg-white rounded-lg shadow-xl">
          <div
            onClick={() => setEditProfilePanel(!editProfilePanel)}
            className="flex py-2.5 px-3 items-center justify-between cursor-pointer"
          >
            <div className="flex gap-4 items-center">
              <i className="ri-user-fill text-[22px] text-gray-400"></i>
              <h3 className="text-[16px] font-semibold font-serif">
                Edit Profile
              </h3>
            </div>

            <i
              className={`ri-arrow-right-s-line text-[22px] transition-transform duration-300 ${editProfilePanel ? 'rotate-90' : ''
                }`}
            ></i>
          </div>

          {/* ANIMATED PANEL */}
          <AnimatePresence>
            {editProfilePanel && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <EditProfile user={user} setUser={setUser} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* NOTIFICATION */}
        <motion.div
          whileTap={{ scale: 0.95 }}
          className="flex py-2.5 px-3 bg-white rounded-lg items-center justify-between shadow-xl"
        >
          <div className="flex gap-4 items-center">
            <i className="ri-notification-4-line text-[22px] text-gray-400"></i>
            <h3 className="text-[16px] font-semibold font-serif">
              Notification Settings
            </h3>
          </div>
          <i className="ri-arrow-right-s-line text-[22px]"></i>
        </motion.div>

        {/* THEME */}
        <motion.div
          whileTap={{ scale: 0.95 }}
          className="flex py-2.5 px-3 bg-white rounded-lg items-center justify-between shadow-xl"
        >
          <div className="flex gap-4 items-center">
            <i className="ri-contrast-2-line text-[22px] text-gray-400"></i>
            <h3 className="text-[16px] font-semibold font-serif">Theme</h3>
          </div>
          <i className="ri-arrow-right-s-line text-[22px]"></i>
        </motion.div>

        {/* DATA RESET */}
        <motion.div
          whileTap={{ scale: 0.95 }}
          className="flex py-2.5 px-3 bg-white rounded-lg items-center justify-between shadow-xl"
        >
          <div className="flex gap-4 items-center">
            <i className="ri-error-warning-line text-[22px] text-gray-400"></i>
            <h3 className="text-[16px] font-semibold font-serif">
              Data Reset
            </h3>
          </div>
          <i className="ri-arrow-right-s-line text-[22px]"></i>
        </motion.div>
      </div>

      {/* LOGOUT */}
      <div className="w-full mt-6 flex items-center justify-center">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={UserLogout}
          className="w-screen mx-4 bg-black text-white py-3 rounded-lg font-semibold"
        >
          Logout
        </motion.button>
      </div>

      <Navbar />
    </motion.div>
  )
}

export default Profile
