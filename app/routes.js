var _      = require('lodash');
var moment = require('moment');
var Post   = require('./models/post');
var User   = require('./models/user');

module.exports = function(app, passport) {

    /* Index feed page */
    app.get('/', function(req, res) {
        Post.find(function(err, posts) {
            if (err) return console.error(err);

            res.render('feed', {
                initData: JSON.stringify({
                    data : postRemap(posts),
                    user : userRemap(req.user)
                })
            });
        });
    });

    /* Post composition page */
    app.get('/compose', function(req, res) {
        res.render('compose', {});
    });

    app.get('/login', function(req, res) {
        res.render('login', {});
    });

    app.get('/signup', function(req, res) {
        res.render('signup', {});
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    /* Post handler */
    app.post('/post', function(req, res) {
        var data = _.extend({date: new Date()}, req.body);
        var post = new Post(data);
        post.save(function(err, post) {
            if (err) return console.error(err);

            res.redirect('/');
        });
    });

    /* User signup */
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/',
        failureRedirect : '/'
    }));

    /* User login */
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/',
        failureRedirect : '/failure'
    }));
};

/* Middleware helper */
var isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/');
};

var postRemap = function(data) {
    
    var posts = _(data).sortBy(function(elem) {
        return new Date(elem.date);
    }).map(function(elem) {
        return {
            title : elem.title,
            url   : elem.url,
            date  : moment(new Date(elem.date)).fromNow()
        };
    });

    return posts;
};

var userRemap = function(data) {
    var user = data || {};
    delete user.password;
    return user;
};
