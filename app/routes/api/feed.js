/* Routes for posts */
var _      = require('lodash');
var Post   = require('../../models/post');
var User   = require('../../models/user');
var remap  = require('../../utils/remap');

/* API routes for the feed */
module.exports = function(app, passport) {
    
    /* Get new posts */
    app.get('/api/feed/new/:page', function(req, res) {
        var query = Post.find()
            .sort({date: 1})
            .skip(computeSkip(req.params.page))
            .limit(8);
        query.exec(function(err, posts) {
            if (err) return console.error(err);
            res.send(remap.postsRemap(posts, req.user));
        });
    });

    /* Get top rated posts */
    app.get('/api/feed/top/:page', function(req, res) {
        var query = Post.find()
            .sort({score: -1})
            .skip(computeSkip(req.params.page))
            .limit(8);
        query.exec(function(err, posts) {
            if (err) return console.error(err);
            res.send(remap.postsRemap(posts, req.user));
        });
    });

    /* Get hot posts */
    app.get('/api/feed/hot/:page', function(req, res) {
        var range = new Date();
        range.setDate(range.getDate() - 2);
        var query = Post.find({date: {'$gte': range}});
        query.exec(function(err, posts) {
            if (err) return console.error(err);
            res.send(remap.postsHotRemap(paginateHot(posts, req.params.page), req.user));
        });
    });

    var computeSkip = function(page) {
        page = parseInt(page);
        if (page < 0) page = 0;
        return (page - 1) * 8;
    };

    var paginateHot = function(posts, page) {
        var skip = computeSkip(page);
        var end = skip + 8;
        if (end < posts.length) end = posts.length;
        return _.slice(posts, skip, end);
    };
};