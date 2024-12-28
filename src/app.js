const express=require('express');
const app=express();
const {connectdb} =require('./config/database');
const port=3000;
const User=require('./models/user');

app.post("/signup",async (req,res)=>{
    const userObj={
        firstName:"Prithvi",
        lastName:"Raj",
        email:"prithvi07raj07@gmail.com",
        password:"1234567890",
        age:18,
        gender:"Male"
    }
    // Create a new user isntance 
    const user=new User(userObj);

    try{
        // Save the user instance to the database
        await user.save();
        res.send("User created successfully");
    }
    catch(err){
        console.log(err);
        res.status(400).send("User creation failed");
    }
    
});



connectdb()
.then(()=>{
    console.log("connected to database");
    app.listen(port,()=>{
        console.log(`Server is running on port ${port}`);
    });
})
.catch(err=>{
    console.log(err);
})
