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
import UpdateHabit from './Pages/UpdateHabit.jsx'

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
      <Route path='/habit/update/:id' element={
        <UserProvider>
          <HabitProvider>
            <UpdateHabit />
          </HabitProvider>
        </UserProvider>} />
      <Route path='/add-habit' element={
        <UserProvider>
          <HabitProvider>
            <AddHabit />
          </HabitProvider>
        </UserProvider>} />
      <Route path='/habit-analytics' element={
        <UserProvider>
          <HabitProvider>
            <Analytics />
          </HabitProvider>
        </UserProvider>} />

      <Route path='/habit-list' element={
        <HabitProvider>
          <HabitList />
        </HabitProvider>} />
    </Routes>

  )
}

export default App
