const request = require('supertest');
const app = require('../app');


/// Users SIGNUP
it('POST/users/signup', async () => {
 const res = await request(app).post('/users/signup').send({
    username : 'Titi123',
    email: 'titi@gmail.com',
    password: 'C\'est un secret',
    token: 'ffrfrf',

 });
 expect(res.statusCode).toBe(200);
 expect(res.body.result).toEqual(true);
});

/// Users SIGNIN
it('POST /users/signin', async () => {
    const res = await request(app).post('/users/signin').send({
       username : 'Titi123',
       password: 'C\'est un secret',
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(true);
   });
