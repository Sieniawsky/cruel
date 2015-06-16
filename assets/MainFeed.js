var $ = require('jquery');
var _ = require('lodash');
var Backbone = require('backbone');
Backbone.$ = $;

var Post           = require('./models/Post');
var PostCollection = require('./collections/PostCollection');
var PostView       = require('./views/PostView');
var FeedView       = require('./views/FeedView');

/* Main view for the index/feed page */
var MainFeed = FeedView.extend({

    el: '.js-app',

    events: {
        'change .js-sort'    : 'load',
        'change .js-location': 'load'
    },

    initialize: function() {
        /* Call super initialize */
        FeedView.prototype.initialize.apply(this);
        this.sort = 'hot';
        this.$sort.val('hot');
        this.$location = $('.js-location');

        // Set the location to the user's location setting
        if (typeof initData.user._location != "undefined") {
            this.location = initData.user._location;
            this.$location.val(initData.user._location);
        } else {
            this.location = this.$location.val();
        }

        // Set update url
        this.url = this.setURL(this.page);
        this.load();
    },

    load: function() {
        this.sort = this.$sort.val();
        this.location = this.$location.val();
        this.page = 1;
        this.hasMore = true;
        this.posts.fetch({
            reset : true,
            url   : this.setURL(1),
            sort  : this.sort
        });
    },

    setURL: function(page) {
        this.url = '/api/feed/' + this.sort + '/' + this.location + '/' + page;
        return this.url;
    }
});

/* Start it up */
$(function() {
    var feed = new MainFeed();
});
