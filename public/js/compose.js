$(function() {
    /* Polyfill */
    H5F.setup(document.getElementById('compose'));

    // Add hidden user information to the form
    var _user = $('<input>')
        .attr('type', 'hidden')
        .attr('name', '_user')
        .val(initData.user._id);
    $('.js-compose').append($(_user));

    var _username = $('<input>')
        .attr('type', 'hidden')
        .attr('name', '_username')
        .val(initData.user.username);
    $('.js-compose').append($(_username));
});