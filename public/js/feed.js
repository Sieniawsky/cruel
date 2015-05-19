/* Initialize the feed */
$(function() {
    /* Generate feed */
    var post_template = _.template($('#post-template').html());
    var posts = $('.js-posts');
    _.each(initData.data, function(post) {
        posts.append(post_template(post));
    });

    /* Hook scroll for async feed load */
    var page = 1;
    var has_next = true;
    $(window).scroll(function() {
        if (($(window).scrollTop() == $(document).height() - $(window).height()) && has_next) {
            var last_id = initData.data[initData.data.length - 1]._id;
            loadPosts(page, last_id);
            page++;
        }
    });

    /* Asynchronously loads the next page of posts */
    var loadPosts = function(page, last) {
        // Show the loading .gif
        $('.js-loading').append(_.template($('#loading-template').html())());
        // AJAX TINGZ
        $.ajax({
            url : '/' + page,
            data : 'last_id=' + last,
            type : 'GET',
            success : function(data) {
                // Hide loading gif
                $('.js-loading').first().remove();

                if (data.length < 8) {
                    // Add warning
                    has_next = false;
                    return;
                }

                // Append posts
                _.each(data, function(elem) {
                    var post_template = _.template($('#post-template').html());
                    var posts = $('.js-posts');
                    posts.append(post_template(elem));
                });
            },
            failure : function(data) {
                // Hide loading gif
                $('.js-loading').first().remove();
                // Show error message
            }
        });
    };
});
