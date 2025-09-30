const validator = require('validator');

const validateSignupData = (req) => {
    const { firstName, lastName, email, password} = req.body;
    if(!firstName || typeof firstName !== 'string' || firstName.trim() === '') {
        throw new Error('First name is required and must be a non-empty string.');
    }
    if(lastName && (typeof lastName !== 'string' || lastName.trim() === '')) {
        throw new Error('Last name must be a non-empty string if provided.');
    }
    if(!email || !validator.isEmail(email)) {
        throw new Error('A valid email address is required.');
    }
    if(!password || typeof password !== 'string' || password.length < 8) {
        throw new Error('Password is required and must be at least 8 characters long.');
    }
    if(!validator.isStrongPassword(password, { minLength: 8, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
        throw new Error('Password must contain at least one uppercase letter, one number, and one special character.');
    }
}

const validateEditData = (req) => {
    const allowedEditFields = ['firstName', 'lastName', 'age', 'gender', 'photoUrl', 'skills', 'about'];
    const isAllowedEdits = Object.keys(req.body).every(field => allowedEditFields.includes(field));
    // if(!isAllowedEdits) {
    //     throw new Error('Invalid updates! You can only edit: ' + allowedEditFields.join(', '));
    // }
    return isAllowedEdits
}


module.exports = {
    validateSignupData,
    validateEditData
};