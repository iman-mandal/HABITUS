const userModel = require('../models/user');
const jwt = require('jsonwebtoken');


module.exports.authUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded._id);

        if (!user) return res.status(401).json({ message: 'User not found' });

        req.user = user;
        req.userId = decoded._id;

        return next();

    } catch (err) {
        console.log(err);
        return res.status(401).json({ mesage: 'Unauthorized' });
    }
}