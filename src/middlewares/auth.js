const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            throw new Error('Authentication token missing');
        }
        const decodedObj = jwt.verify(token, 'Siva@Dev123');
        const { _id } = decodedObj;
        // find user by id
        const user = await User.findById(_id);
        if (!user) {
            throw new Error('User not found');
        }
        // attach user to request object
        req.user = user;
        // proceed to next middleware or route handler
        next();
    }
    catch (err) {
        return res.status(400).send('ERROR: ' + err.message);
    }
}

module.exports = {
    userAuth
}


