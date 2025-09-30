const express = require('express');
const { userAuth } = require('../middlewares/auth');

const requestRouter = express.Router();

requestRouter.post('/sendConnectionRequest', userAuth, async (req, res) => {
    console.log("Request received");
    res.send('Connection request sent');
})

module.exports = requestRouter;
