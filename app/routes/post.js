/* Routes for posts */
var _       = require('lodash');
var shortID = require('mongodb-short-id');
var url     = require('url');
var async   = require('async');
var request = require('request');
var Post    = require('../models/post');
var User    = require('../models/user');
var remap   = require('../utils/remap');
var bg      = require('../utils/background');
var exists  = require('../utils/exists');
var parser  = require('../utils/parser');
var app     = require('../../server');
var config  = app.get('config');
var s3      = app.get('s3');
var stream  = require('s3-upload-stream')(s3);

module.exports = function(app, passport) {
    /* Post composition page */
    app.get('/post', function(req, res) {
        if (req.user) {
            var mappedUser = remap.userRemap(req.user);
            res.render('compose', {
                initData : JSON.stringify({
                    user : mappedUser
                }),
                user       : mappedUser,
                background : bg()
            });
        } else {
            res.redirect('/');
        }
    });

    /* Get a single specific post */
    app.get('/post/:shortID/:prettySnippet', function(req, res) {
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
                    redirect   : generateRedirect(req.headers.referer, remappedPost.postURL),
                    background : bg()
                });               
            } else {
                res.redirect('/404');
            }
        });
    });

    /* Post handler */
    app.post('/post', function(req, res) {
        if (typeof req.user._id !== 'undefined' && req.user._id !== null) {

            async.waterfall([
                function(next) {
                    if (typeof req.body.upload_url !== 'undefined' &&
                        req.body.upload_url !== null &&
                        req.body.upload_url !== '') {

                        req.body.url = req.body.upload_url;
                        delete req.body.upload_url;
                    }
                    next(null, req.body.url)
                },
                function(url, next) {
                    if (url === '') {
                        return next(null);
                    }
                    request.head(url, function(err, response, body) {
                        if (err) return console.error(err);
                        var filename = url.split('/').pop();
                        var filetype = response.headers['content-type'];
                        var upload = stream.upload({
                            Bucket      : 'cruelco',
                            Key         : filename,
                            ContentType : filetype,
                            ACL         : 'public-read'
                        });
                        upload.on('uploaded', function(details) {
                            req.body.url = details.Location;
                            next(null);
                        });
                        request(url).pipe(upload);
                    });
                },
                function(next) {
                    var data = _.extend(req.body, {
                        date          : new Date(),
                        _user         : req.user._id,
                        _username     : req.user.username,
                        _location     : req.user._location,
                        _locationName : req.user._locationName
                    });
                    parser.format(data.description, function(formatted) {
                        data.description = data.description.replace(/\r?\n/g, '<br/>');
                        data.formatted = formatted;
                        if (data.url === '') {
                            data.type = 'text';
                        }
                        data.likers = [data._user];
                        data = _.omit(data, function(value) {
                            return value === '';
                        });

                        var post = new Post(data);
                        post.save(function(err, post) {
                            if (err) return console.error(err);
                            var mapped = remap.postRemap(post);
                            next(null, mapped.postURL + '?newPost=true');
                        });
                    });
                }
            ], function(err, url) {
                if (err) return console.error(err);
                res.redirect(url);
            });
        } else {
            res.send({outcome: false});
        }
    });

    app.get('/sign_s3', function(req, res) {
        // Check for filname and type in query
        var params = {
            Bucket      : 'cruelco',
            Key         : req.query.file_name,
            ContentType : req.query.file_type,
            ACL         : 'public-read'
        };
        s3.getSignedUrl('putObject', params, function(err, data) {
            if (err) return console.error(err);
            var return_data = {
                signed_request : data,
                url            : config.s3_base + req.query.file_name
            };
            res.send(JSON.stringify(return_data));
        });
    });

    var generateRedirect = function(referer, postURL) {
        var redirect;
        if (typeof referer === 'undefined' || referer === null) {
            redirect = '/';
        } else if (_.contains(config.hosts, url.parse(referer).host) &&
            url.parse(referer).pathname !== '/post' &&
            referer !== postURL) {
            redirect = referer;
        } else {
            redirect = '/';
        }
        return redirect;
    };
};
