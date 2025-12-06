// src/components/Auth/Login.jsx
import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        const res = await login(email.trim(), password);
        setSubmitting(false);
        if (res.ok) {
            navigate('/dashboard', { replace: true });
        } else {
            setError(res.error || 'Login failed');
        }
    };

    return (
        <div className="auth-card">
            <h2>Login</h2>
            <form onSubmit={submit} className="form">
                <label>
                    Email
                    <input value={email} onChange={e => setEmail(e.target.value)} type="email" required />
                </label>
                <label>
                    Password
                    <input value={password} onChange={e => setPassword(e.target.value)} type="password" required />
                </label>

                {error && <div className="error">{error}</div>}

                <button className="btn" disabled={submitting}>{submitting ? 'Logging in...' : 'Login'}</button>
            </form>

            <div className="auth-footer">
                <span>Don't have an account?</span> <Link to="/register">Register</Link>
            </div>
        </div>
    );
}
