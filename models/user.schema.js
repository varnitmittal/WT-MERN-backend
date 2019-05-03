const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//model schema
const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    email:{
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    password:{
        type: String,
        required: true
    }
});

//hashing the salted password
UserSchema.pre('save', function(next) {
    const doc = this;
    bcrypt.genSalt(13, (err, salt) => {
        if (err) return next(err);
        bcrypt.hash(doc.password, salt, (err,hash) => {
            if (err) return next(err);
            doc.password = hash;
            next();
        });
    });
});

//creating and exporting the model
const User = mongoose.model('users', UserSchema);
module.exports = User;