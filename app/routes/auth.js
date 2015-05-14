/* Routes for authentication */
var _      = require('lodash');
var moment = require('moment');
var Post   = require('../models/post');
var User   = require('../models/user');
var remap  = require('../utils/remap');

module.exports = function(app, passport) {
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