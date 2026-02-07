const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();

const cors = require('cors');
const cookieParser = require("cookie-parser");

// ✅ CORS MUST come before routes
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const connectToDB = require('./db');
connectToDB();

// routes
const userRoutes = require('./routes/userRoutes');
const habitRoutes = require('./routes/habitsRoutes');
const AIRoutes = require('./routes/AIRoutes');

app.use('/user', userRoutes);
app.use('/habit', habitRoutes);
app.use('/api/ai', AIRoutes);

module.exports = app;
