var url     = require('url');
var request = require('request');
var async   = require('async');
var crypto  = require('crypto');
var User    = require('../models/user');
var bg      = require('../utils/background');
var remap   = require('../utils/remap');
var mailer  = require('../utils/mailer');

module.exports = function(app, passport) {
    app.get('/404', function(req, res) {
        var mappedUser = remap.userRemap(req.user);
        res.render('404', {
            initData   : JSON.stringify({
                user   : mappedUser
            }),
            user       : mappedUser,
            message    : 'The page that you\'re looking for does not exist!',
            error      : {status: 404},
            background : bg()
        });
    });
    
    app.get('/welcome', function(req,res) {
        var mappedUser = remap.userRemap(req.user);
        res.render('welcome', {
            initData   : JSON.stringify({
                user   : mappedUser
            }),
            user       : remap.userRemap(req.user),
            background : bg()
        });
    });

    app.get('/contact', function(req, res) {
        var mappedUser = remap.userRemap(req.user);
        res.render('contact', {
            initData       : JSON.stringify({
                user       : mappedUser
            }),
            user           : remap.userRemap(req.user),
            contactSuccess : req.flash('contact-success'),
            background     : bg()
        });
    });

    app.get('/user-agreement', function(req, res) {
        var mappedUser = remap.userRemap(req.user);
        res.render('user-agreement', {
            initData   : JSON.stringify({
                user   : mappedUser
            }),
            user       : remap.userRemap(req.user),
            background : bg()
        });
    });

    app.get('/proxy', function(req, res) {
        var query = url.parse(req.url, true).query;
        if (query.url) {
            var x = request(query.url);
            req.pipe(x).pipe(res);
        } else {
            res.writeHead(400, {'Content-Type': 'text/plain'});
            res.end('No url');
        }
    });

    app.post('/contact', function(req, res) {
        mailer.contact(req.body.email, req.body.contactBody, function() {
            req.flash('contact-success', 'An email has been sent.');
            res.redirect('/contact');
        });
    });

    app.get('/forgot', function(req, res) {
        if (!req.user) {
            res.render('forgot', {
                user          : remap.userRemap(req.user),
                forgotError   : req.flash('forgot-error'),
                forgotSuccess : req.flash('forgot-success'),
                background    : bg()
            });
        } else {
            res.redirect('/');
        }
    });

    app.post('/forgot', function(req, res) {
        async.waterfall([
            function(next) {
                crypto.randomBytes(20, function(err, buf) {
                    if (err) return console.error(err);
                    var token = buf.toString('hex');
                    next(null, token);
                });
            },
            function(token, next) {
                User.findOne({email: req.body.email}, function(err, user) {
                    if (err) return console.error(err);
                    if (!user) {
                        req.flash('forgot-error', 'No account with that email address exists.')
                        return res.redirect('/forgot');
                    }
                    User.update({email: req.body.email}, {
                        '$set': {passwordResetToken: token, passwordResetExpires: Date.now() + 3600000}
                    }, function(err, result) {
                        if (err) return console.error(err);
                        next(null, token, user);
                    });
                });
            },
            function(token, user, next) {
                req.flash('forgot-success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                mailer.forgot(user.email, req.headers.host, token, function() {
                    next(null);
                });
            }
        ], function(err) {
            if (err) return console.error(err);
            res.redirect('/forgot');
        });
    });

    app.get('/reset/:token', function(req, res) {
        User.findOne({
            passwordResetToken: req.params.token,
            passwordResetExpires: {'$gt': Date.now()}
        }, function(err, user) {
            if (err) return console.error(err);
            if (!user) {
                req.flash('reset-error', 'Password reset token is invalid or has expired.');
                return res.redirect('/forgot');
            }
            res.render('reset', {
                user         : remap.userRemap(req.user),
                resetError   : req.flash('reset-error'),
                resetSuccess : req.flash('reset-success'),
                background   : bg()
            });
        });
    });

    app.post('/reset/:token', function(req, res) {
        async.waterfall([
            function(next) {
                User.findOne({
                    passwordResetToken: req.params.token,
                    passwordResetExpires: {'$gt': Date.now()}
                }, function(err, user) {
                    if (err) return console.error(err);
                    if (!user) {
                        req.flash('reset-error', 'Password reset token is invalid or has expired.');
                        return res.redirect('back');
                    }

                    User.update({_id: user._id}, {
                        '$set': {password: user.generateHash(req.body.password)}
                    }, function(err, result) {
                        if (err) return console.error(err);
                        req.logIn(user, function(err) {
                            if (err) return console.error(err);
                            next(null, user);
                        });
                    });
                });
            },
            function(user, next) {
                req.flash('reset-success', 'Success! Your password has been changed.');
                mailer.newPassword(user.email, function() {
                    next(null);
                });
            }
        ], function(err) {
            if (err) return console.error(err);
            res.redirect('/reset');
        });
    });

    app.get('/jobs', function(req, res) {
        res.render('jobs', {
            layout     : false,
            background : bg()
        });
    });
};
