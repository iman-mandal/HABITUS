const jwt = require('jsonwebtoken');

//generate the token
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, name: user.name, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    )
};

const jwtAuthMiddlewere = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token)
        return res.status(401).json({ error: "No token provided" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;   // IMPORTANT
        next();
    } catch (err) {
        res.status(401).json({ error: "Invalid token" });
    }
};


module.exports = { generateToken, jwtAuthMiddlewere };