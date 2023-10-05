require('dotenv').config(); // su dung thu vien doc file env
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var prodRouter = require('./routes/products');
var apiRouter = require('./routes/api');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(session({
  secret: process.env.KEY_SESSION,
  resave: true,
  saveUninitialized: true,
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', prodRouter);
app.use('/api', apiRouter);


//helpes
app.locals.sortable = function (field, sort) {

  const sortType = field === sort.column ? sort.type : 'default';

  const colors = {
    default: 'text-white',
    1: 'text-success',
    '-1': 'text-white',
  }

  const types = {
    default: '1',
    '1': '-1',
    '-1': '1',
  }

  const color = colors[sortType]
  const type = types[sortType]

  return `<a href="?_sort&column=${field}&type=${type}">
  <span class="${color}  ms-1"><i class="fa-solid fa-sort"></i></span>
  </a>`;
}


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


  if (req.originalUrl.indexOf('/api') == 0) {
    res.json(
      {
        status: 0,
        msg: err.message
      }
    );
  } else {
    res.render('error');
  }
});

module.exports = app;
