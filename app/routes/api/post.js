/* Routes for posts */
var _        = require('lodash');
var Post     = require('../../models/post');
var User     = require('../../models/user');
var remap    = require('../../utils/remap');
var mongoose = require('mongoose');

var has = function(collection, target) {
    return _.some(collection, function(elem) {
        return elem.equals(target);
    });
};

/* API routes for post related data and actions */
module.exports = function(app, passport) {

    app.get('/api/post/:id', function(req, res) {
        Post.findOne({_id: req.params.id}, function(err, post) {
            if (err) return console.error(err);
            res.send(remap.postRemap(post, req.user));
        });
    });

    /* Perform a like operation if it's valid */
    app.post('/api/like/:id', function(req, res) {
        // Check if allowed
        Post.findOne({_id: req.params.id}, function(err, post) {
            if (err) return console.error(err);
            if (!has(post.likers, req.user._id)) {
                // User has not voted on this post yet
                Post.update({_id: req.params.id},
                    {'$push': {likers: req.user._id}, '$inc': {score: 1}}, function(err, update) {
                    if (err) return console.error(err);
                    User.update({_id: post._user},
                        {'$inc': {score: 1}, '$push': {scoreNotifications: {_post: post._id, title: post.title}}},
                        function(err, user) {
                        if (err) return console.error(err);
                        res.send({outcome: true});
                    });
                });
            } else {
                res.send({outcome: false});
            }
        });
    });

    /* Perform an unlike operation if it's valid */
    app.post('/api/unlike/:id', function(req, res) {

        Post.findOne({_id: req.params.id}, function(err, post) {
            if (err) return console.error(err);

            /* Check if user is allowed to unlike */
            if (has(post.likers, req.user._id)) {
                /* User is allowed, decrement post score and remove id from likers */
                Post.update({_id: req.params.id},
                    {'$pull': {likers: req.user._id}, '$inc': {score: -1}}, function(err, update) {
                    if (err) return console.error(err);
                    /* Decrement user score, remove notification */

                    User.findOne({_id: post._user}, function(err, user) {
                        if (err) return console.error(err);
                        var notifications = user.scoreNotifications;
                        var index = _.indexOf(notifications, {_post: post._id, title: post.title});
                        notifications.splice(index, 1);

                        /* Update */
                        User.update({_id: post._user},
                            {'$inc': {score: -1}, '$set': {scoreNotifications: notifications}}, function(err, u) {
                                if (err) return console.error(err);
                                res.send({outcome: true});
                        });
                    });
                });
            } else {
                res.send({outcome: false});
            }
        });
    });

    /* Comment logic */

    app.post('/api/comment/:id', function(req, res) {
        if (typeof req.user._id != 'undefined' && req.user._id != null) {
            var comment = {
                _id       : mongoose.Types.ObjectId(),
                comment   : req.body.comment,
                score     : 0,
                _user     : req.user._id,
                _username : req.user.username,
                _post     : req.params.id,
                date      : new Date(),
                likers    : []
            };
            Post.update({_id: req.params.id}, {'$push': {comments: comment}}, function(err, update) {
                if (err) return console.error(err);
                res.send({outcome: true});
            });
        } else {
            res.send({outcome: false});
        }
    });

    /* Perform a comment like operation if it's valid */
    app.post('/api/comment/like/:id', function(req, res) {
        // Check if allowed
        Post.findOne({_id: req.params.id}, function(err, post) {
            if (err) return console.error(err);
            if (!has(post.likers, req.user._id)) {
                // User has not voted on this post yet
                Post.update({_id: req.params.id},
                    {'$push': {likers: req.user._id}, '$inc': {score: 1}}, function(err, update) {
                    if (err) return console.error(err);
                    User.update({_id: post._user},
                        {'$inc': {score: 1}, '$push': {scoreNotifications: {_post: post._id, title: post.title}}},
                        function(err, user) {
                        if (err) return console.error(err);
                        res.send({outcome: true});
                    });
                });
            } else {
                res.send({outcome: false});
            }
        });
    });

    /* Perform a comment unlike operation if it's valid */
    app.post('/api/comment/unlike/:id', function(req, res) {

        Post.findOne({_id: req.params.id}, function(err, post) {
            if (err) return console.error(err);

            /* Check if user is allowed to unlike */
            if (has(post.likers, req.user._id)) {
                /* User is allowed, decrement post score and remove id from likers */
                Post.update({_id: req.params.id},
                    {'$pull': {likers: req.user._id}, '$inc': {score: -1}}, function(err, update) {
                    if (err) return console.error(err);
                    /* Decrement user score, remove notification */

                    User.findOne({_id: post._user}, function(err, user) {
                        if (err) return console.error(err);
                        var notifications = user.scoreNotifications;
                        var index = _.indexOf(notifications, {_post: post._id, title: post.title});
                        notifications.splice(index, 1);

                        /* Update */
                        User.update({_id: post._user},
                            {'$inc': {score: -1}, '$set': {scoreNotifications: notifications}}, function(err, u) {
                                if (err) return console.error(err);
                                res.send({outcome: true});
                        });
                    });
                });
            } else {
                res.send({outcome: false});
            }
        });
    });
};