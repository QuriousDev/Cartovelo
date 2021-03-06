var issues_router     = require('./routes/issues')
var paths_router = require('./routes/paths')
var users_router = require('./routes/users')
var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  next();
});

var port = process.env.PORT || 3000;

app.use('/api', issues_router);
app.use('/api', paths_router);
app.use('/api', users_router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  console.log(err);
  res.json({error: err.message, message: err});
});

app.listen(port);
console.log('Server started on port : ' + port);
