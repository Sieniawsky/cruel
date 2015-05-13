/* Initialize the feed */
$(function() {

    /* Parse initData */
    var temp = $('#init-data');
    var initData = JSON.parse(temp.html());
    console.log(initData);

    /* Initialize Login/Signup/Username */
    var links = $('.js-links');

    if (initData.user._id !== undefined) {
        /* User is logged */
        links.empty();
        var username_template = _.template($('#username-template').html());
        links.append(username_template(initData.user));
    }

    /* Generate feed */
    var post_template = _.template($('#post-template').html());
    var posts = $('.js-posts');
    _.each(initData.data, function(post) {
        posts.prepend(post_template(post));
    });
});
