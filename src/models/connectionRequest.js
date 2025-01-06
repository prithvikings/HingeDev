const mongoose = require('mongoose');
const { Schema } = mongoose;

const connectionRequestSchema = new Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User", // reference to the User model 
        required:true
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    status:{
        type:String,
        required:true,
        enum:['ignored','accepted','rejected','interested'],
        message:"{VALUE} is not supported"
    }
},{
    timestamps:true,
});


const ConnectionRequestModel = new mongoose.model(
    'ConnectionRequest', connectionRequestSchema
);

module.exports = ConnectionRequestModel;