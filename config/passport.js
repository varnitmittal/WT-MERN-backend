const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const User = mongoose.model("users");
const config = require("../config/config");

const jwtOptions = {};

//extracting jwt and 
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = config.secretOrKey;

const jwtLogin = new JwtStrategy(jwtOptions, (jwt_payload, callback) => {
    User.findById(jwt_payload.id)
    .then(user => {
        if(user) {
            return callback(null, user);
        }
        return callback(null, false);
    })
    .catch(err => {
        console.log(err);
    });
});

module.exports = passport => passport.use(jwtLogin);
