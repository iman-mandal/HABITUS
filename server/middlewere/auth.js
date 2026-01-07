const userModel = require('../models/user');
const jwt = require('jsonwebtoken');

module.exports.authUser = async (req, res, next) => {
  try {
    let token;

    // Get token from Authorization header (Bearer token) or cookies
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    // Defensive check
    if (!token || token === 'null') {
      return res.status(401).json({ message: 'Unauthorized, token missing or invalid' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded._id);

    if (!user) return res.status(401).json({ message: 'User not found' });

    // Attach user info to request
    req.user = user;
    req.userId = decoded._id;

    next();
  } catch (err) {
    console.log('Auth error:', err.message);
    return res.status(401).json({ message: 'Unauthorized, token invalid' });
  }
};
