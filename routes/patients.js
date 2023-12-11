var express = require('express');
var router = express.Router();

require('../models/connection');
const Patient = require('../models/patients');
const { checkBody } = require('../modules/checkBody');

/////////// création d'un patient :

router.post('addPatient', (req,res) => {

    if (!checkBody(req.body, ['name', 'firstname'])) {
        res.json({ result: false, error: 'Missing or empty fields' });
        return;
    };

    const newPatient
})


/////////// modification d'un patient :


//////////// suppression d'un patient :


///////////// recupération de tous les patients à voir par jour :


///////////// récupération d'un patient :




