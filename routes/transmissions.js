var express = require('express');
var router = express.Router();

require('../models/connection');
const Patient = require('../models/patients');
const { checkBody } = require('../modules/checkBody');

router.get('/allTransmissions/:token/:date',(req, res) => {
    const requestDate = new Date(req.params.date)
    requestDate.setHours(1, 0, 0, 0);
    console.log(requestDate)
    Patient.find({'transmissions.date':{$gt:requestDate}}).then(data => {
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