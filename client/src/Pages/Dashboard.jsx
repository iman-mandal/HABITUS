import React, { useState, useEffect } from 'react';
import HabitList from '../components/Habits/HabitList';
import HabitGraph from '../components/Designs/HabitGraph';
import HabitCalendar from '../components/Designs/HabitCalendar';

export default function Dashboard() {
    const [habitCalendarData, setHabitCalendarData] = useState([]);
    const [habitGraphData, setHabitGraphData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHabits = async () => {
            try {
                const res = await fetch("http://localhost:4000/habit", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                });
                
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                
                const allHabits = await res.json();
                
                // ---------- GRAPH DATA ----------
                const graphFormat = allHabits.map(habit => {
                    const completedCount = Array.isArray(habit.history)
                        ? habit.history.filter(item => item.completed === true).length : 0;

                    return {
                        habit: habit.title || habit.description || "Unnamed Habit",
                        completed: completedCount
                    };
                });

                // Optional: sort habits by completed count (highest first)
                graphFormat.sort((a, b) => b.completed - a.completed);

                setHabitGraphData(graphFormat);

                // ---------- CALENDAR DATA ----------
                const calendarFormat = allHabits.flatMap(habit =>
                    (habit.history || []).map(item => ({
                        date: item.date,
                        completed: item.completed,
                        habit: habit.title || habit.description || "Unnamed Habit"
                    }))
                );

                setHabitCalendarData(calendarFormat);

            } catch (err) {
                console.error("Error fetching habits:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchHabits();
    }, []);

    if (loading) return <h2 style={{ textAlign: "center" }}>Loading Dashboard...</h2>;

    return (
        <div className="page">
            <h1>Dashboard</h1>

            <HabitList />

            {/* Graph showing COMPLETED counts */}
            {/* <HabitGraph data={habitGraphData} /> */}

            {/* Calendar */}
            {/* <HabitCalendar habits={habitCalendarData} /> */}
        </div>
    );
}
