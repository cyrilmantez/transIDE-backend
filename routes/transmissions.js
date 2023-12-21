var express = require('express');
var router = express.Router();

require('../models/connection');
const Patient = require('../models/patients');
const { checkBody } = require('../modules/checkBody');

router.get('/allTransmissions/:token/:date',(req, res) => {
    const requestDate = new Date(req.params.date)
    requestDate.setHours(1, 0, 0, 0);
    
    Patient.find({officeToken : req.params.token,'transmissions.date':{$gt:requestDate}}).then(data => {
        console.log(data);
       if (data.length>0) {
            const transmissionsArray =[];
            for (const patient of data) {
                for (const transmission of patient.transmissions) {
                    if(transmission.date>=requestDate){
                        transmissionsArray.push({
                        name: patient.name,
                        firstname : patient.firstname,
                        date : transmission.date,
                        nurse : transmission.nurse,
                        info: transmission.info,
                    })
                    }
                }
            }
            console.log(transmissionsArray)
            res.json({result:true,transmissions : transmissionsArray})
            }else{
            res.json({result:false, error : 'no transmission after the specified date'})
        }
        }).catch(error => {
            // Gérer les erreurs liées à la recherche dans la base de données
            console.error(error);
            res.status(500).json({ result: false, error: 'Internal server error' });
          });
    })

router.post('/addtransmission', (req, res) => {
    const {transmission, patient, token} = req.body;
    console.log('patient :', patient, 'token :', token)
    if(patient.name === 'Général'){
        Patient.findOne({name:patient.name, officeToken:token}).then((data) => {
        console.log('retour transmission1' ,data)
        Patient.updateOne({_id:data._id},{transmissions : [...data.transmissions,transmission]}).then(() => {
            res.json({result:true, newTransmission: data})
        })
    })
    }else{
        Patient.findOne({name:patient.name, yearOfBirthday: patient.yearOfBirthday, officeToken:token}).then((data) => {
            console.log('retour transmission2' ,data)
            Patient.updateOne({_id:data._id},{transmissions : [...data.transmissions,transmission]}).then(() => {
                res.json({result:true})
            })
        })
    }
    
})


module.exports = router;