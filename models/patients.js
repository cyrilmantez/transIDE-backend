const mongoose = require('mongoose');

const patientSchema = mongoose.Schema({
    officeToken: String,
    name: String,
    firstName: String,
    yearOfBirthday : Date,
    address: {
        road: String,
        postalCode: Number,
        town: String,
        infos : String
        },
    phoneNumbers: [{
        home: String,
        mobile: String
    }],    
    treatment: [{
        state : Boolean,
        date : Date,          /*avec heure*/
        actions: [String],
        nurse: String,
        documentsOfTreatment: [{
            creationDate: Date,
            urls: [String]
        }],
    }],
    documents : [{
        creationDate: Date,
        urls: [String]
    }],
    transmissions: [{
        date: Date,
        nurse : String,
        info : String
    }],
    disponibility: Boolean,
    inCaseOfEmergency : [{
        identity: String,
        phoneNumber: String,
    }]

})

const Patient = mongoose.model('patients', patientSchema);

module.exports = Patient;
