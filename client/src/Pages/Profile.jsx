// src/pages/Profile.jsx
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Profile() {
    const { user } = useContext(AuthContext);

    if (!user) return <div className="card">No profile data</div>;

    return (
        <div className="page">
            <h1>Profile</h1>
            <div className="card">
                <p><strong>Name:</strong> {user.name || '-'}</p>
                <p><strong>Email:</strong> {user.email}</p>
            </div>
        </div>
    );
}
