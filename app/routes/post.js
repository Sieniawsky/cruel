/* Routes for posts */
var _      = require('lodash');
var moment = require('moment');
var Post   = require('../models/post');
var User   = require('../models/user');
var remap  = require('../utils/remap');

module.exports = function(app, passport) {
    /* Post composition page */
    app.get('/post', function(req, res) {
        res.render('compose', {
            initData : JSON.stringify({
                user : remap.userRemap(req.user)
            })
        });
    });

    app.get('/post/:id', function(req, res) {
        Post.findOne({_id: req.params.id}, function(err, post) {
            if (err) return console.error(err);
            User.findById(post._user, function(err, user) {
                if (err) return console.error(err);
                res.render('post', {
                    initData : JSON.stringify({
                        post : remap.postRemap(post, user)
                    }),
                    user : remap.userRemap(req.user)
                });
            });
        });
    });

    /* Post handler */
    app.post('/post', function(req, res) {
        var data = _.extend({date: new Date()}, req.body);
        data = _.omit(data, function(value) {
            return value === '';
        });
        var post = new Post(data);
        post.save(function(err, post) {
            if (err) return console.error(err);
            res.redirect('/');
        });
    });
};