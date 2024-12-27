const express=require('express');
const app=express();
const port=3000;



//use will handle all type of request like get,post,put,delete etc other will not handle because its order is first
// app.use('/',(req,res)=>{
//     res.send('Hello World');
//     res.end();
// })

//get will only handle get request 
app.get('/',(req,res)=>{
    res.send('Hello World paaji');
    res.end();
})

app.post('/',(req,res)=>{
    console.log('Post request is made');
    res.send('Save the data');
    res.end();
})

app.delete('/',(req,res)=>{
    console.log('Delete request is made');
    res.send('Delete the data');
    res.end();
})

//use will handle all type of request like get,post,put,delete etc
app.use("/user",(req,res)=>{
    res.send('User page is created');
    res.end();
})

app.use("/admin",(req,res)=>{
    res.send('Admin page is created');
    res.end();
})

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});