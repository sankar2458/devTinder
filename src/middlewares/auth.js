
const adminAuth = (req, res, next) => {
    console.log('Admin Authentication checking!!!!');
    const token = 'XYZ';
    if (token === 'XYZ') {
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
}

const userAuth = (req, res, next) => {
    console.log('User Authentication checking!!!!');
    const token = 'XYZA';
    if (token === 'XYZ') {
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
}

module.exports = {
    adminAuth,
    userAuth
}


