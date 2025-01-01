const express=require('express');
const app=express();
const {connectdb} =require('./config/database');
const port = 3000 || 3001;
const servershutdown=require('./utils/servershutdown');
const cookieParser=require('cookie-parser');
const authRouter=require('./routes/authRoute');
const requestRouter=require('./routes/requestRouter');
const profileRouter=require('./routes/profileRouter');


app.use(express.json());
app.use(cookieParser())


app.use("/",authRouter);
app.use("/",requestRouter);
app.use("/",profileRouter);

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
})
.catch(err=>{
    console.log(err);
})
