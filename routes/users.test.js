const request = require('supertest');
const app = require('../app');
const bcrypt = require('bcrypt');


/// Users SIGNUP
it('POST/users/signup', async () => {
 const res = await request(app).post('/users/signup').send({
    username : 'Titi123',
    email: 'titi@gmail.com',
    password: 'Password!!!',
    confirmPassword: 'Password!!!',

 });

 expect(res.statusCode).toBe(200);
  expect(res.body.result).toEqual(true);
  expect(res.body.token).toBeDefined();
  expect(res.body.officesToken).toBeDefined();
});





/// Users SIGNIN
it('POST /users/signin', async () => {
    const res = await request(app).post('/users/signin').send({
       username : 'Titi123',
       password: 'Password!!!',
    });
 
    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(true);
    expect(res.body.token).toBeDefined();
   expect(res.body.officesToken).toBeDefined();
   });


   ///DELETE USER
   it('DELETE /users/delete', async () => {
      const res = await request(app).delete('/users/delete').send({
         username : 'Titi123',
      });
   
      expect(res.statusCode).toBe(200);
      expect(res.body.result).toBe(true);
      expect(res.body.message).toBe('user deleted');
   })

   ///FIND ALL USERS
   it('GET /users/', async () => {
      const res = await request(app).get('/users/');
     
      expect(res.statusCode).toBe(200);
      expect(res.body.result).toBe(true);
   })

   ///OfficeByDefault Modification
   it('PUT /users/newOfficeByDefault', async () => {
      const res = await request(app).put('/users/newOfficeByDefault').send({
         token :'xmJECaMYz21ELei0Biu8g3BU7L6sIMPL',
         officesTokens: [{
                  name:'Cabinet de Titi123',
                  token:'XzQuJZZuhjYURZaw17PosMvq0dQ4Qd5n',
                  isByDefault:false,
               },
               {
                  name:'Cabinet de JamesTrivette',
                  token:'-3V0c-zGigaRNH9gKlsdbuLYHQJI_1Yg',
                  isByDefault:true,
               }],
         officeByDefault:'-3V0c-zGigaRNH9gKlsdbuLYHQJI_1Yg',
      });
      console.log(res.body);

      expect(res.statusCode).toBe(200);
      expect(res.body.result).toBe(true);
      expect(res.body.allIDE.length).toBeGreaterThanOrEqual(1);
     });
   