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

        this.$sort     = $('.js-sort');
        this.$location = $('.js-location');

        // Sorting options
        this.sort     = 'new';
        this.location = this.$location.val();
    },

    load: function() {
        this.sort = this.$sort.val();
        this.location = this.$location.val();
        this.page = 1;
        this.hasMore = true;
        this.posts.fetch({
            reset: true,
            sort: this.sort,
            location: this.location
        });
    },
});

/* Start it up */
$(function() {
    var feed = new MainFeed();
});
