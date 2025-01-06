const express = require('express');
const requestRouter = express.Router();
const { authenticate } = require('../middleware/auth');
const ConnectionRequestModel = require('../models/connectionRequest');
const User = require('../models/user'); // Corrected naming convention

// 📌 Send Connection Request
requestRouter.post("/request/send/:status/:touserId", authenticate, async (req, res) => {
    try {
        const fromUser = req.user._id; // User sending the request
        const toUser = req.params.touserId; // User receiving the request
        const status = req.params.status; // Status of the request

        // ✅ Validate status
        const allowedStatus = ["ignored", "interested"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Invalid status: " + status });
        }

        // ✅ Check if the request is already sent
        const existingConnectionRequest = await ConnectionRequestModel.findOne({
            $or: [
                { fromUserId: fromUser, toUserId: toUser },
                { fromUserId: toUser, toUserId: fromUser }
            ]
        });
        if (existingConnectionRequest) {
            return res.status(400).json({ message: "Request already sent" });
        }

        // ✅ Check if the user is sending a request to themselves
        if (fromUser.equals(toUser)) {
            return res.status(400).json({ message: "Sender and receiver cannot be the same" });
        }

        // ✅ Check if the recipient user exists
        const validUser = await User.findById(toUser);
        if (!validUser) {
            return res.status(404).json({ message: "User not found in database" });
        }

        // ✅ Create a new connection request
        const connectionRequest = new ConnectionRequestModel({
            fromUserId: fromUser,
            toUserId: toUser,
            status: status
        });

        const data = await connectionRequest.save();
        const output = status === "interested" ? "Request sent" : "Request ignored";
        res.json({ message: output, data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// 📌 Review Connection Request
requestRouter.post("/request/review/:status/:requestid", authenticate, async (req, res) => {
    try {
        const loggedInUser = req.user._id; // Current logged-in user
        const { status, requestid } = req.params;

        // ✅ Validate status
        const allowedStatus = ["accepted", "rejected"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Status not allowed" });
        }

        // ✅ Check if the request exists and is valid
        const connectionRequest = await ConnectionRequestModel.findOne({
            _id: requestid,
            status: "interested",
            toUserId: loggedInUser
        });
        if (!connectionRequest) {
            return res.status(404).json({ message: "Connection request not found" });
        }

        // ✅ Update status
        connectionRequest.status = status;
        const data = await connectionRequest.save();

        res.json({ message: `Connection request ${status}`, data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});



module.exports = requestRouter;
