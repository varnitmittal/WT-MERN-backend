const validator = require('validator');
const isEmptyMod = require('is-empty');

function validProfileInput(data){
    let errors = {}

    //null field to null string for validator
    data.age = isEmptyMod(data.age) ?  "" : data.age;
    data.height = isEmptyMod(data.height) ?  "" : data.height;
    data.gender = isEmptyMod(data.gender) ? "" : data.gender

    //age validation
    if(validator.isEmpty(data.age)){
        errors.error = "Age can't be empty!";
    } else if(!validator.isLength(data.age, { min: 2, max: 3 })){
        errors.error = "Age not right";
    }

    //height validation
    if(validator.isEmpty(data.height)){
        errors.error = "Height can't be empty!";
    } else if(!validator.isLength(data.height, { min: 2, max: 3 })){
        errors.error = "Input invalid";
    }

    //gender validation
    if(validator.isEmpty(data.gender)){
        errors.error = "Gender can't be empty!";
    } else if(validator.isBoolean(data.age)){
        errors.error = "Input not boolean!";
    }

    return({
        errors,
        isValid: isEmptyMod(errors)
    });
}

module.exports = validProfileInput;