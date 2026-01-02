const userModel = require('../models/user');
const userService = require('../Services/UserServices');
const { validationResult } = require('express-validator');

// Signup controller
module.exports.registerUser = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(404).json({ errors: errors.array() })
        }
        const { fullname, email, password } = req.body;
        const userAlreadyExsist = await userModel.findOne({ email });
        if (userAlreadyExsist) {
            res.status(400).json({ message: 'User already exsist' });
        }
        const hashPassword = await userModel.hashPassword(password);

        const user = await userService.createUser({
            firstname: fullname.firstname,
            lastname: fullname.lastname,
            email,
            password: hashPassword
        });

        console.log("Your Registion is Sucessfully Completed")
        const token = user.genarateAuthToken();
        res.cookie('token', token);
        res.status(200).json({ token: token, user: user });

    } catch (err) {
        console.log(err);
        res.status(500).json({ err: 'Internal Server Error' });
    }
}


// Login controller
module.exports.loginUser = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(404).json({ errors: errors.array() });
        }
        const { email, password } = req.body;
        const user = await userModel.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: "Invalid Password or Email" });
        }
        const isMatch = await (user.comparePassword(password));
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid Password or Email" });
        }
        const token = user.genarateAuthToken();
        console.log('Login Sucessfully');
        res.cookie('token', token);
        res.status(200).json({ token: token, user: user });
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: 'Internal Server Error' });
    }
}

module.exports.getUserProfile = async (req, res, next) => {
    try {
        res.status(200).json({ user: req.user });
        console.log('User profile found')
    } catch {
        console.log(err);
        res.status(500).json({ message: 'Can not fatch user profile' })
    }
}

module.exports.logoutUser = async (req, res, next) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout successfully' });
}