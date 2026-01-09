import React, { useState, useContext } from 'react'
import AppLogo from '../Assets/HabitTrackerLogo.png'
import 'remixicon/fonts/remixicon.css'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { useUser } from '../context/UserContext'
import { motion } from 'framer-motion';



const SignUp = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('')
  const { setUser } = useUser()

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    const newUser = {
      fullname: {
        firstname: firstName,
        lastname: lastName
      },
      email: email,
      password: password
    };
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/register`, newUser);
    if (response.status === 201) {
      const data = response.data;
      setUser(data.user);
      localStorage.setItem('token', data.token);
      navigate('/home');
    }


    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className='flex flex-col bg-blue-50 h-screen'>
      <div className="flex flex-row mt-8 justify-center gap-0">
        <img className="h-[60px]" src={AppLogo} alt="app logo" />
        <div className="flex flex-col justify-center mt-2 -ml-4 items-start">
          <h2 className="text-[22px] font-bold">HABITUS</h2>
          <p className="text-[12px] text-gray-500 font-semibold">
            Consistency made simple.
          </p>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-blue-50"
      >
        <div className="mt-5 mx-5 bg-white shadow-2xl rounded-xl py-8 px-6">
          <h2 className="font-serif font-semibold text-center text-[26px] mb-3">
            Sign Up
          </h2>
          <form
            onSubmit={(e) => {
              submitHandler(e)
            }}
            className="flex flex-col gap-3">
            <div className="gap-3 flex flex-col items-center justify-center">
              <input
                className="w-full outline-none flex items-center border border-gray-300 rounded-lg px-3 py-2"
                type="text"
                required
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value)
                }}
                placeholder="Enter your first name"
              />
              <input
                className="w-full outline-none flex items-center border border-gray-300 rounded-lg px-3 py-2"
                type="text"
                required
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value)
                }}
                placeholder="Enter your last name"
              />
            </div>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 gap-3">
              <i className="ri-mail-line text-gray-500"></i>
              <input
                className="w-full outline-none"
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                }}
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
                onChange={(e) => {
                  setPassword(e.target.value)
                }}
                placeholder="Enter your Password"
              />
            </div>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 gap-3">
              <i className="ri-lock-line text-gray-500"></i>
              <input
                className="w-full outline-none"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your Password"
              />
            </div>
            <button
              type="submit"
              className={`py-3 rounded-lg font-semibold mt-2 ${password !== confirmPassword
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-black text-white'
                }`}
              disabled={password !== confirmPassword}>
              Create Account
            </button>
          </form>
        </div>
      </motion.div>
      <div className='flex justify-center items-center mt-6'>
        <p className='text-center'>Already have an Account?
          <Link
            className='text-[#2727fa]'
            to='/login'> login</Link>
        </p>
      </div>
    </div>
  )
}

export default SignUp
