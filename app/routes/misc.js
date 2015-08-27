var bg    = require('../utils/background');
var remap = require('../utils/remap');

module.exports = function(app, passport) {
    app.get('/404', function(req, res) {
        res.render('404', {
            user       : remap.userRemap(req.user),
            message    : 'The page that you\'re looking for does not exist!',
            error      : {status: 404},
            background : bg()
        });
    });
    
    app.get('/welcome', function(req,res) {
        res.render('welcome', {
            user       : remap.userRemap(req.user),
            background : bg()
        });
    });
};
