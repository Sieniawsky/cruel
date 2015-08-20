/* All page rendering, auth, and api routes */
module.exports = function(app, passport) {
    require('./api')(app, passport);
    require('./auth')(app, passport);
    require('./feed')(app, passport);
    require('./post')(app, passport);
    require('./user')(app, passport);
    require('./misc')(app, passport);
    require('./admin')(app, passport);
    require('./leaderboard')(app, passport);
};