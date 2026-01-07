import React from 'react'
import Navbar from '../components/Navbar'
import HabitAreaChatGraph from '../components/HabitAreaChatGraph'
import { useHabits } from '../context/HabitContext'


const Analytics = () => {
  
   useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
      }
    }, [navigate]);
  
  const { habits, setHabits } = useHabits()
  return (
    <div>
      <div>
        <HabitAreaChatGraph habits={habits} setHabits={setHabits} />
      </div>
      {/* NAVBAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <Navbar />
      </div>
    </div>
  )
}

export default Analytics
