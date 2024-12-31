const express=require('express');
const app=express();
const {connectdb} =require('./config/database');
const port = 3000 || 3001;
const servershutdown=require('./utils/servershutdown');
const User=require('./models/user');
const validateSignUpData=require('./utils/validation');
const bcrypt=require('bcrypt');
app.use(express.json());


// for send the data to the server
app.post("/signup",async (req,res)=>{
    try{
    // Before creating new user instance, do proper validation
    validateSignUpData(req);

    // Encrypt the password before saving it to the database
    const {gender,age,firstName,lastName,email,password,about,skills}=req.body;
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
        age
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

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if user exists
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).send("User not found");
        }
        // Compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Entered Password:", password);
        console.log("Stored Password Hash:", user.password);
        console.log("Password Match Result:", isMatch);
    
        if (isMatch) {
            res.send("User logged in successfully");
        } else {
            res.status(400).send("Invalid credentials");
        }
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).send("Error logging in user");
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

//for updating the data from the server
app.patch("/usersupdate", async (req, res) => {
    const allowedUpdates=["password","about","skills","email"];
    const isValidUpdate=Object.keys(req.body).every((k)=>allowedUpdates.includes(k));
    if(!isValidUpdate){
        return res.status(400).send("Invalid update operation");
    }else{
    try {
        const userEmail = req.body.email;
        
        if(!userEmail){
            return res.status(400).send("Email is required");
        }

        // Update user data
        const updatedUser = await User.updateOne(
            { email: userEmail },
            { $set: req.body },
            { runValidators: true }
        );

        // Check if a user was matched
        if (updatedUser.matchedCount === 0) {
            return res.status(404).send("No user found with the provided email");
        }

        // Check if user data was actually modified
        if (updatedUser.modifiedCount === 0) {
            return res.status(200).send("No changes were made to the user data");
        }
        res.status(200).send("User updated successfully"+updatedUser.acknowledged);
    } catch (err) {
            console.error(err);
            res.status(500).send("Failed to update user" +err.message);
        }
    }
});

// for deleting the data from the server
app.delete("/usersdelete",async(req,res)=>{
    try{
        const firstName=req.body.firstName;
        const deletedUser=await User.deleteOne({firstName:firstName});
        if(deletedUser.deletedCount==0){
            res.send("No user found");
        }
        else{
            res.send(`User deleted successfull ${deletedUser.acknowledged}`);
        }
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
    const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    servershutdown(server);
});

// // Handle clean server shutdown
// servershutdown(server);
})
.catch(err=>{
    console.log(err);
})
