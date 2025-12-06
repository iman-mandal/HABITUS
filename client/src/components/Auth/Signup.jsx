// src/components/Auth/Register.jsx
import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        const res = await register(name.trim(), email.trim(), password);
        setSubmitting(false);
        if (res.ok) {
            navigate('/dashboard', { replace: true });
        } else {
            setError(res.error || 'Register failed');
        }
    };

    return (
        <div className="auth-card">
            <h2>Create account</h2>
            <form onSubmit={submit} className="form">
                <label>
                    Full name
                    <input value={name} onChange={e => setName(e.target.value)} type="text" required />
                </label>
                <label>
                    Email
                    <input value={email} onChange={e => setEmail(e.target.value)} type="email" required />
                </label>
                <label>
                    Password
                    <input value={password} onChange={e => setPassword(e.target.value)} type="password" required minLength={6} />
                </label>

                {error && <div className="error">{error}</div>}

                <button className="btn" disabled={submitting}>{submitting ? 'Creating...' : 'Register'}</button>
            </form>

            <div className="auth-footer">
                <span>Already have an account?</span> <Link to="/login">Login</Link>
            </div>
        </div>
    );
}
