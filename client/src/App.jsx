import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Start from './Pages/Start'
import Home from './Pages/Home'
import Login from './Pages/Login'
import SignUp from './Pages/SignUp'
import Profile from './Pages/Profile'
import AddHabit from './Pages/AddHabit'
import Analytics from './Pages/Analytics'
import HabitList from './Pages/HabitList'
import { HabitProvider } from './context/HabitContext'
import { UserProvider } from './context/UserContext.jsx'
import HabitDetails from './Pages/HabitDetails.jsx'

const App = () => {
  return (

    <Routes>
      <Route path='/' element={<Start />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<SignUp />} />
      <Route path='/home' element={
        <UserProvider>
          <HabitProvider>
            <Home />
          </HabitProvider>
        </UserProvider>} />

      <Route path='/profile' element={
        <UserProvider>
          <Profile />
        </UserProvider>} />
      <Route path='/habit-details/:id' element={
        <HabitProvider>
          <HabitDetails />
        </HabitProvider>} />
      <Route path='/add-habit' element={
        <HabitProvider>
          <AddHabit />
        </HabitProvider>} />
      <Route path='/habit-analytics' element={
        <HabitProvider>
          <Analytics />
        </HabitProvider>} />

      <Route path='/habit-list' element={
        <HabitProvider>
          <HabitList />
        </HabitProvider>} />
    </Routes>

  )
}

export default App
