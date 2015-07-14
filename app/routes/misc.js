var bg = require('../utils/background');
module.exports = function(app, passport) {
    app.get('/404', function(req, res) {
        res.render('404', {
            message    : 'The page that you\'re looking for does not exist!',
            error      : {status: 404},
            background : bg()
        });
    });
};
