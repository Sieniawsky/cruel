/* Routes for administrating the application */
var _       = require('lodash');
var shortID = require('mongodb-short-id');
var Post    = require('../models/post');
var User    = require('../models/user');
var remap   = require('../utils/remap');
var bg      = require('../utils/background');
var exists  = require('../utils/exists');

module.exports = function(app, passport) {
    app.get('/admin/user/:username', function(req, res) {
        if (req.user && req.user.privilege === 'admin') {
            User.findOne({username: req.params.username, deleted: false}, function(err, user) {
                if (err) return console.log(err);
                if (exists(user)) {
                    Post.find({_user: user._id}, function(err, posts) {
                        if (err) return console.error(err);
                        var id = user._id;
                        var query = User.find({_location: user._location}).sort({score: -1});
                        query.exec(function(err, users) {
                            if (err) return console.error(err);
                            var rank = _.indexOf(users, _.find(users, function(user) {
                                return user._id.equals(id);
                            })) + 1;
                            res.render('admin-user', {
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
        } else {
            res.redirect('/');
        }
    });

    app.get('/admin/post/:shortID/:prettySnippet', function(req, res) {
        if (req.user && req.user.privilege === 'admin') {
            var id = shortID.s2l(req.params.shortID);
            Post.findOne({_id: id, deleted: false}, function(err, post) {
                if (err) return console.error(err);
                if (exists(post)) {
                    var remappedPost = remap.postRemap(post, req.user);
                    var remappedUser = remap.userRemap(req.user);
                    res.render('admin-post', {
                        initData : JSON.stringify({
                            post : remappedPost,
                            user : remappedUser
                        }),
                        post       : remappedPost,
                        user       : remappedUser,
                        background : bg()
                    });               
                } else {
                    res.redirect('/404');
                }
            });
        } else {
            res.redirect('/');
        }
    });
};
