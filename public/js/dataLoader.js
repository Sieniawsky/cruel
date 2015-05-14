/* Load initData and make it a global variable */
$(function() {
    var initData = JSON.parse($('#init-data').html());
    console.log(initData);
    window['initData'] = initData;
});