/* This is where it all begins */

var express    = require('express');
var hogan      = require('hogan-express');
var favicon    = require('serve-favicon');
var logger     = require('morgan');
var path       = require('path');
var bodyParser = require('body-parser');

var mongo = require('mongodb');
var monk = require('monk');

var app = express();

/* Configure Application */
app.set('port', process.env.port || 3000);
app.set('view engine', 'html');
app.set('layout', 'layout');
app.engine('html', hogan);
app.set('views', path.join(__dirname, 'views'));
app.set('socket', 'mongodb://localhost:27017/cruel');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components', express.static(path.join(__dirname, 'bower_components')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

/* Load Routes */
app.get('/', function(req, res) {
    res.render('index', {});
});

app.get('/compose', function(req, res) {
    res.render('compose', {});
});

app.get('/feed', function(req, res) {
    /* Load the feed data first */
    var db = monk(app.get('socket'));
    var posts = db.get('posts');
    posts.find({}).on('success', function(doc) {
        db.close();
        res.render('feed', {
            initData: JSON.stringify({data: doc})
        });
    });
});

app.post('/post', function(req, res) {
    // Store the data in the db
    var db = monk(app.get('socket'));
    var posts = db.get('posts');
    posts.insert(req.body).on('success', function(doc) {
        db.close();
        res.redirect('/feed');
    });
});

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