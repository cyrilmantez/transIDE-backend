var express = require('express');
var router = express.Router();

require('../models/connection');
const Patient = require('../models/patients');
const { checkBody } = require('../modules/checkBody');



/////////// création d'un patient :

router.post('/addPatient', (req,res) => {

    if (!checkBody(req.body, ['name', 'firstname', 'address'])) {
        res.json({ result: false, error: 'Missing or empty fields' });
        return;
    };

    const newPatient = new Patient ({
        officeToken: req.body.officeToken,
        //officeToken: 'vdDiOxapy8T3uUGLmyEy-jG6shv6qyQJ',
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
            //date: req.body.treatmentDate,
            date: new Date('2023-11-13T16:00'),
            //actions: [req.body.actions],
            actions: ['req.body.actions','req.body.actions'],
            //nurse: req.body.username,
            nurse: 'req.body.username',
            /*documentsOfTreatment: [{
                creationDate: req.body.creationDateOfDocumentsOfTreatment,
                urls: [req.body.urlsOfDocumentsOfTreatment]
            }],*/
            documentsOfTreatment: [{
                creationDate: new Date('2023-12-12'),
                urls: ['req.body.urlsOfDocumentsOfTreatment','req.body.urlsOfDocumentsOfTreatment']
            }],
        }],
        /*documents: [{
            creationDate: req.body.creationDateOfDocument,
            url: req.body.urlOfDocument
        }],*/
        documents: [{
            creationDate: new Date('2023-12-10'),
            url: 'req.body.urlOfDocument',
        }],       
        /*transmissions: [{
                date: req.body.transmissionDate,
                nurse : req.body.username,
                info : req.body.info,
                urlDocument: req.body.urlDocument,    
        }],*/
        transmissions: [{
            date: new Date('2023-12-11T13:39'),
            nurse : 'req.body.username',
            info : 'req.body.info',
            urlDocument: 'req.body.urlDocument',    
        }, {
        date: new Date('2023-12-12T17:39'),
        nurse : 'req.body.username',
        info : 'req.body.info',
        urlDocument: 'req.body.urlDocument',    
        },{
        date: new Date('2023-12-14T09:39'),
        nurse : 'req.body.username',
        info : 'req.body.info',
        urlDocument: 'req.body.urlDocument',    
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
    
    ///////// traitement de la date envoyée :  
    const newDate = new Date(req.body.dateOfToday);
    const targetDate = newDate.getDate();
    const targetMonth = newDate.getMonth() + 1;
    const targetYear = newDate.getFullYear();

    Patient.find({officeToken: req.body.officeToken}).then(data => {
        let allPatientsToSee = [];
        for (const patient of data){
            let allTreatments = patient.treatments
            for (let i=0; i<allTreatments.length; i++) {

    ///////// traitement de la date trouvée :  

                const jour = allTreatments[i].date.getDate();
                const mois = allTreatments[i].date.getMonth()+1;
                const annee = allTreatments[i].date.getFullYear();

    //////// comparaison des dates :
                if (annee === targetYear && jour === targetDate && mois === targetMonth){
                    const minutes = allTreatments[i].date.getMinutes();
                    const hours = allTreatments[i].date.getHours()-1;
    
                    const formattedMinutes = String(minutes).padStart(2, '0');
                    const formattedHours = String(hours).padStart(2, '0');

    /////////// création de l'objet retourné par date correspondante :
                    const infosToHave = {
                        _id: patient._id,
                        name : patient.name,
                        firstname : patient.firstname,
                        hour: `${formattedHours}:${formattedMinutes}`,
                        actions: allTreatments[i].actions,
                        address : patient.address,
                        infosAddress: patient.infosAddress,
                        treatmentState: allTreatments[i].state,
                    } 
                    allPatientsToSee.push(infosToHave)
                }
            }
        }
       res.json({result: true, patientsToSee: allPatientsToSee})
    });

});


///////////// récupération d'un patient :

router.get('/patient/:_id', (req,res) => {
    Patient.findById({_id: req.params._id}).then(data => {
        res.json({result: true, patient: data})
        
    })
})



module.exports = router;