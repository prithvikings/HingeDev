const validator = require("validator");

const validateSignUpData = (req) => {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName) {
        throw new Error("First name and last name are required");
    } else if (!validator.isEmail(email)) {
        throw new Error("Invalid email");
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Password is not strong enough");
    } else {
        return true;
    }
};

const validateProfileData = (req) => {
    const allowedEditFields = ['firstName', 'lastName', 'password', 'about', 'skills', 'photourl', 'gender', 'age'];
    const isAllowedEditFields = Object.keys(req.body).every(field =>
        allowedEditFields.includes(field));
    if (!isAllowedEditFields) {
        throw new Error("Invalid fields to update");
    } else {
        return true;
    }
};


// Exporting the validation functions
module.exports = { validateSignUpData, validateProfileData };
