const HabitModel = require('../models/habits');

const formatDate = (date = new Date()) => {
  return new Date(date).toISOString().slice(0, 10);
};

const fillMissingDaysForHabitRecord = (habit, untilDate = new Date()) => {
  const today = formatDate(untilDate);
  const historyDates = new Set((habit.history || []).map((item) => formatDate(item.date)));

  const historyDatesArray = habit.history ? habit.history.map((item) => formatDate(item.date)) : [];
  const latestHistoryDate = historyDatesArray.length
    ? historyDatesArray.sort((a, b) => new Date(a) - new Date(b))[historyDatesArray.length - 1]
    : null;

  const lastTracked = habit.lastUpdated || latestHistoryDate || habit.startDate || today;
  const startDate = new Date(formatDate(lastTracked));

  const missingEntries = [];
  for (let day = new Date(startDate); formatDate(day) <= today; day.setDate(day.getDate() + 1)) {
    const dateString = formatDate(day);
    if (!historyDates.has(dateString)) {
      missingEntries.push({ date: dateString, completed: false });
    }
  }

  let changed = false;
  if (missingEntries.length > 0) {
    habit.history = [...habit.history, ...missingEntries];
    habit.history.sort((a, b) => new Date(a.date) - new Date(b.date));
    changed = true;
  }

  if (habit.lastUpdated !== today) {
    habit.lastUpdated = today;
    changed = true;
  }

  return changed;
};

exports.createHabit = async (userId, habitData) => {
  const today = formatDate();

  const habit = new HabitModel({
    user: userId,
    ...habitData,
    startDate: today,
    lastUpdated: today,
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
  data.lastUpdated = formatDate();
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

exports.fillMissingDaysForHabit = async (habit) => {
  const changed = fillMissingDaysForHabitRecord(habit);
  if (changed) await habit.save();
  return changed;
};

exports.fillMissingDaysForUserHabits = async (userId) => {
  if (!userId) throw new Error('User not found');
  const habits = await HabitModel.find({ user: userId });

  const updates = habits.map(async (habit) => {
    const changed = fillMissingDaysForHabitRecord(habit);
    if (changed) {
      return habit.save();
    }
    return null;
  });

  await Promise.all(updates);
  return await HabitModel.find({ user: userId });
};

exports.fillMissingDaysForAllHabits = async () => {
  const allHabits = await HabitModel.find({});
  const updates = allHabits.map(async (habit) => {
    const changed = fillMissingDaysForHabitRecord(habit);
    if (changed) {
      return habit.save();
    }
    return null;
  });
  await Promise.all(updates);
};

exports.toggleHabit = async (userId, habitId, date) => {
  const day = date || formatDate();

  const habit = await HabitModel.findOne({
    _id: habitId,
    user: userId
  });

  if (!habit) throw new Error('Habit not found');

  fillMissingDaysForHabitRecord(habit);

  const index = habit.history.findIndex((h) => h.date === day);

  if (index >= 0) {
    habit.history[index].completed = !habit.history[index].completed;
  } else {
    habit.history.push({ date: day, completed: true });
  }

  const completedDates = habit.history
    .filter((h) => h.completed)
    .map((h) => h.date)
    .sort((a, b) => new Date(a) - new Date(b));

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  for (let i = 0; i < completedDates.length; i++) {
    if (
      i === 0 ||
      new Date(completedDates[i]) - new Date(completedDates[i - 1]) ===
      24 * 60 * 60 * 1000
    ) {
      tempStreak++;
    } else {
      tempStreak = 1;
    }

    longestStreak = Math.max(longestStreak, tempStreak);
  }

  let today = new Date(day);
  currentStreak = 0;

  for (let i = completedDates.length - 1; i >= 0; i--) {
    const d = new Date(completedDates[i]);
    if (formatDate(today) === formatDate(d)) {
      currentStreak++;
      today.setDate(today.getDate() - 1);
    } else if (today - d === 24 * 60 * 60 * 1000) {
      currentStreak++;
      today.setDate(today.getDate() - 1);
    } else {
      break;
    }
  }

  habit.streak = currentStreak;
  habit.longestStreak = Math.max(longestStreak, habit.longestStreak || 0);
  habit.lastUpdated = formatDate();

  await habit.save();

  return habit;
};