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

    /* Get top posts for the current week */
    app.get('/api/feed/week/:page', function(req, res) {
        var date = new Date;
        var firstDay = date.getDate() - date.getDay();
        console.log(firstDay);
        //var first = new Date(date.setDate(firstDay));
        //var last = new Date(date.setDate(firstDay + 6));
        console.log('Before first');
        var first = new Date(date.getFullYear(), date.getMonth(), firstDay);
        console.log('After first, before last');
        var last = new Date(date.getFullYear(), date.getMonth(), firstDay + 6);
        console.log('After last');

        console.log('Week');
        console.log(first);
        console.log(last);

        var query = Post
            .find({'$and': [{date: {'$gte': first}}, {date: {'$lte': last}}]})
            .sort({score: -1})
            .skip(computeSkip(req.params.page))
            .limit(8);
        query.exec(function(err, posts) {
            console.log('we made it');
            if (err) return console.error(err);
            res.send(remap.postsRemap(posts, req.user));
        });
    });

    /* Get top posts for the current month */
    app.get('/api/feed/month/:page', function(req, res) {
        var date = new Date();
        var first = new Date(date.getFullYear(), date.getMonth(), 1);
        var last = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        console.log('Month');
        console.log(first);
        console.log(last);

        var query = Post
            .find({'$and': [{date: {'$gte': first}}, {date: {'$lte': last}}]})
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