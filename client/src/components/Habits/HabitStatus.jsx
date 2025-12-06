// src/components/Habits/HabitStats.jsx
import React from 'react';

/**
 * Simple summary stats component.
 * Computes:
 * - total habits
 * - average completion in last 7 days (across all habits)
 * - top streaks
 */
export default function HabitStats({ habits = [] }) {
    const total = habits.length;

    // helper: dates last 7 days
    const dates = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        dates.push(d.toISOString().slice(0, 10));
    }

    // compute completion count per date across habits
    let totalPoints = 0;
    let possiblePoints = 0;
    for (const h of habits) {
        for (const d of dates) {
            possiblePoints += 1;
            const done = h.history?.some(it => it.date === d && it.completed);
            if (done) totalPoints += 1;
        }
    }
    const avgCompletion = possiblePoints === 0 ? 0 : Math.round((totalPoints / possiblePoints) * 100);

    // top streaks
    const streaks = habits.map(h => ({ title: h.title, streak: h.streak || 0 })).sort((a, b) => b.streak - a.streak).slice(0, 3);

    return (
        <div className="card">
            <h3>Stats</h3>
            <div className="stats-grid">
                <div className="stat">
                    <div className="stat-value">{total}</div>
                    <div className="muted">Total habits</div>
                </div>
                <div className="stat">
                    <div className="stat-value">{avgCompletion}%</div>
                    <div className="muted">7-day average completion</div>
                </div>
                <div className="stat">
                    <div className="stat-value">{streaks[0] ? `${streaks[0].streak}` : '—'}</div>
                    <div className="muted">Top streak</div>
                </div>
            </div>

            <div style={{ marginTop: 12 }}>
                <div className="muted">Top streaks</div>
                <ul>
                    {streaks.length === 0 && <li className="muted">No data yet</li>}
                    {streaks.map(s => (
                        <li key={s.id}>{s.title} — {s.streak}</li>
                    ))}
                </ul>

            </div>
        </div>
    );
}
