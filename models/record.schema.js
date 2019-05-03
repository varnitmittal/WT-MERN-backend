const mongoose = require('mongoose');

//model schema
const RecordSchema = new mongoose.Schema({
    u_id:{
        type: String,
    },
    total_records:{
        type : Number,
        default:0
    },
    health_records: [{
        date: {
            type: String
        },
        weight:{
            type: Number
        },
        bmi:{
            type: Number
        }
    }]
});

//creating and exporting the model
const Record = mongoose.model('records', RecordSchema);
module.exports = Record;