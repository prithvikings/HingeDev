const express = require('express');
const profileRouter = express.Router();
const {authenticate}=require('../middleware/auth');
const validateProfileData=require('../utils/validation');

// for using cookie to authenticate the user for profile page
profileRouter.get("/profile/view",authenticate,async(req,res)=>{
    try{
        res.send("Welcome to the profile page" + req.user.firstName);
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
            const allowedEditFields=['firstName','lastName','password','about','skills'];
            const loggedinuser=req.user;
            allowedEditFields.forEach(field=>{
                if(req.body[field]){
                    loggedinuser[field]=req.body[field];
                }
            });
            await loggedinuser.save();
            res.send("User profile updated successfully");
        }
    }
    catch(err){
        console.log(err);
        res.status(400).send("Failed to update user profile");
    }
}); // for updating the user profile

module.exports = profileRouter;