/* Routes for posts */
var _      = require('lodash');
var Post   = require('../../models/post');
var User   = require('../../models/user');
var remap  = require('../../utils/remap');

/* API routes for the feed */
module.exports = function(app, passport) {
    
    /* Get new posts */
    app.get('/api/feed/new/:id?', function(req, res) {
        var query;
        if (typeof req.params.id == 'undefined') {
            query = Post.find().sort({date: 1}).limit(8);
        } else {
            query = Post.find({_id: {'$lt': req.params.id}}).sort({date: 1}).limit(8);
        }
        query.exec(function(err, posts) {
            if (err) return console.error(err);
            res.send(remap.postsRemap(posts, req.user));
        });
    });

    /* Get top rated posts */
    app.get('/api/feed/top/:id?', function(req, res) {
        var query;
        if (typeof req.params.id == 'undefined') {
            query = Post.find().sort({score: -1}).limit(8);
        } else {
            query = Post.find({_id: {'$lt': req.params.id}}).sort({score: -1}).limit(8);
        }
        query.exec(function(err, posts) {
            if (err) return console.error(err);
            res.send(remap.postsRemap(posts, req.user));
        });
    });

    /* Get hot posts */
    app.get('/api/feed/hot/:id?', function(req, res) {
        var range = new Date();
        range.setDate(range.getDate() - 2);
        var query = Post.find({date: {'$gte': range}});
        query.exec(function(err, posts) {
            if (err) return console.error(err);
            res.send(remap.postsHotRemap(posts, req.user));
        });
    });
};