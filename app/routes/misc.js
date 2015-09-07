var url     = require('url');
var request = require('request');
var bg      = require('../utils/background');
var remap   = require('../utils/remap');

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

    app.get('/contact', function(req, res) {
        res.render('contact', {
            user: remap.userRemap(req.user),
            background : bg()
        });
    });

    app.get('/user-agreement', function(req, res) {
        res.render('user-agreement', {
            user: remap.userRemap(req.user),
            background : bg()
        });
    });

    app.get('/proxy', function(req, res) {
        var query = url.parse(req.url, true).query;
        if (query.url) {
            var x = request(query.url);
            req.pipe(x).pipe(res);
        } else {
            res.writeHead(400, {'Content-Type': 'text/plain'});
            res.end('No url');
        }
    });
};
