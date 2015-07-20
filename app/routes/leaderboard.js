var bg = require('../utils/background');
module.exports = function(app, passport) {
    app.get('/leaderboard', function(req, res) {
        res.render('leaderboard', {
            background: bg()
        });
    });
};
