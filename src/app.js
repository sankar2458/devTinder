const express = require('express');
const app = express();
const { connectDB } = require('./config/database');
const User = require('./models/user');
const { validateSignupData } = require('./utils/validation');
const bcrypt = require('bcrypt');

// Middleware to parse JSON bodies
app.use(express.json());

// Signup API to create a new user
app.post('/signup', async (req, res) => { 
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
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try{
        const user = await User.findOne({ email });
        if(!user){
            throw new Error('Invalid email');
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch){
            throw new Error('Invalid password');
        }
        res.send('Login successful');
    }
    catch(err){
        res.status(400).send('ERROR: ' + err.message);
    }
});

//get user data from email
app.get('/user', async (req, res) => {
    const email = req.body.email;
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
app.patch('/user/:userId', async(req, res) => {
    const {userId} = req.params;
    const {...data} = req.body;
    try{
        const ALLOWED_UPDATES = ["skills","photoUrl","password","age","gender"];
        const isUpdateAllowed = Object.keys(data).every((update) => ALLOWED_UPDATES.includes(update));
        if(!isUpdateAllowed){
            throw new Error('Invalid updates!');
        }
        //skills not more than 5
        if(data.skills && data.skills.length > 5){
            throw new Error('Skills cannot be more than 5');
        }
        const user = await User.findByIdAndUpdate(userId, data, { new: true, runValidators: true});
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

