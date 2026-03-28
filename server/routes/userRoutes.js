const express = require('express');
const router = express.Router();
const userController = require('../Controller/UserController');
const authMiddleware = require('../middlewere/auth')
const { body, validationResult } = require('express-validator');
const nodemailer = require("nodemailer");

// 🔐 OTP STORE
const otpStore = {};

// 📧 MAIL CONFIG
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
});

// ================= SEND OTP =================
router.post('/send-otp', async (req, res) => {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email required " });

    const otp = Math.floor(100000 + Math.random() * 900000);

    otpStore[email] = {
        otp,
        expires: Date.now() + 3 * 60 * 1000
    };

    try {
        await transporter.sendMail({
            from: `"OTP Service" <${process.env.EMAIL}>`,
            to: email,
            subject: "OTP Verification",
            html: `<h2>Your OTP is: ${otp}</h2><p>Valid for 3 minutes</p>`
        });

        console.log("✅ OTP:", otp);

        res.json({ message: "OTP sent successfully ✅" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to send OTP " });
    }
});

// signup 
router.post('/register', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({ min: 3 }).withMessage
        ('First name must be atlest 3 charaters long'),
    body('password').isLength({ min: 5 }).withMessage
        ('First name must be atlest 3 charaters long'),
    body('otp').notEmpty().withMessage('OTP required')
],async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, otp } = req.body;

    const record = otpStore[email];

    if (!record) return res.status(400).json({ message: "No OTP found " });

    if (Date.now() > record.expires) {
        delete otpStore[email];
        return res.status(400).json({ message: "OTP expired " });
    }

    if (record.otp != otp) {
        return res.status(400).json({ message: "Invalid OTP " });
    }

    delete otpStore[email];

    return userController.registerUser(req, res);
});


//user login
router.post('/login', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], userController.loginUser
)

router.put('/update-profile', authMiddleware.authUser, userController.updateUserProfile)
router.put('/change-password', authMiddleware.authUser, userController.changePassword)

//get user profile route
router.get('/profile', authMiddleware.authUser, userController.getUserProfile);

// logout user route
router.get('/logout', authMiddleware.authUser, userController.logoutUser);

// Update theme
router.put('/theme', authMiddleware.authUser, userController.updateTheme);

module.exports = router;
