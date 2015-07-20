/* Routes for leaderboard */
var remap = require('../utils/remap');
var app   = require('../../server');
var bg    = require('../utils/background');

module.exports = function(app, passport) {
    app.get('/leaderboard', function(req, res) {
        res.render('leaderboard', {
            initData : JSON.stringify({
                user : remap.userRemap(req.user)
            }),
            user       : remap.userRemap(req.user),
            locations  : app.get('locations'),
            background : bg()
        });
    });
};
