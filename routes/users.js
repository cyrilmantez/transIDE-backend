var express = require('express');
var router = express.Router();

require('../models/connection');
const User = require('../models/users');
const { checkBody } = require('../modules/checkBody');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');

router.post('/signup', (req, res) => {
  if (!checkBody(req.body, ['username', 'password', 'email', 'confirmPassword'])) {
    res.json({ result: false, error: 'Champs manquants ou vides' });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;
  if (!emailRegex.test(req.body.email)) {
    res.json({ result: false, error: 'Veuillez saisir une adresse e-mail valide.'});
    return;
  }
  if (!passwordRegex.test(req.body.password)) {
    res.json({ result: false, error: 'Le mot de passe doit contenir 10 caractères minimum, dont au moins un caractère spécial, une majuscule et une minuscule'});
    return;
  }
  if (req.body.password !== req.body.confirmPassword) {
    res.json({ result: false, error: 'Les mots de passe ne correspondent pas. Dommage...'});
    return;
  }

  // Verify if user is already registered (by username and by email)
  User.findOne({ username: req.body.username }).then(data => {
    if(data){
      res.json({ result: false, error: 'L\'utilisateur existe déjà, utilisez un autre nom d\'utilisateur' });
    } else {
      User.findOne({ email: req.body.email }).then(data => {
        if(data){
          res.json({ result: false, error: 'L\'utilisateur existe déjà, utilisez une autre adresse e-mail' });
        } else {
          const hash = bcrypt.hashSync(req.body.password, 10);

          const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hash,
            token: uid2(32),
            officesToken: [{
              name: `Cabinet de ${req.body.username}`,
              token: uid2(32),
              isByDefault: true,
            }],
          });

          newUser.save().then(newDoc => {
            res.json({ result: true, token: newDoc.token, officesToken: newDoc.officesToken });
          }).catch(err => {
            res.json({ result: false, error: 'Erreur lors de l\'enregistrement de l\'utilisateur dans la base de données' });
          });
        }
      }).catch(err => {
        res.json({ result: false, error: 'Erreur lors de la vérification de l\'existence de l\'e-mail' });
      });
    }
  }).catch(err => {
    res.json({ result: false, error: 'Erreur lors de la vérification de l\'existence du nom d\'utilisateur' });
  });
});


router.post('/signin', (req, res) => {
  if (!checkBody(req.body, ['username', 'password'])) {
    res.json({ result: false, error: 'Merci de renseigner les champs de saisie' });
    return;
  }
  User.findOne({ username: req.body.username }).then(data => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, token : data.token, officesToken : data.officesToken});
    } else {
      res.json({ result: false, error: 'Utilisateur et/ou mot de pass incorrect' });
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

//ROUTE DE TEST POUR RECUPERER TOUS LES USERS POUR UN CABINET
router.put('/usersByOffice', (req, res) => {
  const token = req.body.token
  User.find({'officesToken.token' : token}).then((data) => {
    if (data.length>0){
      const nurses = data.map(e => e = {username: e.username});
    console.log(nurses);
      res.json({result : true, nurses: nurses})
    }else{
      res.json({error : 'nurse not find'})
    }
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
