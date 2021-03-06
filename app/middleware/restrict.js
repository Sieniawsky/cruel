/* Middleware for restricting access to 
   certain parts of the application */
module.exports = function(app) {
    app.use('/compose', restrictIfNotLoggedIn);
    app.use('/login', restrictIfLoggedIn);
    app.use('/signup', restrictIfLoggedIn);
    app.use('/u/edit/:username', restrictIfNotLoggedIn);
};

/* If the user is not logged in then redirect to the feed */
var restrictIfNotLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/');
};

/* If the user is logged in then redirect to the feed */
var restrictIfLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) res.redirect('/');
    next();
};
