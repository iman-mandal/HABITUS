import React, { useCallback, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar';
import ProgressRate from '../components/ProgressRate';
import Habits from '../components/Habits';
import axios from 'axios';

const Home = () => {

  const date = new Date();
  const formattedDate = date.toLocaleDateString('en-IN', {
    month: 'long',
    day: 'numeric',
  });
  const week = date.toLocaleDateString('en-IN', {
    weekday: 'long',
  })

  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);


  // Greeting based on time
  const hour = date.getHours();
  let greeting = 'Good Morning';

  if (hour >= 12 && hour < 17) {
    greeting = 'Good Afternoon';
  } else if (hour >= 17 && hour < 21) {
    greeting = 'Good Evening';
  } else if (hour >= 21 || hour < 4) {
    greeting = 'Good Night';
  }

  const [user, setUser] = useState(null);
  const FetchUser = useCallback(async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/user/profile`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
        }
      );

      if (response.status === 200) {
        setUser(response.data.user);
        console.log(response.data.user)
      }
    } catch (err) {
      console.error('Error fetching user:', err);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      FetchUser();
    }
  }, [FetchUser]);

  return (
    <div className='bg-[#f1f1ff]'>
      {/* greating */}
      <div className='flex px-5 w-screen flex-row pt-7 items-center justify-between'>
        <h2 className=' flex items-center justify-center font-sans text-2xl text-[#353535] font-semibold'>
          {greeting}, {user?.fullname?.firstname || 'User'}
        </h2>
        <div className='flex text-right flex-col items-center justify-center'>
          <p className='text-[14px] font-sans font-semibold'>{week},</p>
          <p className='text-[14px] font-sans font-semibold'>{formattedDate}</p>
        </div>
      </div>
      {/* progress */}
      <div className='mt-8'>
        <ProgressRate />
      </div>
      {/* habit lists mark */}
      <div className='mt-7'>
        <Habits />
      </div>
      <div>
        <Navbar />
      </div>
    </div>
  )
}

export default Home
