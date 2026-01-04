import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const Habits = () => {
  const [habits, setHabits] = useState([]);

  const FetchHabits = useCallback(async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/habit/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
        }
      );

      if (response.status === 200) {
        setHabits(response.data);
        console.log(response.data)
      }
    } catch (err) {
      console.error('Error fetching habits:', err);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      FetchHabits();
    }
  }, [FetchHabits]);

  return (
    <div>
      {habits.length === 0 ? (
        <p>No habits found</p>
      ) : (
        habits.map((habit) => (
          <div
            key={habit._id}
            className="flex items-center my-2 mx-3 justify-between px-4 py-3 bg-gray-200 rounded-lg"
          >
            <div>
              <h2 className="font-semibold">{habit.title}</h2>
              <p className="text-sm">Streak: {habit.streak}</p>
            </div>

            <input className='w-5 h-5' type="checkbox" />
          </div>
        ))
      )}
    </div>
  );
};

export default Habits;
