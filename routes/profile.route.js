const express = require('express');
const router = express.Router();

//importing db model
const Profile = require('../models/profile.schema');

//importing profile validation
const validProfileInput = require('../validation/profile.validation');

//Create
router.post('/create', (req,res) => {
    const data = req.body;

    const { errors, isValid } = validProfileInput(data);
    //handling errors
    if (!isValid) return (res.json(errors));

    var newProfileEntry = {
            gender: data.gender,
            age: data.age,
            height: data.height,   
    }

    //Saving to DB
    var currentDate = new Date();
    currentDate = currentDate.toISOString().slice(0,10);
    Profile.updateOne({ 
            u_id: data.u_id
        },
        {
            personal_info: newProfileEntry,
            profile_date: currentDate
        }
    ).then(profile => {
        Profile.findOne({ 
            u_id: data.u_id
        })
        .then(profileNew => {
            var displayProfile = {
                gender: profileNew.personal_info.gender,
                age: profileNew.personal_info.age,
                height: profileNew.personal_info.height,   
            }
            res.json(displayProfile);
        })
        .catch(err => {
            res.send(err)
        })
    })
    .catch(err => {
        res.send(err)
    })
});

//Read
router.get('/read/:u_id', (req,res) => {
    const u_id = req.params.u_id
    Profile.findOne( {u_id : u_id} )
    //checking for existing profile
    .then(profile => {
        if(!profile){
            res.json({
                error: "profile doesn't exist!!"
            });
            return null;
        }
        var displayProfile = {
            gender: profile.personal_info.gender,
            age: profile.personal_info.age,
            height: profile.personal_info.height,   
        }
        res.json(displayProfile);
    })
    .catch(err => {
        res.send(err);
    });
});

//Update
router.post('/update', (req,res) => {
    const data = req.body;

    const { errors, isValid } = validProfileInput(data);
    //handling errors
    if (!isValid) return (res.json(errors));

    Profile.findOne( {u_id : data.u_id} )
    //checking for existing profile
    .then(profile => {
        if(!profile){
            res.json({
                error: "profile doesn't exist!!"
            });
            return null;
        }

        var updatedProfileEntry = {
            gender: data.gender,
            age: data.age,
            height: data.height,
        }

        //Saving to DB
        Profile.updateOne({ 
                u_id: data.u_id
            },
            {      
                personal_info : updatedProfileEntry,
                
            }
        ).then(profile => {
            Profile.findOne({ 
                u_id: data.u_id
            })
            .then(profileUpdated => {
                var displayProfile = {
                    gender: profileUpdated.personal_info.gender,
                    age: profileUpdated.personal_info.age,
                    height: profileUpdated.personal_info.height,   
                }
                res.json(displayProfile);
            })
            .catch(err => {
                res.send(err)
            })
        })
        .catch(err => {
            res.send(err)
        })
    })
    .catch(err => {
        res.send(err);
    });
});

//Delete
router.post('/delete', (req,res) => {
    const data = req.body;
    Profile.findOne( {u_id : data.u_id} )
    //checking for existing profile
    .then(profile => {
        if(!profile){
            res.json({
                error: "profile doesn't exist!!"
            });
            return null;
        }

        var updatedProfileEntry = {
            gender: 0,
            age: null,
            height: null,
        }

        //Saving to DB
        Profile.updateOne({ 
                u_id: data.u_id
            },
            {      
                personal_info : updatedProfileEntry
            })
            .then(profile => {
            Profile.findOne({ 
                u_id: data.u_id
            })
            .then(profileUpdated => {
                var displayProfile = {
                    gender: profileUpdated.personal_info.gender,
                    age: profileUpdated.personal_info.age,
                    height: profileUpdated.personal_info.height,   
                }
                res.json(displayProfile);
            })
            .catch(err => {
                res.send(err)
            })
        })
        .catch(err => {
            res.send(err)
        })
    })
    .catch(err => {
        res.send(err);
    });  
});

module.exports = router;