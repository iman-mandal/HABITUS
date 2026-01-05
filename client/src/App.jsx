import React from 'react'
import { Route, Routes } from 'react-router-dom';
import Start from './Pages/Start';
import Home from './Pages/Home'
import Login from './Pages/Login'
import SignUp from './Pages/SignUp'
import Profile from './Pages/Profile'
import AddHabit from './Pages/AddHabit'
import Analytics from './Pages/Analytics'
import CalendarView from './Pages/CalendarView'
import HabitList from './Pages/HabitList'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={ <Start />} />
        <Route path='/home' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/add-habit' element={<AddHabit />} />
        <Route path='/habit-analytics' element={<Analytics />} />
        <Route path='/habit-calendar' element={<CalendarView />} />
        <Route path='/habit-list' element={<HabitList />} />
      </Routes>
    </div>
  )
}

export default App
