const express=require('express');
const app=express();
const port=3000;
app.get('/',(req,res)=>{
    res.send('Hello World');
    res.end();
})

app.use("/user",(req,res)=>{
    res.send('User page is created');
    res.end();
    
})
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});