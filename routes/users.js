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
          name : `officeOf${req.body.username}`,
          token : uid2(32),
          isByDefault : true,
        }]
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

module.exports = router;
