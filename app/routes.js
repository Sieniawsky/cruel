var _      = require('lodash');
var moment = require('moment');

module.exports = function(app, passport, db) {

    /* Index feed page */
    app.get('/', function(req, res) {
        var posts = db.get('posts');
        posts.find({}).on('success', function(doc) {
            res.render('feed', {
                initData: JSON.stringify({data: postRemap(doc)})
            });
        });
    });

    /* Post composition page */
    app.get('/compose', function(req, res) {
        res.render('compose', {});
    });

    app.get('/register', function(req, res) {
        res.render('register', {});
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    /* Post handler */
    app.post('/post', function(req, res) {
        var posts = db.get('posts');
        var data = {
            date: new Date()
        };
        data = _.extend(data, req.body);
        posts.insert(data).on('success', function(doc) {
            db.close();
            res.redirect('/');
        });
    });

    app.post('/register', function(req, res) {
        // Store the user data
        var db = monk(app.get('socket'));
        var users = db.get('users');
        users.insert(req.body).on('success', function(doc) {
            db.close();
            res.redirect('/');
        });
    });
};

/* Middleware helper */
var isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/');
};

var postRemap = function(data) {
    var posts = [];
    _.forEach(data, function(elem) {
        var post = {};
        post.title = elem.title;
        post.url = elem.url;
        post.date = moment(elem.date).fromNow();
        posts.push(post);
    });
    return posts;
};