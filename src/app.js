const express=require('express');
const app=express();
const database=require('./config/database');
const port=3000;

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});