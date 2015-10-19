var _ = require('lodash');
var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;

var Leaderboard = Backbone.View.extend({

    el: '.js-app',

    events: {
        'change .js-sort'     : 'load',
        'change .js-location' : 'load'
    },

    initialize: function() {
        this.users         = [];
        this.nav           = nav || {};
        this.$leaderboard  = $('.js-leaderboard');
        this.$locationName = $('.js-location-name');
        this.$sort         = $('.js-sort');
        this.$location     = $('.js-location');

        this.leaderboardUserTemplate = _.template($('#leaderboard-user-template').html());

        if (typeof initData.user._location != 'undefined') {
            this.location = initData.user._location;
            this.$location.val(this.location);
        } else {
            this.location = 'all';
            this.$location.val('all');
        }

        this.sort = 'top';
        this.$sort.val('top');

        this.load();
    },

    genURL: function() {
        return '/api/leaderboard/' + this.location + '/' + this.sort;
    },

    load: function() {
        this.sort = this.$sort.val();
        this.location = this.$location.val();
        var that = this;
        $.ajax({
            url  : this.genURL(),
            type : 'GET',
            success: function(data) {
                that.users = data;
                that.render();
            },
            failure: function(data) {}
        });
    },

    render: function() {
        var that = this;
        this.$locationName.empty();
        this.$leaderboard.empty();
        this.$locationName.html($('.js-location option:selected').text());
        _.forEach(this.users, function(user) {
            that.$leaderboard.append(that.leaderboardUserTemplate(user));
        });
    }
});

$(function() {
    var leaderboard = new Leaderboard();
});