// src/components/Habits/AddHabit.jsx
import React, { useState } from 'react';
import api from '../../api/api';

export default function AddHabit({ onAdded }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [frequency, setFrequency] = useState('Daily');
    const [targetDays, setTargetDays] = useState(7);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const submit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            const payload = {
                title: title.trim(),
                description: description.trim(),
                frequency,
                targetDaysPerWeek: Number(targetDays) || 7,
                startDate: new Date().toISOString()
            };
            const res = await api.post('/habit/createHabit', payload);
            setTitle('');
            setDescription('');
            setFrequency('Daily');
            setTargetDays(7);
            if (onAdded) onAdded(res.data);
        } catch (err) {
            setError(err.response?.data?.msg || err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="card">
            <h3>Add habit</h3>
            <form onSubmit={submit} className="form">
                <label>
                    Title
                    <input value={title} onChange={e => setTitle(e.target.value)} required />
                </label>

                <label>
                    Description
                    <input value={description} onChange={e => setDescription(e.target.value)} />
                </label>

                <label>
                    Frequency
                    <select value={frequency} onChange={e => setFrequency(e.target.value)}>
                        <option value="Daily">Daily</option>
                        <option value="Weekly">Weekly (target days)</option>
                        <option value="Custom">Custom</option>
                    </select>
                </label>

                {frequency === 'Weekly' && (
                    <label>
                        Target days / week
                        <input type="number" min="1" max="7" value={targetDays} onChange={e => setTargetDays(e.target.value)} />
                    </label>
                )}

                <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn" disabled={submitting}>{submitting ? 'Adding...' : 'Add'}</button>
                    <button type="button" className="btn btn-ghost" onClick={() => { setTitle(''); setDescription(''); }}>
                        Reset
                    </button>
                </div>

                {error && <div className="error">{error}</div>}
            </form>
        </div>
    );
}
