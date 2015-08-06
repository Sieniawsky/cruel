var $ = require('jquery');
var _ = require('lodash');
var Backbone = require('backbone');
Backbone.$ = $;

var EditProfile = Backbone.View.extend({

    el: '.js-edit-profile',

    initialize: function() {
        this.$url = $('.js-url');
        this.$description = $('.js-description');
        this.render();
    },

    render: function() {
        this.$url.val(initData.user.imageUrl);
        this.$description.val(initData.user.description);    
    }
});

$(function() {
    var editProfile = new EditProfile();
});