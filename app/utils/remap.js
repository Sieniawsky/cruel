/* Utility module for remaping mongoose objects
   for use client-side */
var _       = require('lodash');
var moment  = require('moment');
var shortID = require('mongodb-short-id');

module.exports = {
    postsRemap : function(posts, user) {
        return _.map(posts, function(post) {
            return singlePostRemap(post, user);
        });
    },

    postRemap : function(post, user) {
        return singlePostRemap(post, user);
    },

    postsHotRemap : function(posts, user) {
        return _(posts)
            .map(function(post) {
                var hours = Math.abs(new Date(post.date) - new Date()) / 36e5;
                var hotPost = singlePostRemap(post, user);
                hotPost.hotScore = Math.round(((post.score + 9)/Math.pow(hours + 2, 1.2)) * 100)/100;
                return hotPost;
            })
            .sortBy(function(post) {
                return -post.hotScore;
            })
            .value();
    },

    singlePostRemap : singlePostRemap = function(post, user) {
        var snippet = post.description.length == 0 ? '' : post.description.substring(0, 160);
        var comments = commentsRemap(post.comments, user);
        var mapped = {
            _id           : post._id,
            _shortID      : shortID.o2s(post._id),
            title         : post.title,
            url           : post.url,
            date          : moment(new Date(post.date)).fromNow(),
            rawDate       : post.date,
            description   : post.description.replace(/\r?\n/g, '<br/>'),
            formatted     : post.formatted,
            snippet       : snippet,
            prettySnippet : prettySnippet(post.title),
            _user         : post._user,
            _username     : post._username,
            score         : post.score,
            liked         : beenLiked(post.likers, ((_.isEmpty(user)) ? '' : String(user._id))),
            likers        : post.likers,
            hotScore      : 0,
            _location     : post._location,
            _locationName : post._locationName,
            comments      : comments,
            commentNumber : comments.length,
            commentText   : (comments.length == 1) ? 'comment' : 'comments',
            type          : post.type
        };
        mapped.postURL = '/post/' + mapped._shortID + '/' + mapped.prettySnippet;
        return mapped;
    },

    userRemap : userRemap = function(data) {
        if (typeof data !== "undefined" && data !== null) {

            /* Take the scoreNotifications and commentNotifications
               arrays from the database and map them into usable objects. */
            var notificationCount   = 0;
            var mappedPostScore = _(data.postScoreNotifications)
                .groupBy(function(m) {
                    return m._post;
                })
                .map(function(n) {
                    notificationCount += n.length;
                    return {
                        _post    : n[0]._post,
                        title    : n[0].title,
                        url      : n[0].url,
                        snippet  : n[0].title.substring(0, 40).concat(' ...'),
                        newScore : n.length  
                    };
                }).value();

            var mappedCommentScore = _(data.commentScoreNotifications)
                .groupBy(function(m) {
                    return m._post;
                })
                .map(function(n) {
                    notificationCount += n.length;
                    return {
                        _post    : n[0]._post,
                        _comment : n[0]._comment,
                        comment  : n[0].comment,
                        url      : n[0].url,
                        snippet  : n[0].comment.substring(0, 40).concat(' ...'),
                        newScore : n.length
                    };
                }).value();

            var mappedNewComments = _(data.commentNotifications)
                .groupBy(function(m) {
                    return m._post;
                })
                .map(function(n) {
                    notificationCount += n.length;
                    return {
                        _post       : n[0]._post,
                        _comment    : n[0]._comment,
                        title       : n[0].title,
                        url         : n[0].url,
                        snippet     : n[0].title.substring(0, 40).concat(' ...'),
                        newComments : n.length
                        };
                }).value();

            /* Generate the final user object */
            var user = {
                _id           : data._id,
                username      : data.username,
                email         : data.email,
                rawDate       : data.date,
                date          : moment(new Date(data.date).getTime()).fromNow(),
                imageUrl      : data.imageUrl,
                description   : data.description,
                score         : data.score,
                _location     : data._location,
                _locationName : data._locationName,
                notifications : {
                    hasNew        : notificationCount > 0,
                    notifications : notificationCount,
                    postScore     : mappedPostScore,
                    commentScore  : mappedCommentScore,
                    newComments   : mappedNewComments
                }
            };
        }
        return user || {};
    },

    usersRemap : function(users) {
        return _.map(users, function(user) {
            return {
                _id           : user._id,
                username      : user.username,
                email         : user.email,
                rawDate       : user.date,
                date          : moment(new Date(user.date).getTime()).fromNow(),
                imageUrl      : user.imageUrl,
                description   : user.description,
                rank          : _.indexOf(users, user) + 1,
                score         : user.score,
                _location     : user._location,
                _locationName : user._locationName,
            };
        });
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

    commentsRemap : commentsRemap = function(comments, user) {
        return _.map(comments, function(comment) {
            return {
                _id       : comment._id,
                _user     : comment._user,
                _username : comment._username,
                comment   : comment.comment,
                score     : comment.score,
                rawDate   : new Date(comment.date),
                date      : moment(new Date(comment.date)).fromNow(),
                liked     : beenLiked(comment.likers, ((_.isEmpty(user)) ? '' : String(user._id)))
            };
        });
    },

    /* Trim to 100 character, then trim to last space to preserve whole words*/
    prettySnippet : prettySnippet = function(title) {
        var trimmed = title.substr(0, 100);
        var lastIndex = trimmed.lastIndexOf(' ');
        if (lastIndex != -1) {
            trimmed = trimmed.substr(0, Math.min(trimmed.length, trimmed.lastIndexOf(' ')));
            trimmed = trimmed.replace(new RegExp(' ', 'g'), '_');
        }
        return trimmed;
    },

    beenLiked : beenLiked = function(likers, id) {
        var x = false;
        _.each(likers, function(liker) {
            if (liker == id) x = true;
        });
        return x;
    }
};
