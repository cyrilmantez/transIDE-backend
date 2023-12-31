const request = require('supertest');
const app = require('../app');


/// Transmissions GET ALL OF DAY
it('GET/transmissions/allTransmissions', async () => {
 const res = await request(app).get('/transmissions/allTransmissions/vdDiOxapy8T3uUGLmyEy-jG6shv6qyQJ/Sun Dec 17 2023 14:32:00 GMT+0100');

 console.log(res.body.transmissions.length);
 console.log(res.body);

 expect(res.statusCode).toBe(200);
 expect(res.body.result).toEqual(true);
});

