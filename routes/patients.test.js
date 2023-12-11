const request = require('supertest');
const patients = require('./patients');


it('GET/patients', async () => {
    const res = await request(app).get('/patients');
   
    expect(res.statusCode).toBe(200);
    expect(res.body.stock).toEqual(['iPhone', 'iPad', 'iPod']);
   });