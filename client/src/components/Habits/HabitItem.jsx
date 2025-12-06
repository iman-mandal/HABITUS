// src/components/Habits/HabitItem.jsx
import React, { useState } from 'react';
import api from '../../api/api';

export default function HabitItem({ habit, onUpdated, onDeleted }) {
  const [busy, setBusy] = useState(false);
  const today = new Date().toISOString().slice(0, 10);
  const completedToday = habit.history?.some(h => h.date === today && h.completed);

  const toggleToday = async () => {
    setBusy(true);
    try {
      const res = await api.post(`/habit/${habit._id}/toggle`, { date: today });
      if (onUpdated) onUpdated(res.data);
    } catch (err) {
      console.error(err);
      alert('Could not toggle - check console.');
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!confirm('Delete this habit?')) return;
    setBusy(true);
    try {
      await api.delete(`/habit/${habit._id}`);
      if (onDeleted) onDeleted(habit._id);
    } catch (err) {
      console.error(err);
      alert('Could not delete.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="habit-card">
      <div className="habit-main">
        <div>
          <h4>{habit.title}</h4>
          <div className="muted">{habit.description}</div>
        </div>

        <div className="habit-actions">
          <div className="muted small">Streak: {habit.streak || 0}</div>
          <button className={`btn ${completedToday ? 'btn-done' : ''}`} onClick={toggleToday} disabled={busy}>
            {completedToday ? 'Done ✓' : 'Mark done'}
          </button>
          <button className="btn btn-danger" onClick={remove} disabled={busy}>Delete</button>
        </div>
      </div>
      <div className="habit-footer">
        <div className="muted small">Longest streak: {habit.longestStreak || 0}</div>
      </div>
    </div>
  );
}
