/* Routes for posts */
var _      = require('lodash');
var Post   = require('../../models/post');
var User   = require('../../models/user');
var remap  = require('../../utils/remap');

/* API routes for the feed */
module.exports = function(app, passport) {
    /* Get posts depending on page number */
    app.get('/api/feed/:id', function(req, res) {
        var query = Post.find({_id: {'$lt': req.params.id}}).limit(8);
        query.exec(function(err, posts) {
            if (err) return console.error(err);
            res.send(remap.postsRemap(posts, req.user));
        });
    });
};