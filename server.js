/* This is where it all begins */
var express  = require('express');
var app      = module.exports = express();
var mongoose = require('mongoose');
var passport = require('passport');
var hogan    = require('hogan-express');
var favicon  = require('serve-favicon');
var morgan   = require('morgan');
var path     = require('path');

var bodyParser   = require('body-parser');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var MongoStore   = require('connect-mongo')(session);
var flash        = require('connect-flash');
var scoreUtil    = require('./app/utils/score');
var bg           = require('./app/utils/background');

var Location = require('./app/models/location');
var config   = require('./config/config');
var remap    = require('./app/utils/remap');

/* Set server configuration */
app.set('config', config(process.argv.length == 3 && process.argv[2] === 'prod'));
if (process.argv.length != 3 && process.argv[2] !== 'prod') {
    app.use(require('connect-livereload')({
        port: 35729
    }));
}

mongoose.connect(app.get('config').socket);

/* Load Passport config */
require('./config/passport')(passport);

/* Configure Application */
app.set('port', process.env.PORT || 3000);
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

app.use(session({
    saveUninitialized : false,
    rolling : true,
    resave  : true,
    secret  : 'Swaglord69',
    cookie  : {
        expires : false,
        maxAge  : new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
    },
    store   : new MongoStore({mongooseConnection: mongoose.connection}, function(err) {
        console.log(err || 'connect-mongodb setup ok')
    })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

/* Load custom middleware */
require('./app/middleware/restrict')(app);

/* Load application routes */
require('./app')(app, passport);

/* Load and store location data */
Location.find({}, function(err, locations) {
    if (err) return console.error(err);
    app.set('locations', locations);
});

/* Handle 404 */
app.use(function(req, res, next) {
    var err = new Error('The page that you\'re looking for does not exist!');
    err.status = 404;
    next(err);
});

/* Handle errors at the end of the chain */
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('404', {
        user       : remap.userRemap(req.user),
        message    : err.message,
        error      : err,
        background : bg()
    });
});

/* Initialize the score utility */
scoreUtil();

app.listen(app.get('port'), function() {
    console.log('Starting on port ' + app.get('port'));
});