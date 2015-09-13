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
            initData   : JSON.stringify({
                user   : mappedUser
            }),
            user       : remap.userRemap(req.user),
            background : bg()
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
        if (req.body && req.body.email.length !== 0 && req.body.body.length !== 0) {
            mailer.contact(req.body.email, req.body.body, function() {
                res.send({outcome: true});
            });
        } else {
            res.send({outcome: false});
        }
    });

    app.get('/forgot', function(req, res) {
        if (req.user) {
            res.render('forgot', {
                user       : remap.userRemap(req.user),
                background : bg()
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
                    next(err, token);
                });
            },
            function(token, next) {
                User.findOne({email: req.body.email}, function(err, user) {
                    if (err) return console.error(err);
                    if (!user) {
                        req.flash('error', 'No account with that email address exists.')
                        res.redirect('/forgot');
                    }

                    user.resetPasswordToken = token;
                    user.resetPasswordExpires = Date.now() + 3600000;

                    user.save(function(err) {
                        next(err, token, user);
                    });
                });
            },
            function(token, user, next) {
                req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                mailer.forgot(user.email, req.headers.host, token, function() {
                    next(err, 'done');
                });
            }
        ], function(err) {
            if (err) return console.error(err);
            res.redirect('/forgot');
        });
    });

    app.get('/reset/:token', function(req, res) {
        User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: {'$gt': {Date.now()}}
        }, function(err, user) {
            if (err) return console.error(err);
            if (!user) {
                req.flash('error', 'Password reset token is invalid or has expired.');
                return res.redirect('/forgot');
            }
            res.render('reset', {
                user       : remap.userRemap(req.user),
                background : bg()
            });
        });
    });

    app.post('/reset/:token', function(req, res) {
        async.waterfall([
            function(next) {
                User.findOne({
                    resetPasswordToken: req.params.token,
                    resetPasswordExpires: {'$gt': {Date.now()}}
                }, function(err, user) {
                    if (!user) {
                        req.flash('error', 'Password reset token is invalid or has expired.');
                        return res.redirect('back');
                    }

                    user.password = user.generateHash(req.body.password);
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpires = undefined;

                    user.save(function(err) {
                        req.logIn(user, function(err) {
                            next(err, user);
                        });
                    });
                });
            },
            function(user, next) {
                req.flash('success', 'Success! Your password has been changed.');
                mailer.reset(user.email, function() {
                    next(err);
                });
            }
        ], function(err) {
            if (err) return console.error(err);
            res.redirect('/');
        });
    });
};
