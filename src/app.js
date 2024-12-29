const express=require('express');
const app=express();
const {connectdb} =require('./config/database');
const port=3000;
const User=require('./models/user');

app.use(express.json());


app.post("/signup",async (req,res)=>{
    // Create a new user isntance 
    const user=new User(req.body);

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
