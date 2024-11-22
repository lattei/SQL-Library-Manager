var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

/* Created Routers and db variable */
var indexRouter = require('./routes/index');
var booksRouter = require('./routes/books');
var { sequelize } = require('./models');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/books', booksRouter);


/* IIFE Async Fn */
/*IIFE async */
(async () => {
  try {
    await sequelize.sync();
    console.log('Connection to the database successful.');
  } catch (error) {
    console.error('Error connecting to database: ', error);
  }
})();


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404, 'Sorry, the page you are looking for cannot be found!'));
});

// Global error handler modified to meet step 5
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  err.status === 400 ? res.render('page-not-found', { title: 'Page Not Found'}) : res.render('error', { title: 'Error!', error: err })
});


module.exports = app;
