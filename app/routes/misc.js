var url     = require('url');
var request = require('request');
var bg      = require('../utils/background');
var remap   = require('../utils/remap');
var mailer  = require('../utils/mailer');

module.exports = function(app, passport) {
    app.get('/404', function(req, res) {
        var mappedUser = remap.userRemap(req.user);
        res.render('404', {
            initData   : JSON.stringify({
                user   : mappedUser
            }),
            user       : mappedUser,
            message    : 'The page that you\'re looking for does not exist!',
            error      : {status: 404},
            background : bg()
        });
    });
    
    app.get('/welcome', function(req,res) {
        var mappedUser = remap.userRemap(req.user);
        res.render('welcome', {
            initData   : JSON.stringify({
                user   : mappedUser
            }),
            user       : remap.userRemap(req.user),
            background : bg()
        });
    });

    app.get('/contact', function(req, res) {
        var mappedUser = remap.userRemap(req.user);
        res.render('contact', {
            initData   : JSON.stringify({
                user   : mappedUser
            }),
            user       : remap.userRemap(req.user),
            background : bg()
        });
    });

    app.get('/user-agreement', function(req, res) {
        var mappedUser = remap.userRemap(req.user);
        res.render('user-agreement', {
            initData   : JSON.stringify({
                user   : mappedUser
            }),
            user       : remap.userRemap(req.user),
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

    app.post('/contact', function(req, res) {
        if (req.body && req.body.email.length !== 0 && req.body.body.length !== 0) {
            mailer.contact(req.body.email, req.body.body, function() {
                res.send({outcome: true});
            });
        } else {
            res.send({outcome: false});
        }
    });
};
