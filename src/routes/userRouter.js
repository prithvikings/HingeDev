const express = require('express');
const userRouter = express.Router();
const {authenticate} = require('../middleware/auth');
const ConnectionRequestModel = require('../models/connectionRequest');



//get all the pending requests connection request for the loggedin user
userRouter.get("/user/requests/pending", authenticate,async (req, res) => {
    try {
        const loggedinUser = req.user;
        const connectionRequests = await ConnectionRequestModel.find({
            toUserId:loggedinUser._id,
            status:"interested"
        }).populate('fromUserId',['firstName','lastName','email']); 
        res.json(connectionRequests);
    } catch (error) {
        return res.status(400).send({ error: error.message });
    }
});

//get all the sent requests connection request for the loggedin user
userRouter.get("/user/requests/sent", authenticate,async (req, res) => {
    try {
        const loggedinUser = req.user;
        const connectionRequests = await ConnectionRequestModel.find({
            fromUserId:loggedinUser._id,
            status:"interested"
        }).populate('toUserId',['firstName','lastName','email']);
        res.json(connectionRequests);
    } catch (error) {
        return res.status(400).send({ error: error.message });
    }
})

//get all the accepted requests connection request for the loggedin user
userRouter.get("/user/requests/connection", authenticate,async (req, res) => {
    try {
        const loggedinUser = req.user;
        const connectionRequests = await ConnectionRequestModel.find({
            $or:[
                {fromUserId:loggedinUser._id,status:"accepted"},
                {toUserId:loggedinUser._id,status:"accepted"}
            ]
        }).populate('fromUserId',['firstName','lastName','email']);
        res.json(connectionRequests);
    } catch (error) {
        return res.status(400).send({ error: error.message });
    }
});

module.exports = userRouter;