// src/components/Habits/HabitCalendar.jsx
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './HabitCalendar.css';

export default function HabitCalendar({ habits }) {
    // habits = [{ date: '2025-12-05', name: 'Exercise', completed: true }, ...]

    const [value, setValue] = useState(new Date());

    const getHabitStatus = (date) => {
        const dateString = date.toISOString().split('T')[0];
        const dayHabits = habits.filter((h) => h.date === dateString);

        if (dayHabits.length === 0) return 'none'; // no habit
        if (dayHabits.every((h) => h.completed)) return 'all'; // all done
        if (dayHabits.some((h) => h.completed)) return 'partial'; // some done
        return 'none'; // none done
    };

    const getColor = (status) => {
        if (status === 'all') return 'green';
        if (status === 'partial') return 'yellow';
        if (status === 'none') return 'red';
    };

    return (
        <div className="habit-calendar">
            <h2>Habit Calendar</h2>
            <Calendar
                onChange={setValue}
                value={value}
                tileContent={({ date, view }) =>
                    view === 'month' ? (
                        <div
                            className="habit-dot"
                            style={{ backgroundColor: getColor(getHabitStatus(date)) }}
                        ></div>
                    ) : null
                }
            />
        </div>
    );
}
