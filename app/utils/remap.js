/* Utility module for remaping mongoose objects
   for use client-side */
var _      = require('lodash');
var moment = require('moment');

module.exports = {
    postsRemap : function(data) {
        return _.map(data, function(elem) {
            return {
                _id         : elem._id,
                title       : elem.title,
                url         : elem.url,
                date        : moment(new Date(elem.date)).fromNow(),
                description : elem.description,
                _user       : elem._user,
                _username   : elem._username,
                votes       : elem.votes
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
            user        : userRemap(user)
        };
    },

    userRemap : userRemap = function(data) {
        if (typeof data !== "undefined" && data !== null) {
            var user = _.pick(data, ['_id', 'username', 'email']);
        }
        return user || {};
    }
};