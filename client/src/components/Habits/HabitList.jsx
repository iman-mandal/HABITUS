// src/components/Habits/HabitList.jsx
import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import HabitItem from './HabitItem';
import AddHabit from './AddHabit';
import HabitStats from './HabitStatus';

export default function HabitList() {
    const [habits, setHabits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchHabits = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get('/habit/');
            setHabits(res.data);
        } catch (err) {
            setError(err.response?.data?.msg || err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHabits();
    }, []);

    const handleAdded = (habit) => {
        setHabits(prev => [habit, ...prev]);
    };

    const handleUpdated = (u) => {
        setHabits(prev => prev.map(h => h._id === u._id ? u : h));
    };

    const handleDeleted = (id) => {
        setHabits(prev => prev.filter(h => h._id !== id));
    };

    if (loading) return <div className="card">Loading habits...</div>;
    if (error) return <div className="card error">Error: {error}</div>;

    return (
        <div>
            <AddHabit onAdded={handleAdded} />

            <div style={{ marginTop: 16 }}>
                <h3>Your habits</h3>
                {habits.length === 0 && <div className="card">No habits yet — add your first one!</div>}

                <div className="habit-list">
                    {habits.map(h => (
                        <HabitItem key={h._id} habit={h} onUpdated={handleUpdated} onDeleted={handleDeleted} />
                    ))}
                </div>
            </div>

            <div style={{ marginTop: 24 }}>
                <HabitStats habits={habits} />
            </div>
        </div>
    );
}
