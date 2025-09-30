const express = require('express');
const { userAuth } = require('../middlewares/auth');
const { validateEditData } = require('../utils/validation');
const profileRouter = express.Router();

//profile api to get loggedIn user profile
profileRouter.get('/profile/view', userAuth, async (req, res) => { 
    try {
        const user = req.user;
        res.send({user});
    }
    catch(err){
        res.status(400).send('Error: ' + err.message);
    }
});

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
    try {
        if(!validateEditData(req)){
            throw new Error('Invalid updates!');
        };
        const loggedInUser = req.user;
        Object.keys(req.body).forEach((field) => loggedInUser[field] = req.body[field]);
        await loggedInUser.save();
        //res.send(`${loggedInUser.firstName}, your profile updated successfully.`);
        res.json({message: `${loggedInUser.firstName}, your profile updated successfully.`},{user: loggedInUser});
    }
    catch(err){
        res.status(400).send('Error: ' + err.message);
    }
});

//Forgot Password APIs will be here
//Change Password APIs will be here
profileRouter.post('/profile/changePassword', userAuth, async (req, res) => {
    try {
        const user = req.user;
        const { oldPassword, newPassword } = req.body;
        if(!oldPassword || !newPassword) {
            throw new Error('Both old and new passwords are required.');
        }
        const isMatch = await user.comparePassword(oldPassword);
        if(!isMatch) {
            throw new Error('Old password is incorrect.');
        }
        user.password = newPassword;
        await user.save();
        res.send('Password changed successfully.');
    } catch (err) {
        res.status(400).send('Error: ' + err.message);
    }
});



module.exports = profileRouter;