import React from 'react'
import { Link } from 'react-router-dom'
import AppLogo from '../Assets/HabitTrackerLogo.png'
const Start = () => {
    return (
        <div className="min-h-screen flex flex-col justify-between px-4 py-8">
            <div className='flex flex-col items-center justify-center'>
                <div className='flex ml-5 items-center justify-center'>
                    <img className='flex mt-5 h-[160px] w-[160px] items-center object-cover'
                        src={AppLogo} alt="app logo" />
                </div>
                <div className='flex flex-col items-center justify-center'>
                    <h2 className='text-[24px] text-[#111827] font-bold flex justify-center items-center '>
                        HABITUS
                    </h2>
                </div>
                <div className='flex justify-center items-center'>
                    <p className='text-[13px] flex font-semibold justify-center items-center'>
                        Track. Grow. Achieve
                    </p>
                </div>
            </div>
            <div className='flex flex-col gap-3'>
                <div className='flex items-center justify-center'>
                    <h2 className='flex text-[28px] font-semibold text-[#374151] items-center justify-center'>
                        Welcome to Habitus
                    </h2>
                </div>
                <div className='mx-5 flex items-center justify-center '>
                    <p className='flex items-center text-[14px] font-semibold text-gray-600 justify-center text-center'>Your daily companion for building positive
                        habits and achieving you goals.
                    </p>
                </div>
            </div>
            <div className='flex items-end justify-center mx-2'>
                <Link className='flex shadow-2xl items-center justify-center w-full font-medium bg-[#446dff] text-[#ffffff] py-3 rounded mt-5'
                    to='/login'>
                    Let's Start
                </Link>
            </div>
        </div>
    )
}

export default Start
