var createError = require("http-errors");
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');


var roomiesRouter = require('./routes/roomies');
var answersRouter = require('./routes/answers');
var userImagesRouter = require('./routes/userimages');

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/roomies', roomiesRouter);
app.use('/api/answers', answersRouter);
app.use('/api/userimages', userImagesRouter);



//serve static images from public/img
app.use(express.static("public"));

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, "client/dist")));


// Anything that doesn't match the above, send back index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/dist/index.html"));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send("error");
});

module.exports = app;
