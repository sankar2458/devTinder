const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Define the user schema for signup
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true, trim: true, minlength: [5, 'First name must be at least 5 characters long.']  },
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
    skills: { type: [String] },
    about: { type: String, maxlength: [500, 'About section cannot exceed 500 characters.'] }
}, { timestamps: true });

// Instance method to generate JWT token
userSchema.methods.getJWT = async function() {
    const user = this;
    //generate jwt token
    const token = await jwt.sign({ _id: user?._id }, 'Siva@Dev123', { expiresIn: '1h' });

    return token;
};

// Instance method to validate password
userSchema.methods.validatePassword = async function(passwordInput) {
    const user = this;
    const isPasswordValid = await bcrypt.compare(passwordInput, user.password);

    return isPasswordValid;
};



// Create a model and export it
module.exports = mongoose.model('User', userSchema);