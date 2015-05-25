/* Load all routes for the appliation */
module.exports = function(app, passport) {
    require('./routes')(app, passport);
};
