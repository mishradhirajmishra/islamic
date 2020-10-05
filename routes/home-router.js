var express = require('express');
var router = express.Router();
var User = require('../model/User')
var Package = require('../model/Package')
var jwt = require('jsonwebtoken');
var key = require('../config/key');
const bcryptjs = require('bcryptjs');


router.get('/', function (req, res, next) {
  res.render('index',{title:'Home'})

});



module.exports = router;