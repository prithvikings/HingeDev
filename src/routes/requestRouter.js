const express = require('express');
const requestRouter = express.Router();
const { authenticate } = require('../middleware/auth');
const ConnectionRequestModel = require('../models/connectionRequest');
const user = require('../models/user');

requestRouter.post("/request/send/:status/:touserId",
    authenticate,
    async (req, res) => {
        try {
            const fromUser = req.user._id; // User sending the request
            const toUser = req.params.touserId; // User receiving the request
            const status = req.params.status; // Status of the request

            // Check if the status is valid
            const allowedStatus = ["ignored", "intrested"];
            if (!allowedStatus.includes(status)) {
                return res.status(400).json({
                    message: "Invalid status "+status
                });
            }

            // Check if the request is already sent
            const existingConnectionRequest = await ConnectionRequestModel.findOne({
                $or:[{
                    fromUserId: fromUser,
                    toUserId: toUser
                },{
                    fromUserId: toUser,
                    toUserId: fromUser
                }]
            })
            if (existingConnectionRequest) {
                return res.status(400).json({
                    message: "Request already sent"
                });
            }

            // Check if the user is sending request to himself
            if (fromUser === toUser) {
                return res.status(400).json({
                    message: "sender and receiver cannot be same"
                });
            }

            // Check if the user is sending request to a valid user
            const validUser = await user.findById(toUser);
            if (!validUser) {
                return res.status(400).json({
                    message: "User Not found in database"
                });
            }

            // Create a new connection request
            const connectionRequest = new ConnectionRequestModel({
                fromUserId: fromUser,
                toUserId: toUser,
                status: status
            });

            const data = await connectionRequest.save();
            const output=status==="intrested"?"Request sent":"Request Ignored";
            res.json({
                message: output,
                data: data
            });
        } catch (err) {
            console.log(err);
            res.status(500).send("Internal Server Error");
        }
    }
);

module.exports = requestRouter;
