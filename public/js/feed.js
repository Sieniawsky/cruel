/* Initialize the feed */
$(function() {
    var temp = $('#init-data');
    var initData = JSON.parse(temp.html());
    console.log(initData);
    var post_template = _.template($('#post-template').html());
    var posts = $('.js-posts');
    _.each(initData.data, function(post) {
        posts.prepend(post_template(post));
    });
});
