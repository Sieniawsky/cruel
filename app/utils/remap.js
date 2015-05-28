/* Utility module for remaping mongoose objects
   for use client-side */
var _      = require('lodash');
var moment = require('moment');

module.exports = {
    postsRemap : function(posts, user) {
        return _.map(posts, function(post) {

            return {
                _id         : post._id,
                title       : post.title,
                url         : post.url,
                date        : moment(new Date(post.date)).fromNow(),
                rawDate     : post.date,
                description : post.description,
                _user       : post._user,
                _username   : post._username,
                score       : post.score,
                liked       : beenLiked(post.likers, ((_.isEmpty(user)) ? '' : String(user._id))),
                likers      : post.likers,
                hotScore    : 0
            };
        });
    },

    postRemap : function(post, user) {
        return {
            _id         : post._id,
            title       : post.title,
            url         : post.url,
            date        : moment(new Date(post.date)).fromNow(),
            rawDate     : post.date,
            description : post.description,
            _user       : post._user,
            _username   : post._username,
            score       : post.score,
            liked       : beenLiked(post.likers, ((_.isEmpty(user)) ? '' : String(user._id))),
            likers      : post.likers,
            hotScore    : 0
        };
    },

    postsHotRemap : function(posts, user) {
        return _(posts)
            .map(function(post) {
                var hours = Math.abs(new Date(post.date) - new Date()) / 36e5;
                return {
                    _id         : post._id,
                    title       : post.title,
                    url         : post.url,
                    date        : moment(new Date(post.date)).fromNow(),
                    rawDate     : post.date,
                    description : post.description,
                    _user       : post._user,
                    _username   : post._username,
                    score       : post.score,
                    liked       : beenLiked(post.likers, ((_.isEmpty(user)) ? '' : String(user._id))),
                    likers      : post.likers,
                    hotScore    : Math.ceil(((post.score + 9)/Math.pow(hours + 2, 1.2)))
                };    
            })
            .sortBy(function(post) {
                return -post.hotScore;
            });
    },

    userRemap : userRemap = function(data) {
        if (typeof data !== "undefined" && data !== null) {
            var user = _.pick(data, ['_id', 'username', 'email', 'date']);
        }
        return user || {};
    },

    beenLiked : beenLiked = function(likers, id) {
        var x = false;
        _.each(likers, function(liker) {
            if (liker == id) x = true;
        });
        return x;
    }
};