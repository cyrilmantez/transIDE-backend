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
        //officeToken: req.body.officeToken,
        officeToken: 'vdDiOxapy8T3uUGLmyEy-jG6shv6qyQJ',
        name: req.body.name,
        firstname: req.body.firstname,
        yearOfBirthday : req.body.dateOfBirthday,
        address: req.body.address,
        //infosAddress : req.body.infosAddress,
        infosAddress : 'req.body.infosAddress',
        //homePhone : req.body.homePhone,
        homePhone : 'req.body.homePhone',
        //mobile: req.body.mobile
        mobile: 'req.body.mobile',
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
        //ICEIdentity: req.body.ICEIdentity,
        ICEIdentity: 'req.body.ICEIdentity',
        //ICEPhoneNumber: req.body.ICEPhoneNumber,
        ICEPhoneNumber: 'req.body.ICEPhoneNumber',
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

router.post('/allPatients', (req, res) => {
    Patient.find({officeToken: req.body.officeToken}).then(data => {
        const newDate = new Date(req.body.dateOfToday);
        const newDateBefore = newDate.setHours(1,0,0,0);
        const newDateLater = newDate.setHours(25,0,0,0);
        let allPatientsToSee;
        
        for (const patient in data){
            allTreatments = patient.treatments
            for (let i=0; i<allTreatments.length; i++) {
                if (allTreatments[i].date <= newDateLater && allTreatments[i].date >= newDateBefore) {
                    allPatientsToSee.push(patient)
                }
            }
        }
        res.json({result: true, patientsToSee: allPatientsToSee})

    //     const allPatientsToSee =  data.filter(patient => 
    //         patient.treatments[0].date < newDateLater && patient.treatments[0].date >= newDateBefore);
    //      res.json({result: true, patientsToSee: allPatientsToSee})
    })

});


///////////// récupération d'un patient :

router.get('/patient/:_id', (req,res) => {
    Patient.findById({_id: req.params._id}).then(data => {
        res.json({result: true, patient: data})
        
    })
})

//Random patient



module.exports = router;