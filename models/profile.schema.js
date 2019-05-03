const mongoose = require('mongoose');

//model schema
const ProfileSchema = new mongoose.Schema({
    u_id:{
        type: String
    },
    profile_date: {
        type: String
    },
    personal_info: {
        gender:{
            type: Boolean, // 0 for males and 1 for females 
            default: 0,
        },
        age:{
            type: Number,
            default: null
        },
        height:{
            type: Number,
            default: null
        }
    }
});

//creating and exporting the model
const Profile = mongoose.model('profiles', ProfileSchema);
module.exports = Profile;