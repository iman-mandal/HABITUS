import React from 'react';
import axios from 'axios';

const Habits = ({habits, setHabits}) => {


  // Toggle habit completion
  const ToggleHabit = async (habitId) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/habit/${habitId}/toggle`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.status === 200) {
        setHabits((prev) =>
          prev.map((habit) =>
            habit._id === habitId ? response.data : habit
          )
        );
      }
    } catch (err) {
      console.error('Toggle failed:', err);
    }
  };

   const today = new Date().toISOString().split('T')[0];
  return (
    <div>
      {habits.length === 0 ? (
        <p className="text-center mt-4">No habits found</p>
      ) : (
        habits.map((habit) => {
          const todayHistory = habit.history?.find(
            (h) => h.date === today
          );

          return (
            <div
              key={habit._id}
              className="flex items-center my-2 mx-3 justify-between px-4 py-3 bg-gray-200 rounded-lg"
            >
              <div>
                <h2 className="font-semibold">{habit.title}</h2>
                <p className="text-sm">Streak: {habit.streak}</p>
              </div>

              <input
                type="checkbox"
                className="w-5 h-5"
                checked={todayHistory?.completed || false}
                onChange={() => ToggleHabit(habit._id)}
              />
            </div>
          );
        })
      )}
    </div>
  );
};

export default Habits;
