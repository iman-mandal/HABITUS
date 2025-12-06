// src/components/UI/Navbar.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="nav">
            <div className="container nav-inner">
                <Link to="/" className="brand">Habit Tracker</Link>
                <div className="nav-links">
                    {user ? (
                        <>
                            <span className="nav-user">Hi, {user.name || user.email}</span>
                            <Link to="/dashboard">Dashboard</Link>
                            <Link to="/profile">Profile</Link>
                            <button className="btn-link" onClick={logout}>Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
