/* Routes for posts */
var _       = require('lodash');
var shortID = require('mongodb-short-id');
var url     = require('url');
var Post    = require('../models/post');
var User    = require('../models/user');
var remap   = require('../utils/remap');
var bg      = require('../utils/background');
var exists  = require('../utils/exists');
var config  = require('../../server').get('config');

module.exports = function(app, passport) {
    /* Post composition page */
    app.get('/post', function(req, res) {
        res.render('compose', {
            initData : JSON.stringify({
                user : remap.userRemap(req.user)
            }),
            user       : remap.userRemap(req.user),
            background : bg()
        });
    });

    /* Get a single specific post */
    app.get('/post/:shortID/:prettySnippet', function(req, res) {
        var id = shortID.s2l(req.params.shortID);
        Post.findOne({_id: id}, function(err, post) {
            if (err) return console.error(err);
            if (exists(post)) {
                res.render('post', {
                    initData : JSON.stringify({
                        post : remap.postRemap(post, req.user),
                        user : remap.userRemap(req.user)
                    }),
                    post       : remap.postRemap(post, req.user),
                    user       : remap.userRemap(req.user),
                    redirect   : generateRedirect(req.headers.referer),
                    background : bg()
                });               
            } else {
                res.redirect('/404');
            }
        });
    });

    app.get('/post/:id', function(req, res) {
        Post.findOne({_id: req.params.id}, function(err, post) {
            if (err) return console.error(err);
            var remapped = remap.postRemap(post);
            var url = '/post/' + remapped._shortID + '/' + remapped.prettySnippet;
            res.redirect(url);
        });
    });

    /* Post handler */
    app.post('/post', function(req, res) {
        if (typeof req.user._id != 'undefined' && req.user._id != null) {
            var data = _.extend(req.body, {
                date          : new Date(),
                _user         : req.user._id,
                _username     : req.user.username,
                _location     : req.user._location,
                _locationName : req.user._locationName
            });
            data = _.omit(data, function(value) {
                return value === '';
            });
            var post = new Post(data);
            post.save(function(err, post) {
                if (err) return console.error(err);
                var remapped = remap.postRemap(post);
                res.redirect('/post/' + shortID.o2s(post._id) + '/' + remapped.prettySnippet);
            });
        } else {
            res.send({outcome: false});
        }
    });

    var generateRedirect = function(referer) {
        var redirect;
        if (typeof referer == 'undefined' || referer == null) {
            redirect = '/';
        } else if (url.parse(referer).host === config.host && url.parse(referer).pathname !== '/post') {
            redirect = referer;
        } else {
            redirect = '/';
        }
        return redirect;
    };
};
