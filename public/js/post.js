$(function() {
    /* Generate feed */
    var post_template = _.template($('#post-detail-template').html());
    var posts = $('.js-post');
    posts.append(post_template(initData.post));
});