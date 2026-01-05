import React, { useState, useContext } from 'react'
import AppLogo from '../Assets/HabitTrackerLogo.png'
import 'remixicon/fonts/remixicon.css'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();



  const submitHandler = async (e) => {
    e.preventDefault();
    const newUser = {
      email: email,
      password: password
    };
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/login`, newUser);
    if (response.status === 200) {
      const data = response.data;
      setUser(data.user);
      localStorage.setItem('token', data.token);
      navigate('/home');
    }


    setEmail('');
    setPassword('');
  };


  return (
    <div className='flex flex-col'>
      <div className="flex flex-row mt-12 justify-center gap-0">
        <img className="h-[60px]" src={AppLogo} alt="app logo" />
        <div className="flex flex-col justify-center mt-2 -ml-4 items-start">
          <h2 className="text-[22px] font-bold">HABITUS</h2>
          <p className="text-[12px] text-gray-500 font-semibold">
            Consistency made simple.
          </p>
        </div>
      </div>

      <div className="mt-10 mx-5 bg-white shadow-2xl rounded-xl py-12 px-6">
        <h2 className="font-serif font-semibold text-center text-[26px] mb-6">
          Login
        </h2>
        <form
          onSubmit={(e) => {
            submitHandler(e)
          }}
          className="flex flex-col gap-4">
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 gap-3">
            <i className="ri-mail-line text-gray-500"></i>
            <input
              className="w-full outline-none"
              type="email"
              required
              value={email}
              onChange={(e) => { setEmail(e.target.value) }}
              placeholder="Enter your Email"
            />
          </div>
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 gap-3">
            <i className="ri-lock-line text-gray-500"></i>
            <input
              className="w-full outline-none"
              type="password"
              required
              value={password}
              onChange={(e) => { setPassword(e.target.value) }}
              placeholder="Enter your Password"
            />
            <i className="ri-eye-off-line text-gray-400 cursor-pointer"></i>
          </div>
          <button className="bg-black text-white py-3 rounded-lg font-semibold mt-3">
            Login
          </button>
        </form>
      </div>

      <div className='flex justify-center items-center mt-6'>
        <p className='text-center'>You don't have an Account?
          <Link
            className='text-[#2727fa]'
            to='/signup'> signup</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
