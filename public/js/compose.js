$(function() {

    // Add hidden user information to the form
    var input = $('<input>')
        .attr('type', 'hidden')
        .attr('name', '_user')
        .val(initData.user._id);
    $('.js-compose').append($(input));

    /* Hook form submit */
    $('.js-compose').submit(function(e) {
        /* Remove url from payload if empty */
        var url = $('#imageURL');
        if (url.val() === '') {
            url.remove();
        }
    });
});