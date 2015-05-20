/* Routes for the index feed of the application */
var _      = require('lodash');
var moment = require('moment');
var Post   = require('../models/post');
var User   = require('../models/user');
var remap  = require('../utils/remap');

module.exports = function(app, passport) {
    /* Index feed page */
    app.get('/', function(req, res) {
        var query = Post.find({}, {voters: 0}).limit(8).sort({'date': -1});
        query.exec(function(err, posts) {
            if (err) return console.error(err);
            res.render('feed', {
                initData : JSON.stringify({
                    data : remap.postsRemap(posts),
                    user : remap.userRemap(req.user)
                }),
                user : remap.userRemap(req.user)
            });
        });
    });

    /* Get posts depending on page number */
    app.get('/:page(\\d+)/:id', function(req, res) {
        var query = Post.find({_id: {'$lt': req.params.id}}).limit(8).sort({'date': -1});
        query.exec(function(err, posts) {
            if (err) return console.error(err);
            res.send(remap.postsRemap(posts));
        });
    });
};