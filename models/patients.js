const mongoose = require('mongoose');

const patientSchema = mongoose.Schema({
    officeToken: String,
    name: String,
    firstname: String,
    yearOfBirthday : String,
    address: String,
    infosAddress : String,
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
        info : String,
        document: String,
    }],
    disponibility: Boolean,
    inCaseOfEmergency : [{
        identity: String,
        phoneNumber: String,
    }]

})

const Patient = mongoose.model('patients', patientSchema);

module.exports = Patient;
