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
module.exports = {authentication, profileauth};


