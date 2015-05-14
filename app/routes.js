/* Load all routes for the appliation */
module.exports = function(app, passport) {
    require('./routes/auth')(app, passport);
    require('./routes/feed')(app, passport);
    require('./routes/post')(app, passport);
    require('./routes/user')(app, passport);
};
