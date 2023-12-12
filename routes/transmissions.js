var express = require('express');
var router = express.Router();

require('../models/connection');
const Patient = require('../models/patients');
const { checkBody } = require('../modules/checkBody');

router.get('/allTransmissions',(req, res) => {
    Patient.find({transmissions : {date : req.body.date}}).then(data => {
        if (data.length>0) {
              const transmissionsArray = data.map(e => e === e.transmissions)
              res.json({result:true,transmissions : transmissionsArray})
        }else{
            res.json({result:false, error : 'no transmission for this date'})
        }
        })
    })

router.post('/addtransmission', (req, res) => {
    const {date, nurse, info, _id, document} = req.body
    const newTransmission =
    {
        date,
        nurse,
        info,
    }
    Patient.updateOne({_id}, {transmissions : [...transmissions, newTransmission]}).then(() => {
        if(document){
            Patient.updateOne({_id},{documents:[...documents,document]}).then(() => console.log('ok'))
        }
        res.json({result:true})
    })
})


module.exports = router;