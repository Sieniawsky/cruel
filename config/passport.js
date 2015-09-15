/* Passport configuration */
var LocalStrategy = require('passport-local').Strategy;
var User          = require('../app/models/user');
var mailer        = require('../app/utils/mailer');

module.exports = function(passport) {

    /* Passport setup */
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    /* Signup */
    passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {
        process.nextTick(function() {

            /* Check if provided email already exists */
            User.findOne({'email': email}, function(err, user) {

                if (err) return done(err);

                if (user) {
                    return done(null, false, req.flash('signupMessage', 'This email is already in use!'));
                } else {

                    /* Check if username already exists */
                    User.findOne({'username': req.body.username}, function(err, user) {
                        if (err) return done(err);

                        if (user) {
                            return done(null, false, req.flash('signupMessage', 'This username is already in use!'));
                        } else {
                            user = new User();

                            locationData = req.body.location.split(',');

                            user.email         = email;
                            user.password      = user.generateHash(password);
                            user.username      = req.body.username;
                            user.date          = new Date();
                            user._location     = locationData[0];
                            user._locationName = locationData[1];

                            user.save(function(err) {
                                if (err) console.error(err);
                                mailer.welcome(user, function() {
                                    return done(null, user);
                                });
                            });
                        }
                    });
                }
            });
        });
    }));

    /* Login */
    passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {
        User.findOne({'email': email}, function(err, user) {

            if (err) return done(err);

            if (!user || user.deleted === true) return done(null, false, req.flash('loginMessage', 'No user found!'));

            if (!user.validPassword(password)) return done(null, false,
                req.flash('loginMessage', 'Username or password incorrect!'));

            return done(null, user);
        });
    }));
};
