const HabitModel = require('../models/habits');


exports.createHabit = async (userId, habitData) => {

  const today = new Date().toISOString().slice(0, 10);

  const habit = new HabitModel({
    user: userId,
    ...habitData,

    //  Force default history entry
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

// exports.toggleHabit = async (userId, habitId, date) => {
//   const day = date || new Date().toISOString().slice(0, 10);
//   const habit = await HabitModel.findOne({ _id: habitId, user: userId });

//   if (!habit) throw new Error('Habit not found');

//   const index = habit.history.findIndex(h => h.date === day);

//   if (index >= 0) {
//     habit.history[index].completed = !habit.history[index].completed;
//   } else {
//     habit.history.push({ date: day, completed: true });
//   }

//   // streak calculation
//   const completedDates = habit.history
//     .filter(h => h.completed)
//     .map(h => h.date)
//     .sort();

//   let current = 0, longest = 0;
//   for (let i = 0; i < completedDates.length; i++) {
//     if (
//       i === 0 ||
//       new Date(completedDates[i]) - new Date(completedDates[i - 1]) ===
//       24 * 60 * 60 * 1000
//     ) {
//       current++;
//     } else {
//       current = 1;
//     }
//     longest = Math.max(longest, current);
//   }

//   habit.streak = current;
//   habit.longestStreak = Math.max(longest, habit.longestStreak || 0);

//   await habit.save();
//   return habit;
// };

exports.toggleHabit = async (userId, habitId, date) => {
  const day = date || new Date().toISOString().slice(0, 10);

  const habit = await HabitModel.findOne({
    _id: habitId,
    user: userId
  });

  if (!habit) throw new Error('Habit not found');

  //  Toggle logic
  const index = habit.history.findIndex(h => h.date === day);

  if (index >= 0) {
    // toggle existing value
    habit.history[index].completed = !habit.history[index].completed;
  } else {
    // first time → start from false, then toggle to true
    habit.history.push({ date: day, completed: false });

    // now toggle it
    habit.history[habit.history.length - 1].completed = true;
  }

  //  Sort history by date
  const sortedHistory = habit.history
    .filter(h => h.completed)
    .map(h => h.date)
    .sort((a, b) => new Date(a) - new Date(b));

  // 🔥 Streak calculation
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  for (let i = 0; i < sortedHistory.length; i++) {
    if (
      i === 0 ||
      new Date(sortedHistory[i]) - new Date(sortedHistory[i - 1]) ===
      24 * 60 * 60 * 1000
    ) {
      tempStreak++;
    } else {
      tempStreak = 1;
    }

    longestStreak = Math.max(longestStreak, tempStreak);
  }

  // ✅ Calculate current streak (from today backwards)
  let today = new Date(day);
  currentStreak = 0;

  for (let i = sortedHistory.length - 1; i >= 0; i--) {
    let d = new Date(sortedHistory[i]);

    if (
      today.toISOString().slice(0, 10) === d.toISOString().slice(0, 10)
    ) {
      currentStreak++;
      today.setDate(today.getDate() - 1);
    } else if (
      today - d === 24 * 60 * 60 * 1000
    ) {
      currentStreak++;
      today.setDate(today.getDate() - 1);
    } else {
      break;
    }
  }


  habit.streak = currentStreak;
  habit.longestStreak = Math.max(
    longestStreak,
    habit.longestStreak || 0
  );

  await habit.save();

  return habit;
};