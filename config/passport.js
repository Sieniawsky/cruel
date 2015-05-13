/* Passport configuration */
var LocalStrategy = require('passport-local').Strategy;
var User = require('../app/models/user');

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

            User.findOne({'email': email}, function(err, user) {

                if (err) return done(err);

                if (user) {
                    return done(null, false, 'Ting is fucked');
                } else {

                    var user = new User();

                    user.email    = email;
                    user.password = user.generateHash(password);
                    user.username = req.body.username;
                    user.date     = new Date();

                    user.save(function(err) {
                        if (err) console.error(err);
                        return done(null, user);
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

            if (!user) return done(null, false, 'Not found');

            if (!user.validPassword(password)) return done(null, false, 'Wrong password');

            return done(null, user);
        });
    }));
};