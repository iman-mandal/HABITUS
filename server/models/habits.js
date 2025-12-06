const mongoose = require('mongoose');

const HabitSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    titel: { type: String, require: true },
    description: { type: String },
    frequency: { type: String, enum: ['Daily', 'Weekly', 'Mounthly', 'Custom'], default: 'Daily' },
    targetPerWeek: { type: Number, default: 7 },
    startDate: { type: String, default: Date.now },
    history: [{
        date: { type: String },
        completed: { type: Boolean, default: false }
    }],
    streak:{type:Number,default:0},
    longestStreak:{type:Number,default:0},
    active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Habits', HabitSchema);