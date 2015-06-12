var $ = require('jquery');
var _ = require('lodash');
var Backbone = require('backbone');
Backbone.$ = $;

var Post           = require('./models/Post');
var PostCollection = require('./collections/PostCollection');
var PostView       = require('./views/PostView');
var FeedView       = require('./views/FeedView');

/* Feed for a user's profile page */
var UserFeed = FeedView.extend({

    el: '.js-user',

    events: {
        'change .js-sort'     : 'load',
        'change .js-location' : 'load'
    },

    initialize: function() {
        /* Call super initialize */
        FeedView.prototype.initialize.apply(this);
        this.sort = 'new';
        this.$sort.val('new');
        this.user  = initData.user._id;
        this.url   = this.setURL(this.page);
        this.load();
    },

    load: function() {
        this.sort = this.$sort.val();
        this.page = 1;
        this.hasMore = true;
        this.posts.fetch({
            reset : true,
            url   : this.setURL(1)
        });
    },

    setURL: function(page) {
        this.url = '/api/feed/' + this.user + '/' + this.sort + '/' + page;
        return this.url;
    }
});

/* Start it up */
$(function() {
    var feed = new UserFeed();
});
