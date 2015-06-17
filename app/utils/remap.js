/* Utility module for remaping mongoose objects
   for use client-side */
var _      = require('lodash');
var moment = require('moment');

module.exports = {
    postsRemap : function(posts, user) {
        return _.map(posts, function(post) {
            var snippet = post.description.length == 0 ? '' : post.description.substring(0, 60).concat('...');
            return {
                _id           : post._id,
                title         : post.title,
                url           : post.url,
                date          : moment(new Date(post.date)).fromNow(),
                rawDate       : post.date,
                description   : post.description,
                snippet       : snippet,
                _user         : post._user,
                _username     : post._username,
                score         : post.score,
                liked         : beenLiked(post.likers, ((_.isEmpty(user)) ? '' : String(user._id))),
                likers        : post.likers,
                hotScore      : 0,
                _location     : post._location,
                _locationName : post._locationName
            };
        });
    },

    postRemap : function(post, user) {
        var snippet = post.description.length == 0 ? '' : post.description.substring(0, 60).concat('...');
        return {
            _id           : post._id,
            title         : post.title,
            url           : post.url,
            date          : moment(new Date(post.date)).fromNow(),
            rawDate       : post.date,
            description   : post.description,
            snippet       : snippet,
            _user         : post._user,
            _username     : post._username,
            score         : post.score,
            liked         : beenLiked(post.likers, ((_.isEmpty(user)) ? '' : String(user._id))),
            likers        : post.likers,
            hotScore      : 0,
            _location     : post._location,
            _locationName : post._locationName
        };
    },

    postsHotRemap : function(posts, user) {
        return _(posts)
            .map(function(post) {
                var hours = Math.abs(new Date(post.date) - new Date()) / 36e5;
                var snippet = post.description.length == 0 ? '' : post.description.substring(0, 60).concat('...');
                return {
                    _id           : post._id,
                    title         : post.title,
                    url           : post.url,
                    date          : moment(new Date(post.date)).fromNow(),
                    rawDate       : post.date,
                    description   : post.description,
                    snippet       : snippet,
                    _user         : post._user,
                    _username     : post._username,
                    score         : post.score,
                    liked         : beenLiked(post.likers, ((_.isEmpty(user)) ? '' : String(user._id))),
                    likers        : post.likers,
                    hotScore      : Math.round(((post.score + 9)/Math.pow(hours + 2, 1.2)) * 100)/100,
                    _location     : post._location,
                    _locationName : post._locationName
                };    
            })
            .sortBy(function(post) {
                return -post.hotScore;
            })
            .value();
    },

    userRemap : userRemap = function(data) {
        if (typeof data !== "undefined" && data !== null) {
            var user = _.pick(data, ['_id', 'username', 'email', 'date']);
            var user = {
                _id           : data._id,
                username      : data.username,
                email         : data.email,
                date          : data.date,
                _location     : data._location,
                _locationName : data._locationName
            };
        }
        return user || {};
    },

    locationRemap : function(locations) {
        return _.map(locations, function(location) {
            return {
                _id     : location._id,
                name    : location.name,
                city    : location.city,
                country : location.country
            };
        });
    },

    beenLiked : beenLiked = function(likers, id) {
        var x = false;
        _.each(likers, function(liker) {
            if (liker == id) x = true;
        });
        return x;
    }
};