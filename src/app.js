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

app.get("/users", async(req,res)=>{
    try{
        const userEmail=req.body.email;
        const users=await User.find({email:userEmail});
        if(users.length==0){
            res.send("No user found");
        }else{
            res.send(users);
        }
    }catch(err){
        console.log(err);
        res.status(400).send("Failed to fetch users");
    }
})


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
