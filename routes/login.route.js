const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const bcrypt = require('bcryptjs');

//importing db model
const User = require('../models/user.schema');

//importing validation
const validLoginInput = require('../validation/login.validation');

//POST (Create)
router.post('/', (req,res) => {
    const data = req.body; 
    const { errors, isValid } = validLoginInput(data);
    //handling errors
    if (!isValid) return (res.json(errors));

    //finding user in DB
    User.findOne({ username: data.username })
    .then(user => {
        //checking if user exists 
        if(!user){
            return res.json({
                error: "user does not exist"
            });
        }

        //comparing hashed password
        bcrypt.compare(data.password, user.password)
        .then(isMatch => {
            if (isMatch){
                const token = "";
                //creating jwt payload
                const payload = {
                    id: user.id,
                    username: user.username,
                    email: user.email
                }
                
                //signing the token
                jwt.sign(payload,
                    config.secretOrKey,
                    { 
                        expiresIn: '24h' 
                    },
                    (err,token) => {
                        let { username, email, id } = user;
                        let userData = {};
                        userData.username = username;
                        userData.email = email;
                        userData.id = id;
                        return res.status(200).cookie('token', token, { 
                                    httpOnly: true 
                                }).json({
                                    userData,
                                    success: true,
                                    token: token
                        });
                    });
            } else {
                return res.json({
                    error: "password is incorrect, try again!"
              })
            }
        })
    })
});

module.exports = router;