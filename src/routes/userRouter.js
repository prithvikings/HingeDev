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
        }).populate('fromUserId');
        res.json(connectionRequests);
    } catch (error) {
        return res.status(400).send({ error: error.message });
    }
});

module.exports = userRouter;