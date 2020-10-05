var express = require('express');
var router = express.Router();
var User = require('../model/User')
var jwt = require('jsonwebtoken');
var key = require('../config/key');
const bcryptjs = require('bcryptjs');
var veryfyToken = require('../config/jwt-werify');

router.post('/chkAuthariseUser',veryfyToken, function (req, res, next){
  res.status(200).json({ message: 'autharised'})
});

router.post('/login', function (req, res, next) {

user = User.findOne({ email: req.body.email })
  .then((user) => {
    if (!user) {
      res.status(201).json({ message: 'Email not found' ,token:'' ,type:'error'})
    }
    else {
      bcryptjs.compare(req.body.password, user.password, function (err, result) {
        if (err) { console.log(err) }
        if (result) {
          jwt.sign({id: user._id, firstName: user.firstName,lastName: user.lastName,phone: user.phone, email: user.email ,role: user.role}, key.secretkey,{ expiresIn: '24h' }, function (err, token) {
            res.status(201).json({ message: 'login successfully', token ,type:'success' });
          });
        } else {
          res.status(201).json({ message: 'Invalid Password',token:'',type:'error' })
        }
      });

    }
  }).catch(err => { res.json(err) })

});

router.post('/register', function (req, res, next) {
  const user = new User(req.body);
  bcryptjs.genSalt(10, (err, salt) => {
    bcryptjs.hash(user.password, salt, function (err, hash) {
      user.password = hash;
      user.save()
        .then((user) => {
          if (user) {
            res.status(200).json({ message: 'Registred successfully. Please check your email and verify password' ,type:'success' ,userDetail:user})
          }
          else {
            res.status(201).json({ message: 'Unable to register',type:'error' })
          }
        }).catch(err => {
          res.json(err)
        })

    })
  });

});

router.post('/emailExist', function (req, res, next) {
  user = User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        res.status(201).json({ exist:true, message: 'Email already registerd' , detail:user})
      }
      else {
        res.status(200).json({exist:false, message: '', detail:''})
      }
    }).catch(err => {
      res.json(err)
    })
});
router.post('/forgot', function (req, res, next) {
  user = User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        var pass=  user.password =Math.floor(Math.random() * 100000000);
          bcryptjs.genSalt(10, (err, salt) => { 
            bcryptjs.hash(user.password, salt, function (err, hash) {
             user.password = hash;
              User.findByIdAndUpdate(user._id,user)
              .then(()=>{
                res.status(201).json({ type:'success', message:'An email with recovery option has been sent to you.', detail: pass })
              }).catch(err => {
                res.json(err)
              })
            });
           });        
       }
      else {
        res.status(200).json({type:'error', message: 'Email not found' })
      }
    }).catch(err => {
      res.json(err)
    })

});
router.post('/change-password', function (req, res, next) {
  user = User.findOne({ _id: req.body.id })
  .then((user) => {
    if (!user) {
      res.status(201).json({ message: 'Somthing went wrong !' ,token:'' ,type:'error'})
    }
    else {
   
      bcryptjs.compare(req.body.oldPassword, user.password, function (err, result) {
        if (err) { 
          res.status(201).json({ message: 'Old Password does not match',token:'',type:'error' })
         }
        if (result) {
      
          bcryptjs.genSalt(10, (err, salt) => { 
            bcryptjs.hash(req.body.newPassword, salt, function (err, hash) {
             user.password = hash;
              User.findByIdAndUpdate(user._id,user)
              .then(()=>{             
                res.status(201).json({ message: 'Password updated successfully',type:'success' })
              }).catch(err => {
                res.json(err)
              })
            });
           });    



        } else {
          res.status(201).json({ message: 'Invalid Password',type:'error' })
        }
      });

    }
  }).catch(err => { res.json(err) })


});


module.exports = router;