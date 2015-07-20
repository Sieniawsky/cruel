var _ = require('lodash');
var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;

var Leaderboard = Backbone.View.extend({

    el: '.js-app',

    events: {},

    initialize: function() {
        this.nav = nav || {};
        this.$locationName = $('.js-location-name');
        this.$sort = $('.js-sort');
        this.$location = $('.js-location');

        if (typeof initData.user._location != 'undefined') {
            this.location = initData.user._location;
            this.$location.val(this.location);
        } else {
            this.location = 'all';
            this.$location.val('all');
        }

        this.render();
    },

    render: function() {
        this.$locationName.empty();
        this.$locationName.html($('.js-location option:selected').text());
    }
});

$(function() {
    var leaderboard = new Leaderboard();
});