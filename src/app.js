const express=require('express');
const app=express();
const {connectdb} =require('./config/database');
const port=3000;
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
