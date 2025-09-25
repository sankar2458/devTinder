const mongoose = require('mongoose');
const validator = require('validator');

// Define the user schema for signup
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true, unique: true, lowercase: true,
        validate: [validator.isEmail, 'Invalid email addresssssss']
     },
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
    photoUrl: { type: String,
        validate: [validator.isURL, 'Invalid URL']
    },
    skills: { type: [String] }
}, { timestamps: true });

// Create a model and export it
module.exports = mongoose.model('User', userSchema);