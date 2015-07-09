/* Routes for posts */
var _      = require('lodash');
var Post   = require('../models/post');
var User   = require('../models/user');
var remap  = require('../utils/remap');
var bg     = require('../utils/background');
var exists = require('../utils/exists');

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
            if (exists(post)) {
                var post = remap.postRemap(post, req.user);
                var user = remap.userRemap(req.user);
                res.render('post', {
                    initData : JSON.stringify({
                        post : post,
                        user : user
                    }),
                    post       : post,
                    user       : user,
                    background : bg()
                });               
            } else {
                res.redirect('/404');
            }
        });
    });

    /* Post handler */
    app.post('/post', function(req, res) {
        if (typeof req.user._id != 'undefined' && req.user._id != null) {
            var data = _.extend(req.body, {
                date          : new Date(),
                _user         : req.user._id,
                _username     : req.user.username,
                _location     : req.user._location,
                _locationName : req.user._locationName
            });
            data = _.omit(data, function(value) {
                return value === '';
            });
            var post = new Post(data);
            post.save(function(err, post) {
                if (err) return console.error(err);
                res.redirect('/');
            });
        } else {
            res.send({outcome: false});
        }
    });
};
