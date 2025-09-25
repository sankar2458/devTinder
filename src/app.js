const express = require('express');
const app = express();
const { connectDB } = require('./config/database');
const User = require('./models/user');
const user = require('./models/user');

// Middleware to parse JSON bodies
app.use(express.json());

//get user data from email
app.get('/user', async (req, res) => {
    const email = req.body.email;
    //console.log(email);
    try{
        const user = await User.find({ email: email });
        if(user.length === 0){
            return res.status(404).send('User not found');
        }
        res.send(user);
    }
    catch(err){
        res.status(500).send('Error fetching user: ' + err.message);
    }
});


// Signup API to create a new user
app.post('/signup', async (req, res) => { 
    // Create a new user instance
    const user = new User(req.body);
    try{
        await user.save();
        res.send('User signed up successfully');
    }
    catch(err){
        res.status(500).send('Error signing up user: ' + err.message);
    }
});

//Feed api to find all the users
app.get('/feed', async (req, res) => {
    try{
        const users = await User.find();
        res.send(users);
    }
    catch(err){
        res.status(500).send('Error fetching users: ' + err.message);
    }
});

//delete user api
app.delete('/user/:userId', async (req, res) => {
    const {userId} = req.params;
    console.log(userId);
    try{
        const user = await User.findByIdAndDelete({_id: userId});
        if(!user){
            return res.status(404).send('User not found');
        }
        res.send('User deleted successfully');
    }
    catch(err){
        res.status(500).send('Error deleting user: ' + err.message);
    }
});

//patch api to update user details
app.patch('/user', async(req, res) => {
    const {userId, ...data} = req.body;
    console.log(userId, data);
    if(!userId){
        return res.status(400).send('UserId is required');
    }
    try{
        const user = await User.findByIdAndUpdate(userId, data, { new: true }, runValidators=true);
        if(!user){
            return res.status(404).send('User not found');
        }
        res.send(user);
    }
    catch(err){
        res.status(500).send('Error updating user: ' + err.message);
    }
});

//patch api to update user with email

// Connect to the database 
connectDB().then(() => {
    console.log('Database connected successfully');
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}).catch((err) => {
    console.log('Database connection error:', err);
    process.exit(1);
});

