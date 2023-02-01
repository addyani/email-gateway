var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
require('dotenv').config();
const db = require("./models");

var indexRouter = require('./routes/index');
var schedulerRouter = require('./routes/scheduler');
var authRouter = require('./routes/auth');
var companyRouter = require('./routes/company');
var contactRouter = require('./routes/contact');
var importExcelRouter = require('./routes/importExcel');
var mailboxRouter = require('./routes/mailbox');
var mailboxSchedulerRouter = require('./routes/mailboxScheduler');
var mailboxTemplateRouter = require('./routes/mailboxTemplate');
var sendEmailRouter = require('./routes/sendEmail');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.EXPRESS_SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

db.sequelize
  .sync()
  .then(() => {
    console.log("sync db");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use('/', indexRouter);
app.use('/scheduler', schedulerRouter);
app.use('/authorize', authRouter);
app.use('/company', companyRouter);
app.use('/contact', contactRouter);
app.use('/import-excel', importExcelRouter);
app.use('/mailbox', mailboxRouter);
app.use('/mailbox-scheduler', mailboxSchedulerRouter);
app.use('/mailbox-template', mailboxTemplateRouter);
app.use('/send-email', sendEmailRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
