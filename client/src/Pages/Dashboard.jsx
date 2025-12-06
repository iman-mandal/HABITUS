// src/pages/Dashboard.jsx
import React from 'react';
import HabitList from '../components/Habits/HabitList';

export default function Dashboard() {
    return (
        <div className="page">
            <h1>Dashboard</h1>
            <HabitList />
        </div>
    );
}
