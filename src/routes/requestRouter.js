const express = require('express');
const requestRouter = express.Router();
const { authenticate } = require('../middleware/auth');
const ConnectionRequestModel = require('../models/connectionRequest');
const user = require('../models/user');
const { Connection } = require('mongoose');

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

requestRouter.post("/request/review/:status/:requestid",authenticate,async(req,res)=>{
    try{
        //validate the status is status is interested or not if it is not interested then we will not consider it
        //dhoni=>alia
        //alia can only accept dhoni request (loggedInUser == toUserId)
        //it will only show this whenever it is intrested (Status always be interested)
        //request id should be valid

        const loggedInUser=req.user;
        const {status,requestid}=req.params;

        //validating status
        const allowedStatus=["accepted","rejected"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:"Satus not allowed"});
        }

        const connectionRequest=await ConnectionRequestModel.findOne({
            _id:requestid,
            status:"interested",
            toUserId:loggedInUser._id
        })
        if(!connectionRequest){
            return res
            .status(404)
            .json({message:"Connection request not found"})
        }

        connectionRequest.status=status;
        const data=await connectionRequest.save();
        res.json({message:"connection request "+status, data:data});
    }catch(err){

        console.log(err);
    }
})

module.exports = requestRouter;
