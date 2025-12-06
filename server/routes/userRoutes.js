const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { generateToken, jwtAuthMiddlewere } = require('../middlewere/auth');
const habits = require('../models/habits');

// signup 
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const newUser = new User({ name, email, password });
        //check is your if the email exsist 
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ msg: 'Your account already exists. Please, login' });

        const response = await newUser.save();
        console.log('Data saved');
        const payload = {
            id: response._id,
            name: response.name,
            email: response.email
        };
        console.log('Payload', payload);
        const token = generateToken(payload);
        console.log("Token :", token);
        res.status(200).json({
            message: "Registation successfully",
            user: response,
            token: token
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ err: 'Internal Server Error' });
    }
});

router.post('/login',async (req,res)=>{
    try{
        const {email,password}=req.body;
        const user=await User.findOne({email});
        if(!user) return res.status(400).json({err:'Invalid creadentials'});
        const isMatch= await user.comparePassword(password);
        if(!isMatch) return res.status(400).json({err:'Invalid creadentials'});

        const token=generateToken(user);
        console.log('Token',token);
        res.json({
            message:'Login sucessfull',
            token,
            user:{id:user._id,name:user.name,email:user.email}
        });

    }catch(err){
        console.log(err);
        res.json({err:'Internal server error'});
    };
});


module.exports = router;