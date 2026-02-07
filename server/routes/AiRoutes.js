const express = require('express');
const router = express.Router();

const { chatWithAI } = require("../Controller/AIController");
const authMiddleware = require('../middlewere/auth');

// all routes protected
router.post('/chat', authMiddleware.authUser, chatWithAI);

module.exports = router;