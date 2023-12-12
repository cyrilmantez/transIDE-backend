const request = require('supertest');
const app = require('../app');


//////////// création patient :

it('POST/patients/addPatient', async () => {
    const res = await request(app).post('/patients/addPatient').setEncoding({
        name: 'miro',
        firstname: 'marcel',
        address: {
            road: '28 allée du vide',
            city : 'Lille'
        }
     });;
   
    expect(res.statusCode).toBe(200);
    expect(res.body.result).toEqual(true);
   });


///////////// route get/allPatients :

it('GET/allPatients/:dateOfToday', async () => {

    const dateOfToday = '27/12/2023';

    const res = await request(app).get(`/allPatients/${dateOfToday}`);
   
    expect(res.statusCode).toBe(200);
    expect(res.body.result).toEqual(true);
   });


/////////////////   



