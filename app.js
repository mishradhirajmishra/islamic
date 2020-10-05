var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const fileUpload = require('express-fileupload'); 
var veryfyToken = require('./config/jwt-werify');
require('./database/connection');

var app = express();
app.use(fileUpload()); 
app.use(cors());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');
app.set('view engine', 'html');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


// app.use('/', require('./routes/home-router'));
app.use('/auth', require('./routes/auth-router'));
app.use('/service',veryfyToken, require('./routes/service-router'));
app.use(express.static(path.join(__dirname, 'public')));
// app.get('*',(req,res)=>{
//   res.sendFile(path.join(__dirname, 'public/index.html'))
// });
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
