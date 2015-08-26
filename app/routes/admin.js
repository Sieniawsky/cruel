/* Routes for administrating the application */
var _        = require('lodash');
var mongoose = require('mongoose');
var shortID  = require('mongodb-short-id');
var Post     = require('../models/post');
var User     = require('../models/user');
var remap    = require('../utils/remap');
var bg       = require('../utils/background');
var exists   = require('../utils/exists');

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
                                    feedScripts      : 'partials/feed-scripts',
                                    userDelete       : 'partials/user-delete'
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
                    res.render('post', {
                        initData : JSON.stringify({
                            post : remappedPost,
                            user : remappedUser
                        }),
                        post       : remappedPost,
                        user       : remappedUser,
                        background : bg(),
                        partials   : {
                            postDelete    : 'partials/post-delete',
                            commentDelete : 'partials/comment-delete'
                        }
                    });               
                } else {
                    res.redirect('/404');
                }
            });
        } else {
            res.redirect('/');
        }
    });

    app.delete('/admin/post/:id', function(req, res) {
        var deletePost = function() {
            Post.findByIdAndUpdate(id, {'$set': {deleted: true}}, function(err, result) {
                if (err) return console.error(err);
                updateUser(result);
            });
        };
        var updateUser = function(post) {
            User.update({_id: post._user}, {'$inc': {score: -post.score}}, function(err, result) {
                if (err) return console.error(err);
                var mapped = remap.postRemap(post, req.user);
                res.send({outcome: true});
            });
        };

        var id = req.params.id;
        if (isMongoObjectId(id)) {
            deletePost();
        } else {
            res.send({outcome: false});
        }
    });

    app.delete('/admin/post/comment/:id', function(req, res) {
        var deleteComment = function() {
            Post.update({
                'comments._id': mongoose.Types.ObjectId(id)},
                {'$set': {'comments.$.deleted': true}
            }, function(err, result) {
                if (err) return console.error(err);
                findPost();
            });
        };

        var findPost = function() {
            Post.findOne({_id: req.body.post._id}, function(err, post) {
                if (err) return console.error(err);
                updateUser(post);
            });
        };

        var updateUser = function(post) {
            var index = findIndex(post.comments, '_id', id);
            var comment = post.comments[index];
            User.update({_id: comment._user}, {'$inc': {score: -comment.score}}, function(err, result) {
                if (err) return console.error(err);
                res.send({outcome: true});
            });
        };

        var id = req.params.id;
        if (isMongoObjectId(id)) {
            deleteComment();
        } else {
            res.send({outcome: false});
        }
    });

    app.delete('/admin/user/:id', function(req, res) {
        var deleteUser = function() {
            User.findOneAndUpdate({_id: id}, {'$set': {deleted: true}}, function(err, result) {
                if (err) return console.error(err);
                deletePosts();
            });
        };

        var deletePosts = function() {
            Post.update({_user: id}, {'$set': {deleted: true}}, {multi: true}, function(err, result) {
                if (err) return console.error(err);
                res.send({outcome: true});
            });
        };

        var id = req.params.id;
        if (isMongoObjectId(id)) {
            deleteUser();
        } else {
            res.send({outcome: false});
        }
    });

    var isMongoObjectId = function(id) {
        var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
        return checkForHexRegExp.test(id);
    };

    var findIndex = function(array, attr, target) {
        var index = -1;
        for (var i = 0; i < array.length; i++) {
            if (array[i][attr] == target) {
                index = i;
                break;
            }
        }
        return index;
    };
};
