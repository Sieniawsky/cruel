/* Routes for posts */
var _      = require('lodash');
var Post   = require('../../models/post');
var User   = require('../../models/user');
var remap  = require('../../utils/remap');

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
        Post.findOne({_id: req.params.id, likers: req.body.user._id}, function(err, post) {
            if (err) return console.error(err);
            if (post == null) {
                // User has not voted on this post yet
                Post.update({_id: req.params.id},
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