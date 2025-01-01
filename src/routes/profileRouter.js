const express = require('express');
const profileRouter = express.Router();
const {authenticate}=require('../middleware/auth');

// for using cookie to authenticate the user for profile page
profileRouter.get("/profile",authenticate,async(req,res)=>{
    try{
        res.send("Welcome to the profile page" + req.user.firstName);
    }catch(err){
        console.log(err);
        res.status(400).send("Failed to fetch user");
    }
})

module.exports = profileRouter;