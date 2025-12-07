import React from "react";
import "./HabitStatus.css";

export default function HabitStats({ habitData }) {
    if (!habitData || habitData.length === 0) {
        return <p>No habit data available</p>;
    }

    const totalCompleted = habitData.filter(h => h.completed).length;
    const completionPercentage = Math.round((totalCompleted / habitData.length) * 100);

    return (
        <div className="stats-container">
            <h2 className="stats-title">Habit Stats</h2>

            <ul className="stats-list">
                {habitData.map((habit) => (
                    <li
                        key={habit._id || habit.id || habit.name}
                        className="stats-item"
                    >
                        <span>{habit.name}</span>
                        <span>{habit.completed ? "✅ Completed" : "❌ Incomplete"}</span>
                    </li>
                ))}
            </ul>

            <div className="stats-summary">
                <p><strong>Total Habits:</strong> {habitData.length}</p>
                <p><strong>Completed:</strong> {totalCompleted}</p>
                <p><strong>Completion Rate:</strong> {completionPercentage}%</p>
            </div>
        </div>
    );
}
