/* Routes for users */
var _      = require('lodash');
var Post   = require('../models/post');
var User   = require('../models/user');
var remap  = require('../utils/remap');
var bg     = require('../utils/background.js');

module.exports = function(app, passport) {
    app.get('/u/:username', function(req, res) {
        User.findOne({username: req.params.username}, function(err, user) {
            if (err) return console.log(err);
            Post.find({_user: user._id}, function(err, posts) {
                if (err) return console.error(err);

                var back = bg();
                console.log('background: ' + back);
                
                res.render('user', {
                    initData  : JSON.stringify({
                        user  : remap.userRemap(user),
                        posts : remap.postsRemap(posts, user)
                    }),
                    user       : remap.userRemap(req.user),
                    background : back
                });
            });
        });
    });
};
