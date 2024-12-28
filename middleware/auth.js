const authentication = (req, res, next) => {
    const token = "xyz";
    const auth = "xyzhbv";

    if (token === auth) {
        console.log('You are authorized');
        next(); // Pass control to the next middleware or route handler
    } else {
        console.log('You are not authorized');
        res.status(403).send('Access denied'); // Send an error response and do not call `next()`
    }
};

module.exports = {authentication};
