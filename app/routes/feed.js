/* Routes for the index feed of the application */
var _      = require('lodash');
var moment = require('moment');
var Post   = require('../models/post');
var User   = require('../models/user');
var remap  = require('../utils/remap');

module.exports = function(app, passport) {
    /* Index feed page */
    app.get('/', function(req, res) {
        Post.find(function(err, posts) {
            if (err) return console.error(err);

            res.render('feed', {
                initData : JSON.stringify({
                    data : remap.postsRemap(posts)
                }),
                user : remap.userRemap(req.user)
            });
        });
    });
};