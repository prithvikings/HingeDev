const jwt = require('jsonwebtoken');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');

const authenticate = async (req, res,next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).send("Unauthorized access");
        }
        const decode = jwt.verify(token, "secretkey"); //this is decoded token
        const user = await User.findOne({ email: decode.email });//this is the user who is logged in
        req.user = user; //this is the user who is logged in and we are passing this user to the next middleware
        next();
    }
    catch (err) {
        res.status(401).send("Unauthorized access");
    }
};

const authentication = (req, res, next) => {
    console.log(`Authenticating route: ${req.originalUrl}`);
    const token = "xyz";
    const isAuth = token === 'xyz';

    if (!isAuth) {
        console.log('You are not authorized');
        return res.status(401).json({ message: 'Authentication failed' });
    } else {
        console.log('You are authorized');
        next();
    }
};


const profileauth=(req,res,next)=>{
    console.log(`Authenticating route: ${req.originalUrl}`);
    const token="abc";
    const isProfile=token==='abch';
    if(!isProfile){
        console.log('You are not authorized to view this profile');
        return res.status(401).json({message:'Profile authentication failed'});
    }else{
        console.log('You are authorized to view this profile');
        next();
    }
}


module.exports = {authentication, profileauth, authenticate};


