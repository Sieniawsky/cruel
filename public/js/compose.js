$(function() {

    // Add hidden user information to the form
    var input = $('<input>')
        .attr('type', 'hidden')
        .attr('name', '_user')
        .val(initData.user._id);
    $('.js-compose').append($(input));
});