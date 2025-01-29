const jwt = require('jsonwebtoken');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');


const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.token; // Token sent via cookies

    // If no token is found, return an unauthorized error
    if (!token) {
      return res.status(401).send("Unauthorized access. Please log in first.");
    }

    // Hardcode the secret key for now
    const secretKey = "DEV@Tinder$790"; // Replace with your secret key

    // Verify the JWT token using the hardcoded secret key
    const decoded = jwt.verify(token, secretKey); // Use the hardcoded secret key

    // Find the user associated with the token
    const user = await User.findById(decoded._id); // Use user._id instead of email

    // If no user is found, return unauthorized error
    if (!user) {
      return res.status(401).send("Unauthorized access. User not found.");
    }

    req.user = user; // Attach the user to the request object for use in the next middleware
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    // Catch any errors and respond with an unauthorized access message
    res.status(401).send("Unauthorized access.");
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


