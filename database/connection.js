const mongoose = require('mongoose');
const key =require('../config/key')
mongoose.Promise=global.Promise;
mongoose.connect(key.mongoURL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
     useFindAndModify: false 
  })
  .then(()=>console.log('connected successfully'))
  .catch(err=>console.log(err))