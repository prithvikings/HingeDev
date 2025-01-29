const express = require('express');
const userRouter = express.Router();
const {authenticate} = require('../middleware/auth');
const ConnectionRequestModel = require('../models/connectionRequest');
const User = require('../models/user');



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
userRouter.get("/user/requests/connection", authenticate, async (req, res) => {
    try {
        const loggedinUser = req.user;
        const connectionRequests = await ConnectionRequestModel.find({
            $or: [
                { fromUserId: loggedinUser._id, status: "accepted" },
                { toUserId: loggedinUser._id, status: "accepted" }
            ]
        })
        .populate('fromUserId', ['firstName', 'lastName', 'email', 'photoUrl', 'age', 'gender', 'about'])
        .populate('toUserId', ['firstName', 'lastName', 'email', 'photoUrl', 'age', 'gender', 'about']);

        res.json(connectionRequests);
    } catch (error) {
        return res.status(400).send({ error: error.message });
    }
});



//get all the ignored requests connection request for the loggedin user 
userRouter.get("/feed", authenticate, async (req, res) => {
    /**
         * GET /feed
         * This route fetches all user cards for the logged-in user except:
         * 1. The user's own card.
         * 2. Users they are already connected with.
         * 3. Users they have ignored.
         * 4. Users to whom they have already sent a connection request.
         * 
         * Example:
         * - Rahul is the logged-in user.
         * - Rahul's connections: A, B, C
         * - Ignored users: D, E
         * - Pending requests sent by Rahul: F
         * 
         * Expected Output:
         * - All user cards except A, B, C, D, E, F, and Rahul himself.
    */
    try {
        const loggedinUser = req.user;
        // const page = parseInt(req.query.page) || 1;
        // const limit = parseInt(req.query.limit) || 10;
        // const skip = (page - 1) * limit;
        const connectionRequest=await ConnectionRequestModel.find({
            $or:[
                {fromUserId:loggedinUser._id},
                {toUserId:loggedinUser._id}
            ],
        }).select('fromUserId toUserId');
            const hideUsersFromFeed=new Set();
            connectionRequest.forEach((req) => {
                hideUsersFromFeed.add(req.fromUserId);
                hideUsersFromFeed.add(req.toUserId);
            });
            const users=await User.find({
                $and:[
                    {_id:{$nin:Array.from(hideUsersFromFeed)}},
                    {_id:{$ne:loggedinUser._id}}
                ]})
            // }).skip(skip).limit(limit);
            res.json(users);
    } catch (error) {
        console.error("Error in fetching user feed:", error.message);
        res.status(500).json({ 
            error: "Failed to fetch user feed", 
            details: error.message 
        });
    }
});


module.exports = userRouter;