const mongoose = require('mongoose');

const HabitSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required : true },
    description: { type: String },
    frequency: { type: String, enum: ['daily', 'weekly', 'monthly', 'custom'], default: 'daily' },
    targetPerWeek: { type: Number, default: 7 },
    startDate: { type: String, default: Date.now },
    history: [{
        date: { type: String },
        completed: { type: Boolean, default: false }
    }], 
    streak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Habits', HabitSchema);