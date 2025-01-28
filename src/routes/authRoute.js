const express=require('express');
const authRouter=express.Router();
const User=require('../models/user');
const validateSignUpData=require('../utils/validation');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

// for send the data to the server
authRouter.post("/signup",async (req,res)=>{
    try{
    // Before creating new user instance, do proper validation
    validateSignUpData(req);

    // Encrypt the password before saving it to the database
    const {gender,age,firstName,lastName,email,password,about,skills,photourl}=req.body;
    const passwordHash=await bcrypt.hash(password,8);
    // Create a new user isntance 
    const user=new User({
        firstName,
        lastName,
        email,
        password:passwordHash,
        about,
        skills,
        gender,
        age,
        photourl
    });

        // Save the user instance to the database
        await user.save();
        res.send("User created successfully");
    }

    catch(err){
        console.log(err);
        res.status(400).send("Error creating user"+err.message);
    }
    
});


authRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).send("Email and password are required");
        }
        // Check if user exists
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).send("User not found");
        }
        // Compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        // console.log("Entered Password:", password);
        // console.log("Stored Password Hash:", user.password);
        // console.log("Password Match Result:", isMatch);
    
        if (isMatch) {

            // Generate a JWT token
            const token = jwt.sign({ email: user.email },"secretkey", { expiresIn: "1h" });
            // Add the token to cookie and send the response back to the user
            res.cookie("token", token);

            res.send(user);
        } else {
            res.status(400).send("Invalid credentials");
        }
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).send("Error logging in user");
    }

});



authRouter.post("/logout", async (req, res) => {
    // res.clearCookie("token"); //we can use this line or the below line
    res.cookie("token",null,{
        expires: new Date(Date.now()),
    }); 
    res.send("User logged out successfully");
});


module.exports=authRouter;

