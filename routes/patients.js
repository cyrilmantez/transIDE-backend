var express = require('express');
var router = express.Router();

require('../models/connection');
const Patient = require('../models/patients');
const { checkBody } = require('../modules/checkBody');



/////////// création d'un patient :

router.post('/addPatient', (req,res) => {

    if (!checkBody(req.body, ['name', 'firstname', 'road', 'city'])) {
        res.json({ result: false, error: 'Missing or empty fields' });
        return;
    };

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
            date: req.body.treatmentDate,
            actions: [req.body.actions],
            nurse: req.body.username,
            documentsOfTreatment: [{
                creationDate: req.body.creationDateOfDocumentsOfTreatment,
                urls: [req.body.urlsOfDocumentsOfTreatment]
            }],
        }],
        documents: [{
            creationDate: req.body.creationDateOfDocument,
            url: req.body.urlOfDocument
        }],    
        transmissions: [{
                date: req.body.transmissionDate,
                nurse : req.body.username,
                info : req.body.info,
                urlDocument: req.body.urlDocument,    
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



module.exports = router;