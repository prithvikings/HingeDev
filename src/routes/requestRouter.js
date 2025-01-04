const express = require('express');
const requestRouter = express.Router();
const { authenticate } = require('../middleware/auth');
const ConnectionRequestModel = require('../models/connectionRequest');

requestRouter.post("/request/send/:status/:touserId",
    authenticate,
    async (req, res) => {
        try {
            const fromUser = req.user._id; // User sending the request
            const toUser = req.params.touserId; // User receiving the request
            const status = req.params.status; // Status of the request

            const connectionRequest = new ConnectionRequestModel({
                fromUserId: fromUser,
                toUserId: toUser,
                status: status
            });

            const data = await connectionRequest.save();
            res.json({
                message: "Connection request sent",
                data: data
            });
        } catch (err) {
            console.log(err);
            res.status(500).send("Internal Server Error");
        }
    }
);

module.exports = requestRouter;
