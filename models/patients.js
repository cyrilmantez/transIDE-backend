const mongoose = require('mongoose');



///////// sous sous document: documents liés à une consultation 
const documentsOfTreatmentSchema = mongoose.Schema({
    creationDate: Date,
    urls: [String]
});  


//////////: sous document: consultation :
const treatmentsSchema = mongoose.Schema({
    isVisited : Boolean,
    isOk: Boolean,
    isModified: Boolean,
    date : Date,          /*avec heure*/
    actions: [String],
    nurse: String,
    documentsOfTreatment: [documentsOfTreatmentSchema],
   });


//////////// sous document: transmissions :
 const transmissionsSchema = mongoose.Schema({
    date: Date,
    nurse : String,
    info : String,
    UrlDocument: String,
 });  

 
 ////////////sous document : documents patients :
 const documentsSchema = mongoose.Schema({
    creationDate: Date,
    url: String
 });  




const patientSchema = mongoose.Schema({
    officeToken: String,
    name: String,
    firstname: String,
    yearOfBirthday : String,
    address: String,
    infosAddress : String,
    homePhone : String,
    mobile: String, 
    treatments: [treatmentsSchema],
    documents : [documentsSchema],
    transmissions: [transmissionsSchema ],
    disponibility: Boolean,
    ICEIdentity: String,
    ICEPhoneNumber: String,
  

})

const Patient = mongoose.model('patients', patientSchema);

module.exports = Patient;
