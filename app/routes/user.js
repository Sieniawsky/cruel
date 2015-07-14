/* Routes for users */
var _      = require('lodash');
var Post   = require('../models/post');
var User   = require('../models/user');
var remap  = require('../utils/remap');
var bg     = require('../utils/background');
var exists = require('../utils/exists');

module.exports = function(app, passport) {
    app.get('/u/:username', function(req, res) {
        User.findOne({username: req.params.username}, function(err, user) {
            if (err) return console.log(err);
            if (exists(user)) {
                Post.find({_user: user._id}, function(err, posts) {
                    if (err) return console.error(err);

                    res.render('user', {
                        initData : JSON.stringify({
                            user         : remap.userRemap(req.user),
                            selectedUser : remap.userRemap(user),
                            posts        : remap.postsRemap(posts, user)
                        }),
                        user       : remap.userRemap(req.user),
                        background : bg(),
                        partials   : {
                            feedPostTemplate : 'partials/feed-post-template',
                            feedScripts      : 'partials/feed-scripts'
                        }
                    });
                });
            } else {
                res.redirect('/404');
            }
        });
    });

    app.get('/u/edit/:username', function(req, res) {
        User.findOne({username: req.params.username}, function(err, user) {
            if (err) return console.error(err);
            res.render('user-edit', {
                initData : JSON.stringify({
                    user : remap.userRemap(user)
                }),
                user       : remap.userRemap(req.user),
                background : bg()
            });
        });
    });

    app.post('/u/edit', function(req, res) {
        if (typeof req.user._id != 'undefined' && req.user._id != null) {
            User.update({_id: req.user._id},
                {'$set': {imageUrl: req.body.url, description: req.body.description}}, function(err, updates) {
                if (err) return console.error(err);
                res.redirect('/u/' + req.user.username);
            });
        } else {
            res.send({outcome: false});
        }
    });
};
