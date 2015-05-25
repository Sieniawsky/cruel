/* API routes for the feed */
module.exports = function(app, passport) {
    /* Get posts depending on page number */
    app.get('/:page(\\d+)/:id', function(req, res) {
        var query = Post.find({_id: {'$lt': req.params.id}}).limit(8).sort({'date': -1});
        query.exec(function(err, posts) {
            if (err) return console.error(err);
            res.send(remap.postsRemap(posts, req.user));
        });
    });
};