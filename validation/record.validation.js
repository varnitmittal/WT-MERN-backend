const validator = require('validator');
const isEmptyMod = require('is-empty');

function validRecordInput(data){
    let errors = {}

    //null field to null string for validator
    data.weight = isEmptyMod(data.weight) ?  "" : data.weight;

    //weight validation
    if(validator.isEmpty(data.weight)){
        errors.error = "weight can't be empty!";
    } else if(!validator.isLength(data.weight, { min: 2, max: 3 })){
        errors.error = "weight invalid";
    }

    return({
        errors,
        isValid: isEmptyMod(errors)
    });
}

module.exports = validRecordInput;