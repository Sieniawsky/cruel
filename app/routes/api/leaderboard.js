/* Routes for the leaderboard */
var _      = require('lodash');
var Post   = require('../../models/post');
var User   = require('../../models/user');
var remap  = require('../../utils/remap');
var config = require('../../../server').get('config');

var leaderboard_size = 25;

module.exports = function(app, passport) {

    app.get('/api/leaderboard/:location/top', function(req, res) {
        var query = User
            .find(computeLocationQuery(req.params.location, {}))
            .sort({score: -1})
            .limit(leaderboard_size);
        query.exec(function(err, users) {
            if (err) return console.error(err);
            res.send(remap.usersRemap(users));
        });
    });

    app.get('/api/leaderboard/:location/week', function(req, res) {
        var date = new Date();
        var firstDay = date.getDate() - date.getDay();
        var first = new Date(date.getFullYear(), date.getMonth(), firstDay);
        var last = new Date(date.getFullYear(), date.getMonth(), firstDay + 6);
        var query = User
            .find(computeLocationQuery(req.params.location, {
                '$and': [
                    {date: {'$gte': first}},
                    {date: {'$lte': last}}
                ]
            }))
            .sort({weekScore: -1})
            .limit(leaderboard_size);
        query.exec(function(err, users) {
            if (err) return console.error(err);
            res.send(remap.usersRemap(users));
        });
    });

    app.get('/api/leaderboard/:location/month', function(req, res) {
        var date = new Date();
        var first = new Date(date.getFullYear(), date.getMonth(), 1);
        var last = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        var query = User
            .find(computeLocationQuery(req.params.location, {
                '$and': [
                    {date: {'$gte': first}},
                    {date: {'$lte': last}}
                ]
            }))
            .sort({monthScore: -1})
            .limit(leaderboard_size);
        query.exec(function(err, users) {
            if (err) return console.error(err);
            res.send(remap.usersRemap(users));
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
};