import React, { useState, useCallback, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import 'remixicon/fonts/remixicon.css'
import axios from 'axios'
import { useUser } from '../context/UserContext.jsx'

const Profile = () => {

  const {user, setUser} = useUser();
  const navigate = useNavigate();



  const UserLogout = useCallback(async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/logout`,
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
    const token = localStorage.getItem('token');
    if (!token || token=='') {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className='bg-blue-50 h-screen'>
      <div>
        <div className='flex flex-col pt-5 font-serif items-center justify-center'>
          <h2 className='text-center text-[24px] font-semibold'>Profile & Settings</h2>
          <i className="ri-account-circle-line -mt-5 text-[130px]"></i>
          <div className='flex flex-col -mt-9'>
            <h2 className='text-center font-semibold font-serif text-[18px]'>{user?.fullname?.firstname} {user?.fullname?.lastname} </h2>
            <h5 className='text-[15px] font-serif font-medium'>{user?.email}</h5>
          </div>
        </div>

        <div className='flex flex-col mt-4 gap-3 mx-3'>
          <div className='flex flex-row py-2.5 px-3 bg-[white] rounded-lg items-center justify-between shadow-xl'>
            <div className='flex flex-row gap-4 items-center'>
              <i className="ri-user-fill text-[22px] text-[#8b8b8b]"></i>
              <h3 className='text-[16px] font-semibold font-serif'>Edit Profile</h3>
            </div>
            <i className="ri-arrow-right-s-line font-semibold text-[22px] text-[black]"></i>
          </div>
          <div className='flex flex-row py-2.5 px-3 bg-[white] rounded-lg items-center justify-between  shadow-xl'>
            <div className='flex flex-row gap-4 items-center'>
              <i className="ri-notification-4-line text-[22px] text-[#8b8b8b]"></i>
              <h3 className='text-[16px] font-semibold font-serif'>Notification Settings</h3>
            </div>
            <i className="ri-arrow-right-s-line font-semibold text-[22px] text-[black]"></i>
          </div>
          <div className='flex flex-row py-2.5 px-3 bg-[white] rounded-lg items-center justify-between  shadow-xl'>
            <div className='flex flex-row gap-4 items-center'>
              <i className="ri-contrast-2-line text-[22px] text-[#8b8b8b]"></i>
              <h3 className='text-[16px] font-semibold font-serif'>Theme</h3>
            </div>
            <i className="ri-arrow-right-s-line font-semibold text-[22px] text-[black]"></i>
          </div>
          <div className='flex flex-row py-2.5 px-3 bg-[white] rounded-lg items-center justify-between  shadow-xl'>
            <div className='flex flex-row gap-4 items-center'>
              <i className="ri-error-warning-line text-[22px] text-[#8b8b8b]"></i>
              <h3 className='text-[16px] font-semibold font-serif'>Data Reset</h3>
            </div>
            <i className="ri-arrow-right-s-line font-semibold text-[22px] text-[black]"></i>
          </div>
        </div>
        <div className='w-full mt-6 flex items-center justify-center'>
          <button
            onClick={UserLogout}
            className="w-screen mx-4 bg-black text-white py-3 rounded-lg font-semibold">Logout</button>
        </div>
      </div>
      <div>
        <Navbar />
      </div>
    </div>
  )
}

export default Profile
