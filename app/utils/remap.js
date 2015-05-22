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
                description : post.description,
                _user       : post._user,
                _username   : post._username,
                score       : post.score,
                liked       : beenLiked(post.likers, ((_.isEmpty(user)) ? '' : String(user._id))),
                likers      : post.likers
            };
        });
    },

    postRemap : function(post, user) {
        return {
            _id         : post._id,
            title       : post.title,
            description : post.description,
            url         : post.url,
            _user       : post._user,
            _username   : post._username,
            user        : userRemap(user),
            score       : post.score,
            liked       : _.includes(post.likers, ((_.isEmpty(user)) ? '' : String(user._id)))
        };
    },

    userRemap : userRemap = function(data) {
        if (typeof data !== "undefined" && data !== null) {
            var user = _.pick(data, ['_id', 'username', 'email']);
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