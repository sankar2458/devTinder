const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { validateSignupData } = require('../utils/validation');

const authRouter = express.Router();

authRouter.post('/signup', async (req, res) => { 
    try{
        // Validate incoming data
        validateSignupData(req);
        // Destructure the request body
        const { firstName, lastName, email, password } = req.body;
        // Create a new user instance
        const user = new User({
            firstName, lastName, email, password
        });
        // Hash the password before saving
        user.password = await bcrypt.hash(user.password, 10);
        // Save the user to the database
        await user.save();
        res.send('User signed up successfully'  + user);
    }
    catch(err){
        res.status(400).send('ERROR: ' + err.message);
    }
});

//Login api to authenticate user
authRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try{
        const user = await User.findOne({ email });
        if(!user){
            throw new Error('Invalid email');
        }
        const isPasswordMatch = await user.validatePassword(password);
        if(isPasswordMatch){
            //generate jwt token
            const token = await user.getJWT();
            //set token in cookie
            res.cookie('token', token, { httpOnly: true , expires: new Date(Date.now() + 8 * 3600000)});
            //send response
            res.send('Login successful');
        }
        else{
            throw new Error('Invalid password');
        }
    }
    catch(err){
        res.status(400).send('ERROR: ' + err.message);
    }
});

authRouter.post('/logout', async (req, res) => {
    res.clearCookie('token');
    res.send('Logged out successfully');
});


module.exports = authRouter;