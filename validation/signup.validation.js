const validator = require('validator');
const isEmptyMod = require('is-empty');

function validSignUpInput(data){
    let errors = {}

    //null field to null string for validator
    data.username = isEmptyMod(data.username) ? "" : data.username;
    data.email = isEmptyMod(data.email) ? "" : data.email ;
    data.password = isEmptyMod(data.password) ?  "" : data.password;
    data.password2 = isEmptyMod(data.password2) ? "" : data.password2;

    //username validation
    if(validator.isEmpty(data.username)){
        errors.error = "Username can't be empty!";
    } else if(!validator.isLength(data.username, { min: 6, max: 20 })){
        errors.error = "Username must have atleast 6 characters (max: 20)";
    } else if(!validator.isAlphanumeric(data.username)) {
        errors.error = "Username can have alphabets and/or numbers only (No white spaces allowed)";
    }

    //email validation
    if(validator.isEmpty(data.email)){
        errors.error = "email can't be empty!";
    } else if(!validator.isEmail(data.email)){
        errors.error = "Inavlid Email"
    }

    //non-empty password valildation
    if(validator.isEmpty(data.password)){
        errors.error = "Password can't be empty!"
    }
    if(validator.isEmpty(data.password2)){
        errors.error = "Password can't be empty!"
    }

    //password length validation
    if (!validator.isLength(data.password, { min: 6, max: 20 })) {
        errors.error = "Password must be have least 6 characters (max: 20)";
    }

    //matching passwords validation
    if (!validator.equals(data.password, data.password2)) {
        errors.error = "Passwords must match";
    }

    return({
        errors,
        isValid: isEmptyMod(errors)
    });
}

module.exports = validSignUpInput;