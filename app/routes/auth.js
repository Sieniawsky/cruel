/* Routes for authentication */
var _        = require('lodash');
var Post     = require('../models/post');
var User     = require('../models/user');
var Location = require('../models/location'); 
var remap    = require('../utils/remap');
var bg       = require('../utils/background');
var config   = require('../../server').get('config');
var url      = require('url');

module.exports = function(app, passport) {
    app.get('/signup', function(req, res) {
        Location.find({}, function(err, locations) {
            if (err) return console.error(err);
            res.render('signup', {
                initData    : JSON.stringify({
                    referer : req.headers.referer
                }),
                message     : req.flash('signupMessage'),
                locations   : remap.locationRemap(locations),
                background  : bg()
            });
        });
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.post('/signup', function(req, res, next) {
        var referer = req.body.referer;
        var parsed  = url.parse(referer);
        var successRedirect = '/';
        if (_.contains(config.hosts, parsed.host)) {
            successRedirect = parsed.pathname;
        }
        passport.authenticate('local-signup', {
            successRedirect : successRedirect,
            failureRedirect : '/signup',
            failureFlash    : true     
        })(req, res, next);
    });

    /* User login, redirect to the last page that they were on
       as long as it was from the app host. */
    app.post('/login', function(req, res, next) {
        var referer = req.headers.referer;
        var parsed  = url.parse(referer);
        var successRedirect = '/';
        if (_.contains(config.hosts, parsed.host)) {
            successRedirect = parsed.pathname;
        }
        passport.authenticate('local-login', {
            successRedirect : successRedirect,
            failureRedirect : url.resolve(successRedirect, '/?s=' + encodeURIComponent('false')),
            failureFlash    : true
        })(req, res, next);
    });
};