const { GoogleGenerativeAI } = require("@google/generative-ai");
const Habit = require("../models/habits");
require("dotenv").config();

// The key is pulled from your .env file here
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.chatWithAI = async (req, res) => {
  try {
    const userId = req.user.id;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message required" });
    }

    // Fetch user habits from your database
    const habits = await Habit.find({ user: userId });

    const habitSummary = habits.map(h => ({
      name: h.title,
      streak: h.streak,
      frequency: h.frequency
    }));

    // Initialize the specific model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are a habit coach AI.
      User habits: ${JSON.stringify(habitSummary, null, 2)}
      User question: ${message}
      Give practical, motivating advice.
    `;

    // Generate response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({
      reply: {
        role: "assistant",
        content: text
      }
    });

  } catch (err) {
    // Helpful tip: If the error is 'API_KEY_INVALID', check your .env file!
    console.error("Gemini AI Error:", err.message);
    res.status(500).json({ error: "AI service failed. Please check your API key." });
  }
};