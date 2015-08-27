/* Routes for administrating the application */
var _        = require('lodash');
var mongoose = require('mongoose');
var shortID  = require('mongodb-short-id');
var json2csv = require('json2csv');
var fs       = require('fs');
var url      = require('url');
var app      = require('../../server');
var Post     = require('../models/post');
var User     = require('../models/user');
var remap    = require('../utils/remap');
var bg       = require('../utils/background');
var parser   = require('../utils/parser');
var exists   = require('../utils/exists');

module.exports = function(app, passport) {
    app.get('/admin', function(req, res) {
        if (req.user && req.user.privilege === 'admin') {
            res.render('admin', {
                initData : JSON.stringify({
                    user : remap.userRemap(req.user)
                }),
                user       : remap.userRemap(req.user),
                locations  : remap.locationRemap(app.get('locations')),
                background : bg()
            });
        } else {
            res.redirect('/');
        }
    });

    app.get('/admin/user/:username', function(req, res) {
        if (req.user && req.user.privilege === 'admin') {
            User.findOne({username: req.params.username, deleted: false}, function(err, user) {
                if (err) return console.error(err);
                if (exists(user)) {
                    Post.find({_user: user._id}, function(err, posts) {
                        if (err) return console.error(err);
                        var id = user._id;
                        var query = User.find({_location: user._location}).sort({score: -1});
                        query.exec(function(err, users) {
                            if (err) return console.error(err);
                            var rank = _.indexOf(users, _.find(users, function(user) {
                                return user._id.equals(id);
                            })) + 1;
                            res.render('user', {
                                initData : JSON.stringify({
                                    user         : remap.userRemap(req.user),
                                    selectedUser : _.extend(remap.userRemap(user), {rank: rank}),
                                    posts        : remap.postsRemap(posts, user)
                                }),
                                user       : remap.userRemap(req.user),
                                background : bg(),
                                partials   : {
                                    feedPostTemplate : 'partials/feed-post-template',
                                    feedScripts      : 'partials/feed-scripts',
                                    userDelete       : 'partials/user-delete'
                                }
                            });
                        });
                    });
                } else {
                    res.redirect('/404');
                }
            });
        } else {
            res.redirect('/');
        }
    });

    app.get('/admin/post/:shortID/:prettySnippet', function(req, res) {
        if (req.user && req.user.privilege === 'admin') {
            var id = shortID.s2l(req.params.shortID);
            Post.findOne({_id: id, deleted: false}, function(err, post) {
                if (err) return console.error(err);
                if (exists(post)) {
                    var remappedPost = remap.postRemap(post, req.user);
                    var remappedUser = remap.userRemap(req.user);
                    res.render('post', {
                        initData : JSON.stringify({
                            post : remappedPost,
                            user : remappedUser
                        }),
                        post       : remappedPost,
                        user       : remappedUser,
                        background : bg(),
                        partials   : {
                            postDelete    : 'partials/post-delete',
                            commentDelete : 'partials/comment-delete'
                        }
                    });               
                } else {
                    res.redirect('/404');
                }
            });
        } else {
            res.redirect('/');
        }
    });

    app.get('/admin/user', function(req, res) {
        if (req.user && req.user.privilege === 'admin') {
            var urlQuery = url.parse(req.url, true).query;
            var query = User.find(formatLocationQuery(urlQuery)).sort({date: 1});
            query.exec(function(err, users) {
                if (err) return console.error(err);
                var fields = ['username', 'location', 'email', 'date', 'score', 'weekScore', 'monthScore'];
                var mapped = remap.userDownloadRemap(users);
                json2csv({data: mapped, field: fields}, function(err, csv) {
                    if (err) return console.error(err);
                    var filename = generateFilename(urlQuery.location);
                    var mimetype = 'text/csv';
                    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
                    res.setHeader('Content-type', mimetype);
                    res.write(csv);
                    res.end();
                });
            });
        } else {
            res.send({outcome: false});
        }
    });

    app.post('/admin/post', function(req, res) {
        if (req.user && req.user.privilege === 'admin') {
            var locationElements = req.body.location.split(',');
            var data = _.extend(req.body, {
                date          : new Date(),
                _user         : req.user._id,
                _username     : req.user.username,
                _location     : locationElements[0],
                _locationName : locationElements[1]
            });
            parser.format(data.description, function(formatted) {
                data.description = data.description.replace(/\r?\n/g, '<br/>');
                data.formatted = formatted;
                data.priority = 'admin';
                if (data.url === '') {
                    data.type = 'text';
                }
                data = _.omit(data, function(value) {
                    return value === '';
                });

                var post = new Post(data);
                post.save(function(err, post) {
                    if (err) return console.error(err);
                    var mapped = remap.postRemap(post);
                    res.redirect(mapped.postURL);
                });
            });
        } else {
            res.send({outcome: false});
        }
    });

    app.delete('/admin/post/:id', function(req, res) {
        var deletePost = function() {
            Post.findByIdAndUpdate(id, {'$set': {deleted: true}}, function(err, result) {
                if (err) return console.error(err);
                updateUser(result);
            });
        };
        var updateUser = function(post) {
            User.update({_id: post._user}, {'$inc': {score: -post.score}}, function(err, result) {
                if (err) return console.error(err);
                var mapped = remap.postRemap(post, req.user);
                res.send({outcome: true});
            });
        };

        var id = req.params.id;
        if (isMongoObjectId(id)) {
            deletePost();
        } else {
            res.send({outcome: false});
        }
    });

    app.delete('/admin/post/comment/:id', function(req, res) {
        var deleteComment = function() {
            Post.update({
                'comments._id': mongoose.Types.ObjectId(id)},
                {'$set': {'comments.$.deleted': true}
            }, function(err, result) {
                if (err) return console.error(err);
                findPost();
            });
        };

        var findPost = function() {
            Post.findOne({_id: req.body.post._id}, function(err, post) {
                if (err) return console.error(err);
                updateUser(post);
            });
        };

        var updateUser = function(post) {
            var index = findIndex(post.comments, '_id', id);
            var comment = post.comments[index];
            User.update({_id: comment._user}, {'$inc': {score: -comment.score}}, function(err, result) {
                if (err) return console.error(err);
                res.send({outcome: true});
            });
        };

        var id = req.params.id;
        if (isMongoObjectId(id)) {
            deleteComment();
        } else {
            res.send({outcome: false});
        }
    });

    app.delete('/admin/user/:id', function(req, res) {
        var deleteUser = function() {
            User.findOneAndUpdate({_id: id}, {'$set': {deleted: true}}, function(err, result) {
                if (err) return console.error(err);
                deletePosts();
            });
        };

        var deletePosts = function() {
            Post.update({_user: id}, {'$set': {deleted: true}}, {multi: true}, function(err, result) {
                if (err) return console.error(err);
                res.send({outcome: true});
            });
        };

        var id = req.params.id;
        if (isMongoObjectId(id)) {
            deleteUser();
        } else {
            res.send({outcome: false});
        }
    });

    var isMongoObjectId = function(id) {
        var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
        return checkForHexRegExp.test(id);
    };

    var findIndex = function(array, attr, target) {
        var index = -1;
        for (var i = 0; i < array.length; i++) {
            if (array[i][attr] == target) {
                index = i;
                break;
            }
        }
        return index;
    };

    var formatLocationQuery = function(query) {
        var locationQuery = {};
        if (query && query.location && isMongoObjectId(query.location)) {
            locationQuery = {_location: query.location}
        }
        return locationQuery;
    };

    var generateFilename = function(location) {
        var filename = '';
        var locationName = 'All';
        if (location !== 'All') {
            locationName = _.find(app.get('locations'), function(loc) {
                return loc._id.equals(location);
            }).name;
        }
        var date = new Date();
        filename = [locationName, 'Users', date.getMonth(), date.getDate(), date.getYear()].join('-') + '.csv';
        return filename;
    };
};
