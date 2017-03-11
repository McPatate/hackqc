var express       = require('express');
var path          = require('path');
var favicon       = require('serve-favicon');
var mongoose      = require('mongoose');
var logger        = require('morgan');
var cookieParser  = require('cookie-parser');
var bodyParser    = require('body-parser');
var http          = require('http');
var xml2js        = require('xml2js');

var index         = require('./routes/index');
var users         = require('./routes/users');
var bacs         = require('./routes/bacs');

var db            = require('./config/db');
var Travaux       = require('./models/travaux');

var app = express();

//insert crone
var schedule = require('node-schedule');

var j = schedule.scheduleJob('* * * * * *', function(){
  var parser = new xml2js.Parser();
  http.get("http://www.quebec511.info/donneespubliques/entraves.ashx?format=xml", function (res)  {
      if (res.statusCode == 200) {
          res.setEncoding('utf8');
          rawData = '';
          res.on('data', function (chunk) {
              rawData += chunk
          });
          res.on('end', function () {
            console.log("In END");
              try {
                  parser.parseString(rawData, function (err, result) {
                      var array = [];
                      result.chantiers.chantier.forEach(function (el) {
                          array.push({
                            position: {lat: el.Latitude[0], lon: el.Longitude[0]},
                              isMaj: (el.EntraveType[0]).startsWith("majeure"),
                              debut: new Date(el.Debut[0]),
                              fin: new Date(el.Fin[0])
                          });
                      });
                      Travaux.remove({}, function(err) { if (err) console.error(err); });
                      Travaux.create(array);
                  });
              } catch (e) {
                  console.error(e);
              }
          });
      }

  }).on('error', function (e)  {
    console.error(e);
  });
});


mongoose.connect(db.url);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/bacs', bacs);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
