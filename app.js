var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//passport 
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;

var cors = require("cors");
//////////////////////////Swagger Setup//////////////////////////
var swaggerUI = require("swagger-ui-express");
var swaggerJSDoc = require("swagger-jsdoc");
var options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Football Teams API",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:3000",
      }
    ]
  },
  apis: ["./routes/**/*.js"], // paths to files containing annotations
}
var swaggerSpec = swaggerJSDoc(options);
//////////////////////////End of Swagger Setup//////////////////////////

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var footballTeamsRouter = require('./routes/football/footballteams');
var playersRouter = require('./routes/football/players');

var configs = require('./config/global');
var mongoose = require('mongoose');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

//////////////////////////Passport Configuration//////////////////////////
// Basic HTTP Authentication strategy
passport.use(new BasicStrategy((username, password, done) => {
  // eduardojaime:football@123 encoded as ZWR1YXJkb2phaW1lOmZvb3RiYWxsQDEyMw==
  
  if (username == 'eduardojaime' && password == 'football@123') {
    console.log(`User ${username} authenticated successfully!`)
    return done(null, username);
  }
  else {
    console.log(`Authentication failed for user ${username}`)
    return done(null, false);
  }
}));

//////////////////////////End of Passport Configuration//////////////////////////
app.use(cors());
app.use("/docs/dynamic", swaggerUI.serve, swaggerUI.setup(swaggerSpec));





app.use('/', indexRouter);

app.use('/football-teams', passport.authenticate('basic', { session: false }), footballTeamsRouter);
app.use('/players', passport.authenticate('basic', { session: false }), playersRouter);

app.use('/users', usersRouter);
//app.use('/football-teams', footballTeamsRouter);
//app.use('/players', playersRouter);

mongoose.connect(configs.connectionString.MongoDB)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  }); 

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

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
