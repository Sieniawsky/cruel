/* This is where it all begins */

var express    = require('express');
var hogan      = require('hogan-express');
var favicon    = require('serve-favicon');
var logger     = require('morgan');
var path       = require('path');
var bodyParser = require('body-parser');

var app = express();

/* Configure Application */
app.set('port', process.env.port || 3000);
app.set('view engine', 'html');
app.set('layout', 'layout');
app.engine('html', hogan);
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components', express.static(path.join(__dirname, 'bower_components')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

/* Load Routes */
app.get('/', function(req, res) {
    res.render('index', {});
});

app.listen(3000, function() {
    console.log('Starting on port 3000');
});