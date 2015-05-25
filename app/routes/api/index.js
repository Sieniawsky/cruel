/* Export all routes for the API */
module.exports = function(app, passport) {
    require('./feed')(app, passport);
    require('./post')(app, passport);
};