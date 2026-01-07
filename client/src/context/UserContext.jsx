// src/context/UserContext.jsx
import { createContext, useCallback, useEffect, useState, useContext } from 'react'
import axios from 'axios'

export const UserContext = createContext()

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used inside a UserProvider')
  }
  return context
}

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null) // user object
  const [loading, setLoading] = useState(true)

  // Function to fetch user from backend
  const fetchUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/user/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (response.status === 200) {
        setUser(response.data.user)
        console.log('User fetched:', response.data.user)
      }
    } catch (err) {
      console.error('Error fetching user:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch user when provider mounts
  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  return (
    <UserContext.Provider value={{ user, setUser, fetchUser, loading }}>
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider
