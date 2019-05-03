const express = require('express');
const router = express.Router();

//importing db model
const Record = require('../models/record.schema');
const Profile = require('../models/profile.schema');

//importing record validation
const validRecordInput = require('../validation/record.validation');

//Create
router.post('/create', (req,res) => {
    const data = req.body; 

    const { errors, isValid } = validRecordInput(data);    
    //handling errors
    if (!isValid) return (res.json(errors));

    Profile.findOne( { u_id: data.u_id } )
    .then(profile => {
        //calculating bmi
        let heightInCm = profile.personal_info.height;
        var heightInM = heightInCm/100;
        var bmi = Math.round(data.weight*100/(heightInM*heightInM))/100;
        
        //finding the record
        Record.findOne( { u_id : data.u_id } )
        .then(record => {
            var newRecordEntry = {
                    weight: data.weight,
                    bmi: bmi,
                    date: data.date
            };

            var newTotalRecords = record.total_records + 1;
            
            //Saving to DB
            Record.updateOne({ 
                    u_id: data.u_id
                },
                {
                    $push : { health_records: newRecordEntry },
                    total_records: newTotalRecords
                }
            ).then(record => {
                //fetching records
                Record.findOne({ 
                    u_id: data.u_id
                })
                .then(recordNew => {
                    let index = recordNew.total_records - 1;
                    var displayRecord = {
                        total_records: recordNew.total_records,
                        health_records: recordNew.health_records[index],
                        array_id: recordNew.health_records[index].id
                    }                    
                    res.send(displayRecord);
                })
                .catch(err => {
                    res.send(err);
                })
            })
            .catch(err => {
                res.send(err);
            })
        })
    })
    .catch(err => {
        res.send(err);
    });
});

//Read
router.get('/readOne/:u_id/:array_id', (req,res) => {
    const u_id = req.params.u_id;
    const array_id = req.params.array_id;
    Record.findOne( {u_id: u_id} )
    //checking for existing record
    .then(record => {
        if(!record){
            res.json({
                error: "record doesn't exist!!"
            });
            return null;
        }
         for(let i=0; i<record.total_records; i++){
            if(record.health_records[i]._id == array_id){
                var displayRecord = {
                    index: i,
                    weight: record.health_records[i].weight,
                    bmi: record.health_records[i].bmi,
                    array_id: record.health_records[i]._id,
                    date: record.health_records[i].date
                };
                res.send(displayRecord);
            }
        }
    }).catch(err => {
        res.send(err);
    });
});
router.get('/readAll/:u_id', (req,res) => {
    const u_id = req.params.u_id
    Record.findOne( {u_id : u_id} )
    //checking for existing record
    .then(record => {
        if(!record){
            res.json({
                error: "record doesn't exist!!"
            });
            return null;
        }

        var displayRecord = {
            total_records: record.total_records,
            health_records: record.health_records  
        }

        res.send(displayRecord);
    })
    .catch(err => {
        res.send(err);
    });
});

//Update
router.post('/updateOne', (req,res) => { 
    const data = req.body;
    
    const { errors, isValid } = validRecordInput(data);    
    //handling errors
    if (!isValid) return (res.json(errors));

    Profile.findOne( { u_id: data.u_id } )
    .then(profile => {
        //calculating bmi
        let heightInCm = profile.personal_info.height;
        var heightInM = heightInCm/100;
        var bmi = Math.round(data.weight*100/(heightInM*heightInM))/100;

        //Saving to DB
        Record.updateOne({ 
                "u_id": data.u_id,
                "health_records._id": data.array_id
            },
            {   
                "$set": { 
                "health_records.$.weight": data.weight,
                "health_records.$.bmi": bmi,
                "health_records.$.date": data.date
            }
            },
            {
                multi: true
            },   
            (err, record) => {
                //fetching records
                Record.findOne({ 
                    u_id: data.u_id,
                    "health_records._id": data.array_id
                })
                .then(recordNew => {
                    for(let i=0; i<recordNew.total_records; i++){
                        if(recordNew.health_records[i]._id == data.array_id){
                            var displayRecord = {
                                health_records: recordNew.health_records[i].weight,
                                bmi: recordNew.health_records[i].bmi,
                                array_id: recordNew.health_records[i]._id,
                                date: recordNew.health_records[i].date
                            }
                            res.send(displayRecord);
                        }
                    }
                }).catch(err => {
                    res.json({
                        error: "array_id didn't match"
                    });
                })
            }
        )
    })
});

//Delete
router.get('/deleteAll/:u_id', (req,res) => {
    const u_id = req.params.u_id;
    Record.findOne( {u_id : u_id} )
    //checking for existing record
    .then(record => {
        if(!record){
            res.json({
                error: "record doesn't exist!!"
            });
            return null;
        }

        //Saving to DB
        Record.updateOne({ 
                u_id: u_id
            },
            {      
                $set: { health_records: [] },
                total_records: 0
            })
            .then(record => {
            Record.findOne({ 
                u_id: u_id
            })
            .then(recordUpdated => {
                var displayRecord = {
                    total_records: recordUpdated.total_records,
                    health_records: recordUpdated.health_records
                }                
                res.send(displayRecord);
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

router.get('/deleteOne/:u_id/:array_id', (req,res) => {
    const u_id = req.params.u_id;
    const array_id = req.params.array_id;
    Record.findOne( {u_id : u_id} )
    //checking for existing record
    .then(record => {
        if(!record){
             res.json({
                error: "record doesn't exist!!"
            });
            return null;
        }
        var displayRecord = {};
        for(let i=0; i<record.total_records; i++){
            if(record.health_records[i].id == array_id){
                let newTotalRecords = record.total_records - 1; 
                //Saving to DB
                Record.updateOne({ 
                    u_id: u_id
                },
                {
                    $pull: { health_records: {_id: array_id}} ,
                    total_records: newTotalRecords
                }
                ).then(record => {
                    //fetching records
                    Record.findOne({ 
                        u_id: u_id
                    })
                    .then(recordNew => {
                        displayRecord = {
                            total_records: recordNew.total_records,
                            health_records: recordNew.health_records,
                            array_id: recordNew.health_records.id,
                            date: recordNew.health_records.date
                        }
                        res.send(displayRecord);
                    })
                });
            }
        }
    })
});

module.exports = router;
