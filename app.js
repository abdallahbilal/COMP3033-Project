var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var cors = require("cors");
// Packages for Documenting the API
var swaggerUI = require("swagger-ui-express");
// Comments approach
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
        url: "http://localhost:3000/football-teams",
      }
    ]
  },
  apis: ["./routes/football/*.js"], // paths to files containing annotations
}
var swaggerSpec = swaggerJSDoc(options);
// Load file from URL
// var specfileURL = "http://petstore.swagger.io/v2/swagger.json";
// var optionsForURL = {
//   swaggerOptions: {
//     url: specfileURL
//   }
// }

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
app.use(cors());
app.use("/docs/dynamic", swaggerUI.serve, swaggerUI.setup(swaggerSpec));



app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/football-teams', footballTeamsRouter);
app.use('/players', playersRouter);

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
