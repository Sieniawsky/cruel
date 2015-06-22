/* Routes for posts */
var _      = require('lodash');
var Post   = require('../models/post');
var User   = require('../models/user');
var remap  = require('../utils/remap');
var bg     = require('../utils/background.js');

module.exports = function(app, passport) {
    /* Post composition page */
    app.get('/post', function(req, res) {
        res.render('compose', {
            initData : JSON.stringify({
                user : remap.userRemap(req.user)
            }),
            user       : remap.userRemap(req.user),
            background : bg()
        });
    });

    /* Get a single specific post */
    app.get('/post/:id', function(req, res) {
        Post.findOne({_id: req.params.id}, function(err, post) {
            if (err) return console.error(err);
            User.findById(post._user, function(err, user) {
                if (err) return console.error(err);
                res.render('post', {
                    initData : JSON.stringify({
                        post : remap.postRemap(post, user)
                    }),
                    user       : remap.userRemap(req.user),
                    background : bg()
                });
            });
        });
    });

    /* Post handler */
    app.post('/post', function(req, res) {
        var data = _.extend({
            date          : new Date(),
            _location     : req.user._location,
            _locationName : req.user._locationName
        }, req.body);
        data = _.omit(data, function(value) {
            return value === '';
        });
        var post = new Post(data);
        post.save(function(err, post) {
            if (err) return console.error(err);
            res.redirect('/');
        });
    });
};
