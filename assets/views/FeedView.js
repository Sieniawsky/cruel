var $ = require('jquery');
var _ = require('lodash');
var Backbone = require('backbone');
Backbone.$ = $;

/* Basic feed view module that can be extended and customized */
module.exports = Backbone.View.extend({

    initialize: function() {
        this.$feed     = $('.js-feed');
        this.triggerPoint = 100;
        this.page = 1;
        this.isLoading = false;
        this.hasMore = true;
        this.completed_template = _.template($('#completed-template').html());

        // View events
        _.bindAll(this, 'checkScroll');
        $(window).scroll(this.checkScroll);

        // Collection events
        this.posts = new PostCollection();
        this.posts.bind('reset', this.addAll, this);

        var that = this;
        _.each(initData.data, function(post) {
            that.posts.add(new Post(post));
        });

        this.addAll();
    },

    addOne: function(post) {
        var view = new PostView({model: post});
        this.$feed.append(view.render().el);
    },

    addAll: function() {
        this.$feed.empty();
        this.posts.each(this.addOne, this);
    },

    checkScroll: function() {
        if (!this.isLoading && this.hasMore &&
            ($(window).scrollTop() + this.triggerPoint
                > $(document).height() - $(window).height())) {
            this.page += 1;
            this.loadPosts();
        }
    },

    loadPosts: function() {
        this.isLoading = true;
        var that = this;
        $.ajax({
            url: '/api/feed/'
                + this.sort
                + '/'
                + this.location
                + '/' + this.page ,
            type: 'GET',
            success: function(data) {
                if (data.length < 8) that.hasMore = false;
                _.each(data, function(post) {
                    that.posts.add(new Post(post));
                })

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
    }
});