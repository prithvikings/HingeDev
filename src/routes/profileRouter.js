const express = require('express');
const profileRouter = express.Router();
const {authenticate}=require('../middleware/auth');
const {validateProfileData}=require('../utils/validation');

// for using cookie to authenticate the user for profile page
profileRouter.get("/profile/view",authenticate,async(req,res)=>{
    try{
        res.send(req.user);
    }catch(err){
        console.log(err);
        res.status(400).send("Failed to fetch user");
    }
})

profileRouter.patch("/profile/edit",authenticate,async(req,res)=>{
    try{
        if(!validateProfileData(req)){
            throw new Error("Invalid fields to update");
        }else{
            const allowedEditFields=['firstName','lastName','password','about','skills','photourl','gender','age'];
            const loggedinuser=req.user;
            allowedEditFields.forEach(field=>{
                if(req.body[field]){
                    loggedinuser[field]=req.body[field];
                }
            });
            await loggedinuser.save();
            res.json({
                message:`${loggedinuser.firstName}, Profile updated successfully`,
                user:loggedinuser
            })
        }
    }
    catch(err){
        console.log(err);
        res.status(400).send("Failed to update user profile");
    }
}); // for updating the user profile

//if we forgot the password
profileRouter.post("/profile/forgotpassword",async(req,res)=>{
    try{
        const {email}=req.body;
        const user=await User
        .findOne({email});
        if(!user){
            throw new Error("User not found");
        }
        const token=await user.generateAuthToken();
        await user.save();
        res.json({
            message:"Password reset link sent to your email",
            token
        });
    }catch(err){
        console.log(err);
        res.status(400).send("Failed to send password reset link");
    }
}); 

module.exports = profileRouter;