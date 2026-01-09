import React from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const Habits = ({ habits, setHabits }) => {

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

  // Incomplete first, completed last
  const sortedHabits = [...habits].sort((a, b) => {
    const aDone = a.history?.find(h => h.date === today)?.completed ? 1 : 0;
    const bDone = b.history?.find(h => h.date === today)?.completed ? 1 : 0;
    return aDone - bDone;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-blue-50"
    >
      <div className="bg-blue-50">

        {sortedHabits.length === 0 ? (
          <p className="text-center mt-4 font-serif">No habits found</p>
        ) : (
          <AnimatePresence>
            {sortedHabits.map((habit) => {
              const todayHistory = habit.history?.find(
                (h) => h.date === today
              );

              return (
                <motion.div
                  key={habit._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className={`flex items-center my-2 mx-3 justify-between px-4 py-3 bg-white rounded-lg shadow
                  ${todayHistory?.completed ? "opacity-60" : ""}
                `}
                >
                  <div>
                    <h2
                      className={`font-semibold font-serif ${todayHistory?.completed ? "line-through" : ""
                        }`}
                    >
                      {habit.title}
                    </h2>
                    <p className="text-sm font-thin">
                      Streak: {habit.streak}
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    className="w-5 h-5 cursor-pointer"
                    checked={todayHistory?.completed || false}
                    onChange={() => ToggleHabit(habit._id)}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
};

export default Habits;
