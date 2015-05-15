/* Initialize the feed */
$(function() {
    /* Generate feed */
    var post_template = _.template($('#post-template').html());
    var posts = $('.js-posts');
    _.each(initData.data, function(post) {
        posts.append(post_template(post));
    });

    var page = 1;
    var posts_per_page = 16;
    $(window).scroll(function() {
        if ($(window).scrollTop() == $(document).height() - $(window).height()) {
            loadPosts(page);
            page++;
        }
    });

    /* Asynchronously loads the next page of posts */
    var loadPosts = function(page) {
        // Show the loading .gif
        $('.js-loading').append(_.template($('#loading-template').html())());
        // AJAX TINGZ
        $.ajax({
            url : '/' + page,
            type : 'GET',
            success : function(data) {
                // Hide loading gif
                $('.js-loading').first().remove();
                // Append posts
                _.each(data, function(elem) {
                    var post_template = _.template($('#post-template').html());
                    var posts = $('.js-posts');
                    posts.append(post_template(elem));
                });
            },
            failure : function(data) {
                // Hide loading gif
                // Show error message
            }
        });
    };
});
