/* API routes for post related data and actions */
module.exports = function(app, passport) {
    /* Perform a like operation if it's valid */
    app.post('/post/like', function(req, res) {
        // Check if allowed
        Post.findOne({_id: req.body.post._id, likers: req.body.user._id}, function(err, post) {
            if (err) return console.error(err);
            if (post == null) {
                // User has not voted on this post yet
                Post.update({_id: req.body.post._id},
                    {'$push': {likers: req.body.user._id}, '$inc': {score: 1}}, function(err, post) {
                    if (err) return console.error(err);
                    User.update({_id: req.body.user._id}, {'$inc': {score: 1}}, function(err, user) {
                        if (err) return console.error(err);
                        res.send({outcome: true});
                    });
                });
            }
        });
    });
};