/* Routes for users */
var _      = require('lodash');
var Post   = require('../models/post');
var User   = require('../models/user');
var remap  = require('../utils/remap');
var bg     = require('../utils/background');
var exists = require('../utils/exists');

module.exports = function(app, passport) {
    app.get('/user/:username', function(req, res) {
        User.findOne({username: req.params.username}, function(err, user) {
            if (err) return console.log(err);
            if (exists(user)) {
                Post.find({_user: user._id}, function(err, posts) {
                    if (err) return console.error(err);
                    var id = user._id;
                    var query = User.find({}).sort({score: -1});
                    query.exec(function(err, users) {
                        if (err) return console.error(err);
                        var rank = _.indexOf(users, _.find(users, function(user) {
                            return user._id.equals(id);
                        })) + 1;
                        res.render('user', {
                            initData : JSON.stringify({
                                user         : remap.userRemap(req.user),
                                selectedUser : _.extend(remap.userRemap(user), {rank: rank}),
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
                });
            } else {
                res.redirect('/404');
            }
        });
    });

    app.get('/user/edit/:username', function(req, res) {
        if (req.user.username === req.params.username) {
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
        } else {
            res.redirect('/');
        }
    });

    app.post('/user/edit', function(req, res) {
        if (typeof req.user._id != 'undefined' && req.user._id != null) {
            User.update({_id: req.user._id},
                {'$set': {imageUrl: req.body.url, description: req.body.description}}, function(err, updates) {
                if (err) return console.error(err);
                res.redirect('/user/' + req.user.username);
            });
        } else {
            res.send({outcome: false});
        }
    });
};
