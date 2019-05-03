const validator = require('validator');
const isEmptyMod = require('is-empty');

function validLoginInput(data){
    let errors = {}

    //null field to null string for validator
    data.username = isEmptyMod(data.username) ? "" : data.username ;
    data.password = isEmptyMod(data.password) ?  "" : data.password;

    //username validation
    if(validator.isEmpty(data.username)){
        errors.error = "Username can't be empty!";
    } else if(!validator.isLength(data.username, { min: 6, max: 20 })){
        errors.error = "Username must have atleast 6 characters (max: 20)";
    }

    //non-empty password valildation
    if(validator.isEmpty(data.password)){
        errors.error = "Password can't be empty!"
    }

    //password length validation
    if (!validator.isLength(data.password, { min: 6, max: 20 })) {
        errors.error = "Password must be have least 6 characters (max: 20)";
      }

    return({
        errors,
        isValid: isEmptyMod(errors)
    });
}

module.exports = validLoginInput;