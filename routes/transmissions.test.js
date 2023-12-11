const request = require('supertest');
const app = require('../app');


/// Transmissions GET ALL OF DAY
it('GET/transmissions/allTransmissions', async () => {
 const res = await request(app).get('/transmissions/allTransmissions');

 expect(res.statusCode).toBe(200);
 expect(res.body.result).toEqual(true);
});
