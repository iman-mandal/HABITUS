const HabitModel = require('../models/habits');


exports.createHabit = async (userId, habitData) => {

  const today = new Date().toISOString().slice(0, 10);

  const habit = new HabitModel({
    user: userId,
    ...habitData,

    // 🔥 Force default history entry
    history: [
      {
        date: today,
        completed: false
      }
    ]
  });

  await habit.save();

  return habit;
};

exports.getHabits = async (userId) => {
  if (!userId) throw new Error('User not found');
  return await HabitModel.find({ user: userId });
};

exports.updateHabit = async (userId, habitId, data) => {
  return await HabitModel.findOneAndUpdate(
    { _id: habitId, user: userId },
    data,
    { new: true }
  );
};

exports.deleteHabit = async (userId, habitId) => {
  const Habit = await HabitModel.findById(habitId);
  if (!Habit) throw new Error('Habit not found');
  if (Habit.user.toString() !== userId) {
    throw new Error('Not authorized');
  }
  await HabitModel.findByIdAndDelete(habitId);
};

exports.toggleHabit = async (userId, habitId, date) => {
  const day = date || new Date().toISOString().slice(0, 10);
  const habit = await HabitModel.findOne({ _id: habitId, user: userId });

  if (!habit) throw new Error('Habit not found');

  const index = habit.history.findIndex(h => h.date === day);

  if (index >= 0) {
    habit.history[index].completed = !habit.history[index].completed;
  } else {
    habit.history.push({ date: day, completed: true });
  }

  // streak calculation
  const completedDates = habit.history
    .filter(h => h.completed)
    .map(h => h.date)
    .sort();

  let current = 0, longest = 0;
  for (let i = 0; i < completedDates.length; i++) {
    if (
      i === 0 ||
      new Date(completedDates[i]) - new Date(completedDates[i - 1]) ===
      24 * 60 * 60 * 1000
    ) {
      current++;
    } else {
      current = 1;
    }
    longest = Math.max(longest, current);
  }

  habit.streak = current;
  habit.longestStreak = Math.max(longest, habit.longestStreak || 0);

  await habit.save();
  return habit;
};