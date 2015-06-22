/* Routes for the index feed of the application */
var _        = require('lodash');
var Post     = require('../models/post');
var User     = require('../models/user');
var remap    = require('../utils/remap');
var app      = require('../../server');
var bg       = require('../utils/background.js');

module.exports = function(app, passport) {
    /* Index feed page */
    app.get('/', function(req, res) {
        var query = Post.find().sort({date: 1}).limit(8);
        query.exec(function(err, posts) {
            if (err) return console.error(err);
            res.render('feed', {
                initData : JSON.stringify({
                    user : remap.userRemap(req.user)
                }),
                user       : remap.userRemap(req.user),
                locations  : app.get('locations'),
                background : bg()
            });
        });
    });
};