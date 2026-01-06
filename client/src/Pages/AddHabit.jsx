import React, { useState, useEffect } from 'react'
import AppLogo from '../Assets/HabitTrackerLogo.png'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddHabit = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState('')
  const [targetPerWeek, setTargetPerWeek] = useState(7);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const newHabit = {
        title,
        description,
        frequency,
        targetPerWeek
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/habit/createHabit`,
        newHabit,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (response.status === 201) {
        navigate(-1);
      }


      setTitle('')
      setDescription('')
      setFrequency('')
      setTargetPerWeek(7)

      if (!frequency) {
        alert('Please select a frequency.')
        return
      }
    } catch (err) {
      console.error('Error creating habit:', err);
    }
  };

  return (
    <div className='flex flex-col'>
      <div className="relative flex mt-6 items-center justify-center">
        <i
          onClick={() => navigate(-1)}
          className="ri-arrow-left-wide-line absolute left-5 text-[25px] font-thin cursor-pointer active:scale-95 transition"></i>
        <h2 className="text-[20px] font-semibold font-serif">
          Add Habit
        </h2>
      </div>

      <div className="flex shadow-xl py-3 mx-5 rounded-lg bg-[#e4e4e4] flex-row mt-4 justify-center gap-0">
        <img className="h-[60px]" src={AppLogo} alt="app logo" />
        <div className="flex flex-col font-serif justify-center mt-2 -ml-4 items-start">
          <h2 className="text-[22px] font-bold">HABITUS</h2>
          <p className="text-[12px] text-gray-500 font-semibold">
            Consistency made simple.
          </p>
        </div>
      </div>
      <div className="mt-5 mx-5 bg-white shadow-2xl rounded-xl py-8 px-6">
        <form
          onSubmit={(e) => {
            submitHandler(e)
          }}
          className="flex flex-col gap-3">
          <div className="gap-3 flex flex-col items-center justify-center">
            <input
              className="w-full text-[16px] font-semibold font-serif outline-none flex items-center border border-gray-300 rounded-lg px-3 py-2"
              type="text"
              required
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
              }}
              placeholder="Enter Habit Title"
            />
            <input
              className="w-full  text-[16px] font-semibold font-serif h-[80px] resize-none outline-none border border-gray-300 rounded-lg px-3 py-2 text-sm placeholder-gray-400 overflow-hidden"
              type="text"
              required
              value={description}
              onChange={(e) => {
                setDescription(e.target.value)
              }}
              placeholder="Description"
            />
          </div>

          <div className="flex flex-col gap-2 mt-2 rounded-lg border-[2px] border-gray-200 px-3 py-2">
            <label className="font-semibold text-[18px] font-serif text-gray-700">
              Select Frequency
            </label>
            <div className="flex gap-4">
              {['daily', 'weekly', 'monthly'].map((freq) => (
                <label key={freq} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="frequency"
                    value={freq}
                    className="accent-black w-[15px] h-[15px]"
                    checked={frequency === freq}
                    onChange={(e) => setFrequency(e.target.value)}
                  />
                  <span className="text-[15px] font-serif font-semibold">
                    {freq.charAt(0).toUpperCase() + freq.slice(1)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-3 rounded-lg mt-3 border-[2px] border-gray-200 justify-between">
            <label className="font-serif font-semibold text-[17px] text-gray-700 ">Target per week :</label>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              {/* Decrease button */}
              <button
                type="button"
                onClick={() =>
                  setTargetPerWeek((prev) => Math.max(1, prev - 1))
                }
                className="px-2 py-1  text-lg font-bold"
              >
                -
              </button>

              {/* Display number */}
              <input
                type="number"
                value={targetPerWeek}
                readOnly
                className="w-10 font-semibold font-serif text-center outline-none bg-white"
              />

              {/* Increase button */}
              <button
                type="button"
                onClick={() =>
                  setTargetPerWeek((prev) => Math.min(7, prev + 1))
                }
                className="px-2 py-1 text-lg font-bold"
              >
                +
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={!frequency}
            className={`py-3 rounded-lg mt-4 font-semibold transition ${frequency
              ? 'bg-black text-white hover:bg-gray-900'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
          >
            Save Habit
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddHabit
