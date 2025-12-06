// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { setAuthToken } from '../api/api';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(() => {
        try {
            const raw = localStorage.getItem('ht_user');
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    });
    const [token, setToken] = useState(() => localStorage.getItem('ht_token') || null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (token) {
            setAuthToken(token);
        } else {
            setAuthToken(null);
        }
    }, [token]);

    const login = async (email, password) => {
        setLoading(true);
        try {
            const res = await api.post('/user/login', { email, password });
            const { token: tkn, user: u } = res.data;
            localStorage.setItem('ht_token', tkn);
            localStorage.setItem('ht_user', JSON.stringify(u));
            setToken(tkn);
            setUser(u);
            setLoading(false);
            return { ok: true };
        } catch (err) {
            setLoading(false);
            return { ok: false, error: err.response?.data?.msg || err.message };
        }
    };

    const register = async (name, email, password) => {
        setLoading(true);
        try {
            const res = await api.post('/user/signup', { name, email, password });
            const { token: tkn, user: u } = res.data;
            localStorage.setItem('ht_token', tkn);
            localStorage.setItem('ht_user', JSON.stringify(u));
            setToken(tkn);
            setUser(u);
            setLoading(false);
            return { ok: true };
        } catch (err) {
            setLoading(false);
            return { ok: false, error: err.response?.data?.msg || err.message };
        }
    };

    const logout = () => {
        localStorage.removeItem('ht_token');
        localStorage.removeItem('ht_user');
        setToken(null);
        setUser(null);
        setAuthToken(null);
        navigate('/login', { replace: true });
    };

    // helpful helper: refresh user (optional)
    const refreshUser = async () => {
        if (!token) return;
        try {
            // if backend had a profile endpoint: /auth/me
            // const res = await api.get('/auth/me'); setUser(res.data.user);
        } catch (err) {
            // ignore
        }
    };

    return (
        <AuthContext.Provider
            value={{ user, token, loading, login, register, logout, refreshUser }}
        >
            {children}
        </AuthContext.Provider>
    );
};
