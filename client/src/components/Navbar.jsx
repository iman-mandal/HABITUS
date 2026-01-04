import React from 'react'
import { Link } from 'react-router-dom'
import 'remixicon/fonts/remixicon.css'

const Navbar = () => {
  return (
    <div className='fixed w-full bg-white bottom-0 flex items-center justify-evenly py-2 shadow-[0_-4px_8px_rgba(0,0,0,0.12)]'>
      <Link className='flex flex-col items-center justify-center' to='/home'>
      <i className="ri-home-8-line text-2xl"></i>
      <h4 className='text-center font-semibold font-serif text-[11px]'>Home</h4>
      </Link>
      <Link className='flex flex-col items-center justify-center' to='/habit-analytics'>
      <i className="ri-line-chart-line text-2xl"></i>
      <h4 className='text-center font-semibold font-serif text-[11px]'>Analytics</h4>
      </Link>
      <Link className='flex flex-col items-center justify-center' to='/habit-calendar'>
      <i className="ri-calendar-check-line text-2xl"></i>
      <h4 className='text-center font-semibold font-serif text-[11px]'>Calendar</h4>
      </Link>
      <Link className='flex flex-col items-center justify-center' to='/profile'>
      <i className="ri-account-circle-line text-2xl"></i>
      <h4 className='text-center font-semibold font-serif text-[11px]'>Profile</h4>
      </Link>
    </div>
  )
}

export default Navbar
