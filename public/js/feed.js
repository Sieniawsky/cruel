/* Initialize the feed */
$(function() {
    /* Generate feed */
    var post_template = _.template($('#post-template').html());
    var posts = $('.js-posts');
    _.each(initData.data, function(post) {
        posts.append(post_template(post));
    });
});
