var jwt = require('jsonwebtoken');
var key = require('./key')
module.exports = (req, res, next)=> {
    if (!req.headers.authorization) {
      return res.status(401).send('Unautharised Access')
    } else {
      let token = req.headers.authorization.split(' ')[1];
      console.log(token)
      if (token == 'null') {
        return res.status(401).send('Unautharised Access')
      } else {
        jwt.verify(token, key.secretkey, function (err, decoded) {        
          if (decoded) {
            next();
          } else {
            return res.status(401).send('Unautharised Access')
          }
        });
      }
  
    }  
  
  }