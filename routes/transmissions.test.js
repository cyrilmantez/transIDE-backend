const request = require('supertest');
const app = require('../app');


/// Transmissions GET ALL OF DAY
it('GET/transmissions/allTransmissions', async () => {
 const res = await request(app).get('/transmissions/allTransmissions');

 expect(res.statusCode).toBe(200);
 expect(res.body.result).toEqual(true);
});

/// Transmissions PUT newTransmission
it('POST/transmissions/addTransmissions', async () => {
    const res = (await request(app).post('/transmissions/addTransmissions')).setEncoding({
        date : '27/11/2023',
        nurse : 'cyril',
        info : 'piqûre'
    });
   
    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(true);
   });
   
