/* This is where it all begins */
var express  = require('express');
var app      = express();
var mongoose = require('mongoose');
var passport = require('passport');
var hogan    = require('hogan-express');
var favicon  = require('serve-favicon');
var morgan   = require('morgan');
var path     = require('path');

var bodyParser   = require('body-parser');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var flash        = require('connect-flash');

var configDB = require('./config/database.js');

mongoose.connect(configDB.socket);

/* Load Passport config */
require('./config/passport')(passport);

/* Configure Application */
app.set('port', process.env.port || 3000);
app.set('view engine', 'html');
app.set('layout', 'layout');
app.engine('html', hogan);
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components', express.static(path.join(__dirname, 'bower_components')));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(session({secret: 'Swaglord69'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

/* Load custom middleware */
require('./app/restrict')(app);

/* Load application routes */
require('./app/routes')(app, passport);

/* Handle 404 */
app.use(function(req, res, next) {
    var err = new Error('Not Found!');
    err.status = 404;
    next(err);
});

/* Handle errors at the end of the chain */
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
});

app.listen(3000, function() {
    console.log('Starting on port 3000');
});