/* Routes for posts */
var _      = require('lodash');
var Post   = require('../../models/post');
var User   = require('../../models/user');
var remap  = require('../../utils/remap');

/* API routes for the feed */
module.exports = function(app, passport) {
    
    /* Get new posts */
    app.get('/api/feed/new/:location/:page', function(req, res) {
        var query = Post
            .find(computeLocationQuery(req.params.location))
            .skip(computeSkip(req.params.page))
            .sort({date: -1})
            .limit(8);
        query.exec(function(err, posts) {
            if (err) return console.error(err);
            res.send(remap.postsRemap(posts, req.user));
        });
    });

    /* Get top rated posts */
    app.get('/api/feed/top/:location/:page', function(req, res) {
        var query = Post
            .find(computeLocationQuery(req.params.location))
            .sort({score: -1})
            .skip(computeSkip(req.params.page))
            .limit(8);
        query.exec(function(err, posts) {
            if (err) return console.error(err);
            res.send(remap.postsRemap(posts, req.user));
        });
    });

    /* Get top posts for the current week */
    app.get('/api/feed/week/:location/:page', function(req, res) {
        var date = new Date;
        var firstDay = date.getDate() - date.getDay();
        var first = new Date(date.getFullYear(), date.getMonth(), firstDay);
        var last = new Date(date.getFullYear(), date.getMonth(), firstDay + 6);
        var query = Post
            .find(
                computeLocationQuery(req.params.location, {
                    '$and': [
                        {date: {'$gte': first}},
                        {date: {'$lte': last}}
                    ]
                }))
            .sort({score: -1})
            .skip(computeSkip(req.params.page))
            .limit(8);
        query.exec(function(err, posts) {
            if (err) return console.error(err);
            res.send(remap.postsRemap(posts, req.user));
        });
    });

    /* Get top posts for the current month */
    app.get('/api/feed/month/:location/:page', function(req, res) {
        var date = new Date();
        var first = new Date(date.getFullYear(), date.getMonth(), 1);
        var last = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        var query = Post
            .find(
                computeLocationQuery(req.params.location, {
                    '$and': [
                        {date: {'$gte': first}},
                        {date: {'$lte': last}}
                    ]
                }))
            .sort({score: -1})
            .skip(computeSkip(req.params.page))
            .limit(8);
        query.exec(function(err, posts) {
            if (err) return console.error(err);
            res.send(remap.postsRemap(posts, req.user));
        });
    });

    /* Get hot posts */
    app.get('/api/feed/hot/:location/:page', function(req, res) {
        var range = new Date();
        range.setDate(range.getDate() - 2);
        var query = Post.find(
            computeLocationQuery(req.params.location, {
                date: {'$gte': range}
            }));
        query.exec(function(err, posts) {
            if (err) return console.error(err);
            var temp = remap.postsHotRemap(posts, req.user);
            res.send(paginateHot(temp, req.params.page));
        });
    });

    /* Get new posts for a given user */
    app.get('/api/feed/:user/new/:page', function(req, res) {
        var query = Post
            .find({_user: req.params.user})
            .sort({date: 1})
            .skip(computeSkip(req.params.page))
            .limit(8);
        query.exec(function(err, posts) {
            if (err) return console.error(err);
            res.send(remap.postsRemap(posts, req.user));
        });
    });

    /* Get top posts for a given user */
    app.get('/api/feed/:user/top/:page', function(req, res) {
        var query = Post
            .find({_user: req.params.user})
            .sort({score: -1})
            .skip(computeSkip(req.params.page))
            .limit(8);
        query.exec(function(err, posts) {
            if (err) return console.error(err);
            res.send(remap.postsRemap(posts, req.user));
        });
    });

    var computeLocationQuery = function(location, other) {
        var other = other || {};
        var query = _.extend(other, {});
        if (location !== 'all') {
            query = _.extend(query, {_location: location});
        }
        return query;
    };

    var computeSkip = function(page) {
        page = parseInt(page);
        if (page < 0) page = 0;
        return (page - 1) * 8;
    };

    var paginateHot = function(posts, page) {
        var skip = computeSkip(page);
        var end = skip + 8;
        if (end > posts.length) end = posts.length;
        return _.slice(posts, skip, end);
    };
};