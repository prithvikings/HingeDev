const express = require('express');
const requestRouter = express.Router();
const {authenticate}=require('../middleware/auth');

requestRouter.post("/sendconnectionrequest",authenticate, async (req, res) => {
    const user=req.user;
    console.log("sending a connection request");
    res.send(user.firstName + " Connection request sent");
});

module.exports = requestRouter;