var express = require('express');
var router = express.Router();

require('../models/connection');
const Patient = require('../models/patients');
const { checkBody } = require('../modules/checkBody');

router.get('/allTransmissions/:date',(req, res) => {
    const requestDate = new Date(req.params.date)
    Patient.find({'transmissions.date':{$gt:requestDate}}).then(data => {
        console.log(data);
       if (data.length>0) {
              const transmissionsArray = data.map(patient => patient = {
                name : patient.name,
                firstname: patient.firstname,
                transmissions: patient.transmissions.filter(e => e.date > requestDate)})
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
//"date": "2023-12-12T12:39:00.000Z"
router.post('/addtransmission', (req, res) => {
    const {date, nurse, info, _id, document} = req.body
    const newTransmission =
    {
        date,
        nurse,
        info,
        document,
    }
    Patient.updateOne({_id}, {transmissions : [...transmissions,newTransmission]}).then(() => {
        if(document){
            Patient.updateOne({_id},{documents:[...documents,document]}).then(() => console.log('ok'))
        }
        res.json({result:true})
    }).catch(error => {
        // Gérer les erreurs liées à la recherche dans la base de données
        console.error(error);
        res.status(500).json({ result: false, error: 'Internal server error' });
      });
})


module.exports = router;