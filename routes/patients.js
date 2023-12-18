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
        officeToken: req.body.officeToken[0].token,
        //officeToken: 'vdDiOxapy8T3uUGLmyEy-jG6shv6qyQJ',
        name: req.body.name,
        firstname: req.body.firstname,
        yearOfBirthday : req.body.yearOfBirthday,
        address: req.body.address,
        infosAddress : req.body.infosAddress,
        homePhone : req.body.homePhone,
        mobile: req.body.mobile,
        treatments:[{
            isVisited : false,
            isOk: false,
            isOkWithModification: false,
            date: req.body.treatments[0].date,
            actions: req.body.treatments[0].actions,
            nurse: req.body.treatments[0].nurse,
            documentsOfTreatment: [{
                creationDate: req.body.treatments[0].documentsOfTreatment[0].creationDate,
                urls: [req.body.treatments[0].documentsOfTreatment[0].url]
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





////////////// ajouter une consultation à un patient :

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
    const newDate = new Date(req.body.dateOfToday);
    const targetDate = newDate.getDate();
    const targetMonth = newDate.getMonth() + 1;
    const targetYear = newDate.getFullYear();

    Patient.find({officeToken: req.body.officeToken}).then(data => {
        let allPatientsToSee = [];
       // console.log(data)
        for (const patient of data){
        
            let allTreatments = [...patient.treatments]

        //console.log('allTreatments', allTreatments)
            for (let i=0; i<allTreatments.length; i++) {
                //console.log('allTreatments', allTreatments[i])
                // Vérifiez si la date existe avant d'essayer d'accéder à ses propriétés
                if (allTreatments[i] && allTreatments[i].date) {
                    const jour = allTreatments[i].date.getDate();
                    const mois = allTreatments[i].date.getMonth()+1;
                    const annee = allTreatments[i].date.getFullYear();

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
                        mobile: patient.mobile,
                        homePhone: patient.homePhone,
                        isVisited : allTreatments[i].isVisited,
                        isOk: allTreatments[i].isOk,
                        isOkWithModification: allTreatments[i].isOkWithModification,
                        _idTreatment: allTreatments[i]._id,
                        date: allTreatments[i].date,
                        documentsOfTreatment: allTreatments[i].documentsOfTreatment
                    } 
                    allPatientsToSee.push(infosToHave)
                }
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

//////All patient : 
router.get('/allPatients/:token', (req, res) => {
    Patient.find({officeToken : req.params.token}).then(data => {
        console.log(data)
        const allPatients = [];
        for (let element of data) {
            allPatients.push({
                name : element.name,
                firstname : element.firstname,
                yearOfBirthday: element.yearOfBirthday,
            }) 
        }
      res.json({result : true, Patients : allPatients});
    });
   });


////////////update treatment :
router.put('/updateTreatment', (req, res) => {
    Patient.findById({_id: req.body._id}).then(data => {
       
        const newData = data.treatments.map(treatment => {
            const tempTreatment = {}
            //console.log(treatment._id, req.body._idTreatment)
           // console.log(tempTreatment, req.body._idTreatment)
            if (treatment._id.toString() === req.body._idTreatment.toString()) {
                console.log('ok')
                    tempTreatment.isVisited = req.body.isVisited;
                    tempTreatment.isOk= req.body.isOk;
                    tempTreatment.isOkWithModification= req.body.isOkWithModification;
                    tempTreatment.date = req.body.date;
                    tempTreatment.actions= req.body.actions;
                    tempTreatment.nurse= req.body.nurse;
                    tempTreatment.documentsOfTreatment= req.body.documentsOfTreatment;
               
            }
            return tempTreatment
        })
        Patient.updateOne({_id : data._id}, {treatments: newData}).then(data => {
            res.json({result : true, modification: data})
        });    
    
    });
});


//////////////// ne pas supprimer svp
router.get('/allPatientDay', (req, res) => {
    Patient.find().then(data => {
    res.json({ allPatient: data });
    });
    });


module.exports = router;