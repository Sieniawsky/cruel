/* Routes for posts */
var _      = require('lodash');
var moment = require('moment');
var Post   = require('../models/post');
var User   = require('../models/user');
var remap  = require('../utils/remap');

module.exports = function(app, passport) {
    /* Post composition page */
    app.get('/post', function(req, res) {
        res.render('compose', {
            initData : JSON.stringify({
                user : remap.userRemap(req.user)
            })
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
                    user : remap.userRemap(req.user)
                });
            });
        });
    });

    /* Post handler */
    app.post('/post', function(req, res) {
        var data = _.extend({date: new Date()}, req.body);
        data = _.omit(data, function(value) {
            return value === '';
        });
        var post = new Post(data);
        post.save(function(err, post) {
            if (err) return console.error(err);
            res.redirect('/');
        });
    });

    /* Perform a like operation if it's valid */
    app.post('/post/like', function(req, res) {
        // Check if allowed
        Post.findOne({_id: req.body.post._id, likers: req.body.user._id}, function(err, post) {
            if (err) return console.error(err);
            if (post == null) {
                // User has not voted on this post yet
                Post.update({_id: req.body.post._id},
                    {'$push': {likers: req.body.user._id}, '$inc': {score: 1}}, function(err, post) {
                    if (err) return console.error(err);
                    User.update({_id: req.body.user._id}, {'$inc': {score: 1}}, function(err, user) {
                        if (err) return console.error(err);
                        res.send({outcome: true});
                    });
                });
            }
        });
    });
};