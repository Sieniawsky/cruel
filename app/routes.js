/* All routes for the application */
/* When passing data to a render function include
   all data needed in the client into the initData
   object. Ensure to sanitize this data beforehand. */
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
                initData : JSON.stringify({
                    data : postsRemap(posts)
                }),
                user : userRemap(req.user)
            });
        });
    });

    /* Post composition page */
    app.get('/post', function(req, res) {
        res.render('compose', {
            initData : JSON.stringify({
                user : userRemap(req.user)
            })
        });
    });

    app.get('/login', function(req, res) {
        res.render('login', {message : req.flash('loginMessage')});
    });

    app.get('/signup', function(req, res) {
        res.render('signup', {message : req.flash('signupMessage')});
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
    
    app.get('/u/:username', function(req, res) {
        User.find({username: req.params.username}, function(err, user) {
            if (err) return console.log(err);
            Post.find({_user: req.user._id}, function(err, posts) {
                if (err) return console.error(err);
                
                res.render('user', {
                    initData : JSON.stringify({
                        user : userRemap(req.user),
                        posts : posts
                    }),
                    user  : userRemap(req.user)
                });
            });
        });
    });

    app.get('/post/:id', function(req, res) {
        Post.findOne({_id: req.params.id}, function(err, post) {
            if (err) return console.error(err);
            User.findById(post._user, function(err, user) {
                if (err) return console.error(err);
                res.render('post', {
                    initData : JSON.stringify({
                        post : postRemap(post, user)
                    }),
                    user : userRemap(req.user)
                });
            });
        });
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
        failureRedirect : '/signup',
        failureFlash    : true
    }));

    /* User login */
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/',
        failureRedirect : '/login',
        failureFlash    : true
    }));
};

/* Middleware helper */
var isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/');
};

var postsRemap = function(data) {

    var posts = _(data).sortBy(function(elem) {
        return new Date(elem.date);
    }).map(function(elem) {
        return {
            _id    : elem._id,
            title : elem.title,
            url   : elem.url,
            date  : moment(new Date(elem.date)).fromNow()
        };
    });

    return posts.reverse();
};

var postRemap = function(post, user) {
    return {
        _id          : post._id,
        title       : post.title,
        description : post.description,
        url         : post.url,
        _user       : post._user,
        user        : userRemap(user)
    };
};

var userRemap = function(data) {
    if (typeof data !== "undefined" && data !== null) {
        var user = _.pick(data, ['_id', 'username', 'email']);
    }
    return user || {};
};
