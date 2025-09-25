const mongoose = require('mongoose');

// Define the user schema for signup
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, 
        required: true,
        minlength: [8, 'Password must be at least 8 characters long.'],
        validate: {
            validator: function(value) {
                // Must contain at least one uppercase letter, one number, and one special character.
                return /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(value);
            },
            message: props => `Password must contain at least one uppercase letter, one number, and one special character.`
        }
    },
    age: { type: Number , min: 18, max: 100 },
    gender: { 
        type: String, 
        validate(value) {
            if (!["male", "female", "other"].includes(value)) {
                throw new Error("Gender must be valid");
            }
        }
    },
    photoUrl: { type: String, default: 'https://i.pinimg.com/564x/c7/ab/cd/c7abcd3ce378191a3dddfa4cdb2be46f.jpg' },
    skills: { type: [String] }
}, { timestamps: true });

// Create a model and export it
module.exports = mongoose.model('User', userSchema);