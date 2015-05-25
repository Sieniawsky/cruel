/* Routes for users */
var _      = require('lodash');
var Post   = require('../models/post');
var User   = require('../models/user');
var remap  = require('../utils/remap');

module.exports = function(app, passport) {
    app.get('/u/:username', function(req, res) {
        User.find({username: req.params.username}, function(err, user) {
            if (err) return console.log(err);
            Post.find({_user: req.user._id}, function(err, posts) {
                if (err) return console.error(err);
                
                res.render('user', {
                    initData  : JSON.stringify({
                        user  : remap.userRemap(req.user),
                        posts : posts
                    }),
                    user : remap.userRemap(req.user)
                });
            });
        });
    });
};
