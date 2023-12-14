var express = require('express');
var router = express.Router();

require('../models/connection');
const Patient = require('../models/patients');
const { checkBody } = require('../modules/checkBody');



/////////// création d'un patient :

router.post('/addPatient', (req,res) => {

    if (!checkBody(req.body, ['name', 'firstname'])) {
        res.json({ result: false, error: 'Missing or empty fields' });
        return;
    };
    console.log(req.body)
    const newPatient = new Patient ({
        officeToken: req.body.officeToken,
        name: req.body.name,
        firstname: req.body.firstname,
        yearOfBirthday : req.body.dateOfBirthday,
        address: req.body.address,
        infosAddress : req.body.infosAddress,
        homePhone : req.body.homePhone,
        mobile: req.body.mobile, 
        treatments:[{
            state: false,
            date: req.body.treatments[0].treatmentDate,
            actions: req.body.treatments[0].actions,
            nurse: req.body.treatments[0].username,
            documentsOfTreatment: [{
                creationDate: req.body.treatments[0].documentsOfTreatment[0].creationDateOfDocumentsOfTreatment,
                urls: [req.body.treatments[0].documentsOfTreatment[0].urlsOfDocumentsOfTreatment]
            }],
        }],
        documents: [{
            creationDate: req.body.documents[0].creationDateOfDocument,
            url: req.body.documents[0].urlOfDocument
        }],    
        transmissions: [{
                date: req.body.transmissions[0].transmissionDate,
                nurse : req.body.transmissions[0].username,
                info : req.body.transmissions[0].info,
                urlDocument: req.body.transmissions[0].urlDocument,    
        }],
        disponibility: true,
        ICEIdentity: req.body.ICEIdentity,
        ICEPhoneNumber: req.body.ICEPhoneNumber,   
    });

    newPatient.save().then(data => {
        res.json ({result : true, patientCreate : data})
    })

})


/////////// modification d'un patient :

router.put('/updatePatientById', (req, res)=> {
    const newObject = req.body.newObject
    Patient.updateOne({_id: req.body._id}, newObject).then(data => {
        res.json ({result : true, modification : data})
    })
})





////////////// ajouter des soins à un patient :

router.put('/addTreatment', (req, res) => {
    Patient.updateOne({_id: req.body._id}, {treatments : [...treatments, req.body]}).then(data => {
        res.json({result: true})
    })
})





//////////// suppression d'un patient :

router.delete('/deletePatient/:_id', (req, res)=> {
    Patient.deleteOne({_id: req.params._id}).then(data => {
        res.json({result : true})
    })
})




///////////// recupération de tous les patients à voir pour le jour :

router.get('/allPatients', (req, res) => {
    Patient.find({officeToken: req.body.officeToken}).then(data => {
         const allPatientsToSee =  data.filter(patient => patient.treatments.date === req.body.dateOfToday);
         res.json({result: true, patientsToSee: allPatientsToSee})
    })

})



///////////// récupération d'un patient :

router.get('/patient/:_id', (req,res) => {
    Patient.findById({_id: req.params._id}).then(data => {
        res.json({result: true, patient: data})
        
    })
})

//Random patient



module.exports = router;