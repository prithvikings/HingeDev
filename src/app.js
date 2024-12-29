const express=require('express');
const app=express();
const {connectdb} =require('./config/database');
const port=3000;
const User=require('./models/user');

app.use(express.json());


// for send the data to the server
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

// for fetching the data from the server of selected user
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

//for fetching all the data from the server
app.get("/feed",async(req,res)=>{
    try{
        const users=await User.find({});
        if(users.length==0){
            res.send("No user found");
            }else{
                res.send(users);
            }
    }
    catch(err){
        console.log(err);
        res.status(400).send("Failed to fetch users");
    }
})

// for deleting the data from the server
app.delete("/usersdelete",async(req,res)=>{
    try{
        const firstName=req.body.firstName;
        const deletedUser=await User.deleteOne({firstName:firstName});
        res.send("User deleted successfully");
    }
    catch(err){
        console.log(err);
        res.status(400).send("Failed to delete user");
    }
})

connectdb()
.then(()=>{
    console.log("connected to database");
    // Catch-all for 404 errors (page not found)
    app.use((req, res) => {
        res.status(404).send('Page not found. Sorry!');
    });

    // General error handler (500 internal server errors)
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).send("Something went wrong");
    });


    app.listen(port,()=>{
        console.log(`Server is running on port ${port}`);
    });
})
.catch(err=>{
    console.log(err);
})
