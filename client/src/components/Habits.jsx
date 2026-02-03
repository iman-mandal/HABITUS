import React, { useEffect } from 'react';
import axios from 'axios';

import { motion, AnimatePresence } from 'framer-motion';

const Habits = ({ habits, setHabits, setMaxHabit, setMinHabit }) => {

  const days = ["S", "M", "T", "W", "T", "F", "S"];

  // start of current week (Sunday)
  const getStartOfWeek = () => {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday
    const start = new Date(now);
    start.setDate(now.getDate() - day);
    return start;
  };

  // dates of current week
  const getWeekDates = () => {
    const start = getStartOfWeek();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d.toISOString().split("T")[0];
    });
  };

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

  const getHabitPercentage = (habit) => {
    const total = habit.history?.length || 0;
    const completed =
      habit.history?.filter((h) => h.completed).length || 0;

    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  const getMinMaxHabitPercentage = (habits = []) => {
    let maxHabit = null;
    let minHabit = null;

    habits.forEach((habit) => {
      const history = habit?.history || [];
      if (history.length === 0) return;

      const completed = history.filter(h => h.completed).length;
      const percentage = Math.round((completed / history.length) * 100);

      // MAX
      if (
        maxHabit === null ||
        percentage > maxHabit.percentage
      ) {
        maxHabit = {
          name: habit.title,
          percentage,
        };
      }

      // MIN
      if (
        minHabit === null ||
        percentage < minHabit.percentage
      ) {
        minHabit = {
          name: habit.title,
          percentage,
        };
      }
    });

    return { maxHabit, minHabit };
  };


  useEffect(() => {
    const result = getMinMaxHabitPercentage(habits);
    setMaxHabit(result.maxHabit);
    setMinHabit(result.minHabit);
  }, [habits]);


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-blue-50"
    >
      <div className="bg-gradient-to-b from-[#FAFAFC] to-[#F1F5FF]">

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
                  className={`flex items-center my-2 mx-3 justify-between px-4 py-3 
                  bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-[#cdf0ea] via-[#f9f9f9] to-[#f6c6ea] rounded-lg shadow
                  ${todayHistory?.completed ? "opacity-60" : ""}
                `}
                >
                  <div className='w-[120px]'>
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
                  {/* Progress bar */}
                  <div className=" w-[320px] h-3 flex flex-row bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${getHabitPercentage(habit)}%` }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                      className="h-full bg-[conic-gradient(at_bottom_right,_var(--tw-gradient-stops))] from-[#ebfffb] via-[#7efaff] to-[#13abc4] rounded-full"
                    />
                  </div>
                  <p className="text-[18px] font-serif font-semibold text-gray-700">
                    {getHabitPercentage(habit)}%
                  </p>
                  <input
                    type="checkbox"
                    className="w-5 h-5 cursor-pointer"
                    checked={todayHistory?.completed || false}
                    onChange={() => ToggleHabit(habit._id)}
                  />
                  <div className="flex w-[300px] border-l-2 border-[#838282] flex-row justify-evenly mt-2">
                    {getWeekDates().map((date, index) => {
                      const done = habit.history?.some(
                        (h) => h.date === date && h.completed
                      );
                      return (
                        <div
                          key={index}
                          className="flex flex-col items-center"
                        >
                          <span className="text-[10px] text-gray-500">
                            {days[index]}
                          </span>
                          <input
                            type="checkbox"
                            checked={done}
                            readOnly
                            className="w-5 h-5 accent-green-500 cursor-not-allowed"
                          />
                        </div>
                      );
                    })}
                  </div>
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
