var express = require('express');
var router = express.Router();

require('../models/connection');
const Patient = require('../models/patients');
const { checkBody } = require('../modules/checkBody');

router.get('/allTransmissions',(req, res) => {
    Patient.find({transmissions : {date : req.body.date}}).then(data => {
        if (data.length>0) {
              const transmissionsArray = data.map(e => e === e.transmissions)
              res.json({result:true, transmissions : transmissionsArray})
        }else{
            res.json({result:false, error : 'no transmission for this date'})
        }
        })
    })

router.post('/addtransmission', (req, res) => {
    (date, nurse, info, patient, document) = req.body

    {
        date: Date,
        nurse : String,
        info : String
    }
})