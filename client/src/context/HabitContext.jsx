import { createContext, useCallback, useEffect, useState, useContext } from 'react'
import axios from 'axios'

const HabitContext = createContext()

export const HabitProvider = ({ children }) => {
  const [habits, setHabits] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchHabits = useCallback(async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/habit`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      setHabits(res.data)
      console.log(res.data)
    } catch (err) {
      console.error('Failed to fetch habits', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchHabits()
  }, [fetchHabits])

  return (
    <HabitContext.Provider
      value={{
        habits,
        setHabits,
        fetchHabits,
        loading,
      }}
    >
      {children}
    </HabitContext.Provider>
  )
}

export const useHabits = () => {
  const context = useContext(HabitContext)
  if (!context) {
    throw new Error('useHabits must be used inside HabitProvider')
  }
  return context
}

export default HabitContext
