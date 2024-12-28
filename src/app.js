const express=require('express');
const app=express();
const port=3000;
const {authentication} = require('../middleware/auth');
const {profileauth} = require('../middleware/auth');


//use will handle all type of request like get,post,put,delete etc other will not handle because its order is first
// app.use('/',(req,res)=>{
//     res.send('Hello World');
//     res.end();
// })

//get will only handle get request 
app.get('/hello',(req,res)=>{
    res.send('Hello World paaji');
    res.end();
})

app.post('/hello',(req,res)=>{
    console.log('Post request is made');
    res.send('Save the data');
    res.end();
})

app.delete('/hello',(req,res)=>{
    console.log('Delete request is made');
    res.send('Delete the data');
    res.end();
})

app.use("/admin",authentication);

app.use("/admin/getalldata",(req,res)=>{
    console.log('Accessing the data from admin page');
    res.send('Admin getting the data from admin page');
});

app.use("/admin/deletealldata",(req,res)=>{
    console.log('Deleting the data from admin page');
    res.send('Admin deleting the data from admin page');
})

//use will handle all type of request like get,post,put,delete etc
app.use("/user",(req,res,next)=>{
        console.log('User page is created console printing');
        res.send('User page is created');
        next();
    },
    (req,res,next)=>{
        console.log('User page 2 is created console printing');
        res.send('User page 2 is created');
        next();
    },
    (req,res,next)=>{
        console.log('User page 3 is created console printing');
        res.send('User page 3 is created');
        next();
    },
    (req,res,next)=>{
        console.log('User page 4 is created console printing');
        res.send('User page 4 is created');
    }
)


//we use middleware only where we want to use it like here for login we dont want to use middleware cause we want that user should enter their credentials first then only they can login but when we want to fetch data we want to use middleware cause we want that only authorized user can fetch the data so we use middleware there so we have already created one middle ware in auth.js file so we will use that middleware here only for fetching the data


app.use("/profile/login",(req,res,next)=>{
    console.log('Profile ');
    res.send('Profile login done');
})

app.use("/profile/getdata",profileauth,(req,res,next)=>{
    console.log('Profile data fetch console printing');
    res.send('Profile data fetch');
})

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