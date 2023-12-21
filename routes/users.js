var express = require('express');
var router = express.Router();

require('../models/connection');
const User = require('../models/users');
const { checkBody } = require('../modules/checkBody');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');


router.post('/signup', (req, res) => {
  if (!checkBody(req.body, ['username', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }
  // Check if the user has not already been registered
  User.findOne({ username: req.body.username }).then(data => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hash,
        token: uid2(32),
        officesToken : [{
          name : `Cabinet de ${req.body.username}`,
          token : uid2(32),
          isByDefault : true,
        }],
        colorMode: false,
      });
      newUser.save().then(newDoc => {
        res.json({ result: true, token: newDoc.token, officesToken : newDoc.officesToken });
      });
    } else {
      res.json({ result: false, error: 'User already exists, use an other username' });
    }
  });
});


router.post('/signin', (req, res) => {
  if (!checkBody(req.body, ['username', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }
  User.findOne({ username: req.body.username }).then(data => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, token : data.token, officesToken : data.officesToken});
    } else {
      res.json({ result: false, error: 'User not found or wrong password' });
    }
  });
});



//ROUTE DE TEST POUR SUPPRIMER UN USER
router.delete('/delete', (req, res) => {
  User.deleteOne({ username: req.body.username }).then(() => {
    User.findOne({username: req.body.username}).then(data => {
      if(!data){
        res.json({result : 'user deleted'})
      }else{
        res.json({result : 'error'})
      }
    })
  });
});


//ROUTE DE TEST POUR RECUPERER TOUS LES USERS
router.get('/', (req, res) => {
  User.find().then((data) => {
    res.json({result : data})
  });
});

//ROUTE POUR MODIFIER LE TABLEAU DES OFFICESTOKENS
router.put('/newOfficesToken', (req, res)=> {
  const {token, officesTokens, officeByDefault} = req.body;
  console.log('by default :', officeByDefault);
  User.updateOne({token : token},{officesToken: officesTokens}).then(data => {
    if(data.matchedCount === 1){
      User.find({'officesToken.token' : officeByDefault}).then(data => {
        console.log(data);
        const allIDE = data.map(e => e = {username : e.username});
        console.log('allIDE' , allIDE);
          res.json({result : true, allIDE})
      })
    }else{
      res.json({error : false})
    }
  })
})

//ROUTE POUR AJOUTER UN NOUVEL OFFICE (CABINET)
router.post('/newOffice', (req, res)=> {
  const {officeToken, token} = req.body;
  User.findOne({'officesToken.token':officeToken}).then(data => {
    console.log(data);
    if(data){
      const newOffice = data.officesToken.filter(e => e.token === officeToken);
      newOffice[0].isByDefault = false;
      User.findOne({token:token}).then(data => {
        if(data){
          const newOfficesTokens = [...data.officesToken, newOffice[0]];
          User.updateOne({token:token},{officesToken : newOfficesTokens}).then(() => {
              res.json({result : true, newOffice : newOffice[0]});
          })
        }else{
          res.json({error : false});
        }
      })
    }else{
      res.json({error : false})
    }
  })
})


module.exports = router;
