const habitService = require('../Services/habitServices');


exports.createHabit = async (req, res) => {
  try {
    const { title, description, frequency, targetPerWeek } = req.body;

    // Validate required fields
    if (!title || !description || !frequency) {
      return res.status(400).json({ message: 'Title, description, and frequency are required' });
    }

    const habit = await habitService.createHabit(req.userId, {
      title,
      description,
      frequency,
      targetPerWeek
    });

    res.status(201).json({ message: 'Habit created', habit });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


exports.getHabits = async (req, res) => {
  try {
    const habits = await habitService.getHabits(req.userId);
    console.log('Here is the Habit List')
    res.status(200).json(habits);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.updateHabit = async (req, res) => {
  try {
    const habit = await habitService.updateHabit(
      req.userId,
      req.params.id,
      req.body
    );
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }
    console.log('Your Habit is Sucessfully Updated')
    res.json(habit);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.deleteHabit = async (req, res) => {
  try {
    await habitService.deleteHabit(req.userId, req.params.id);
    res.json({ message: 'Habit deleted' });
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: err.message });
  }
};

exports.toggleHabit = async (req, res) => {
  try {
    const habit = await habitService.toggleHabit(
      req.userId,
      req.params.id,
      req.body.date
    );
    console.log('Congress, You Have completed the Habit')
    res.json(habit);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};