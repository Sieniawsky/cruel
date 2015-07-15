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
        this.$locationName = $('.js-location-name');

        // Set the location to the user's location setting
        if (typeof initData.user._location != "undefined") {
            this.location = initData.user._location;
            this.$location.val(initData.user._location);
        } else {
            this.$location.val('all');
            this.location = 'all'
        }

        // Set update url
        this.url = this.genURL(this.page);
        this.load();
    },

    load: function() {
        var that = this;
        this.sort = this.$sort.val();
        this.location = this.$location.val();
        this.page = 1;
        this.hasMore = true;
        this.posts.fetch({
            reset : true,
            url   : this.genURL(1),
            sort  : this.sort
        });
        this.render();
    },

    loadPosts: function() {
        this.isLoading = true;
        this.page += 1;
        History.replaceState(
            {state:1},
            'Cruel',
            $('.js-location option:selected').text() + '/' + this.sort + '/' + this.page
        );
        var that = this;
        $.ajax({
            url  : this.genURL(this.page),
            type : 'GET',
            success: function(data) {
                _.each(data, function(post) {
                    that.posts.add(new Post(post));
                })
                that.addAll();

                if (data.length < 8) {
                    that.hasMore = false;
                    that.$feed.append(that.completed_template());
                }

                that.isLoading = false;
            },
            failure: function(data) {
                that.isLoading = false;
            }
        });
    },

    genURL: function(page) {
        return '/api/feed/' + this.location + '/' + this.sort + '/' + page;
    },

    render: function() {
        this.$locationName.html($('.js-location option:selected').text());
    }
});

/* Start it up */
$(function() {
    var feed = new MainFeed();
});
