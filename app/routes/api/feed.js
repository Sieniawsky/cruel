/* Routes for posts */
var _      = require('lodash');
var Post   = require('../../models/post');
var User   = require('../../models/user');
var remap  = require('../../utils/remap');
var config = require('../../../server').get('config');

var page_size = config.page_size;

/* API routes for the feed */
module.exports = function(app, passport) {

    /* Get new posts for a given user */
    app.get('/api/feed/user/:user/new/:page', function(req, res) {
        var query = Post
            .find({_user: req.params.user, deleted: false})
            .sort({date: 1})
            .skip(computeSkip(req.params.page))
            .limit(page_size);
        query.exec(function(err, posts) {
            if (err) return console.error(err);
            res.send(remap.postsRemap(posts, req.user));
        });
    });

    /* Get top posts for a given user */
    app.get('/api/feed/user/:user/top/:page', function(req, res) {
        var query = Post
            .find({_user: req.params.user, deleted: false})
            .sort({score: -1})
            .skip(computeSkip(req.params.page))
            .limit(page_size);
        query.exec(function(err, posts) {
            if (err) return console.error(err);
            res.send(remap.postsRemap(posts, req.user));
        });
    });
    
    /* Get new posts */
    app.get('/api/feed/:location/new/:page', function(req, res) {
        var query = Post
            .find(computeLocationQuery(req.params.location, {deleted: false}))
            .sort({date: -1})
            .skip(computeSkip(req.params.page))
            .limit(page_size);
        query.exec(function(err, posts) {
            if (err) return console.error(err);
            res.send(remap.postsRemap(posts, req.user));
        });
    });

    /* Get top rated posts */
    app.get('/api/feed/:location/top/:page', function(req, res) {
        var query = Post
            .find(computeLocationQuery(req.params.location, {deleted: false}))
            .sort({score: -1})
            .skip(computeSkip(req.params.page))
            .limit(page_size);
        query.exec(function(err, posts) {
            if (err) return console.error(err);
            res.send(remap.postsRemap(posts, req.user));
        });
    });

    /* Get top posts for the current week */
    app.get('/api/feed/:location/week/:page', function(req, res) {
        var date = new Date();
        var firstDay = date.getDate() - date.getDay();
        var first = new Date(date.getFullYear(), date.getMonth(), firstDay);
        var last = new Date(date.getFullYear(), date.getMonth(), firstDay + 6);
        var query = Post
            .find(computeLocationQuery(req.params.location, {
                deleted: false,
                '$and': [
                    {date: {'$gte': first}},
                    {date: {'$lte': last}}
                ]
            }))
            .sort({score: -1})
            .skip(computeSkip(req.params.page))
            .limit(page_size);
        query.exec(function(err, posts) {
            if (err) return console.error(err);
            res.send(remap.postsRemap(posts, req.user));
        });
    });

    /* Get top posts for the current month */
    app.get('/api/feed/:location/month/:page', function(req, res) {
        var date = new Date();
        var first = new Date(date.getFullYear(), date.getMonth(), 1);
        var last = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        var query = Post
            .find(computeLocationQuery(req.params.location, {
                deleted: false,
                '$and': [
                    {date: {'$gte': first}},
                    {date: {'$lte': last}}
                ]
            }))
            .sort({score: -1})
            .skip(computeSkip(req.params.page))
            .limit(page_size);
        query.exec(function(err, posts) {
            if (err) return console.error(err);
            res.send(remap.postsRemap(posts, req.user));
        });
    });

    /* Get hot posts */
    app.get('/api/feed/:location/hot/:page', function(req, res) {
        var range = new Date();
        range.setDate(range.getDate() - 2);
        var query = Post.find(
            computeLocationQuery(req.params.location, {
                deleted: false,
                date: {'$gte': range}
            }));
        query.exec(function(err, posts) {
            if (err) return console.error(err);
            var temp = remap.postsHotRemap(posts, req.user);
            res.send(paginateHot(temp, req.params.page));
        });
    });

    var computeLocationQuery = function(location, data) {
        var options = data || {};
        var query = _.extend(options, {});
        if (location !== 'all') {
            query = _.extend(query, {_location: location});
        }
        return query;
    };

    var computeSkip = function(page) {
        page = parseInt(page);
        if (page < 0) page = 0;
        return (page - 1) * page_size;
    };

    var paginateHot = function(posts, page) {
        var skip = computeSkip(page);
        var end = skip + page_size;
        if (end > posts.length) end = posts.length;
        return _.slice(posts, skip, end);
    };
};