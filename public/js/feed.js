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
        // AJAX TINGZ
        $.ajax({
            url : '/' + page + '/' + last,
            type : 'GET',
            success : function(data) {

                if (data.length < 8) has_next = false;

                var post_template = _.template($('#post-template').html());
                var posts = $('.js-posts');
                _.each(data, function(elem) {
                    posts.append(post_template(elem));
                });

                if (data.length < 8) {
                    has_next = false;
                    var completed_template = _.template($('#completed-template').html());
                    $('.js-posts').append(completed_template());
                }
            },
            failure : function(data) {
                var warning_template = _.template($('#warning-template').html());
                $('.js-posts').append(warning_template());
            }
        });
    };
});
