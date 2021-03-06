var $ = require('jquery');
var _ = require('lodash');
var Backbone = require('backbone');
Backbone.$ = $;

var Post           = require('../models/Post');
var PostCollection = require('../collections/PostCollection');
var PostView       = require('../views/PostView');

/* Basic feed view module that can be extended and customized */
module.exports = Backbone.View.extend({

    initialize: function() {
        this.$feed = $('.js-feed');
        this.$sort = $('.js-sort');
        this.completed_template = _.template($('#completed-template').html());
        this.triggerPoint = 20;
        this.page = 1;
        this.isLoading = false;
        this.hasMore = true;

        // View events
        _.bindAll(this, 'checkScroll');
        $(window).scroll(this.checkScroll);

        // Collection events
        this.posts = new PostCollection();
        this.posts.bind('reset', this.addAll, this);
    },

    addOne: function(post) {
        console.log(post.attributes.hotScore + ', ' + post.attributes.title);
        var view = new PostView({model: post});
        this.$feed.append(view.render().el);
    },

    addAll: function() {
        this.$feed.empty();
        this.posts.each(this.addOne, this);
    },

    checkScroll: function() {
        var triggerReached = ($(window).scrollTop() + this.triggerPoint) > ($(document).height() - $(window).height());
        if (!this.isLoading && this.hasMore && triggerReached && this.posts.length % 12 === 0) {
            this.page += 1;
            this.loadPosts();
        }
    },

    loadPosts: function() {
        this.isLoading = true;
        this.page += 1;
        var that = this;
        $.ajax({
            url  : this.genURL(this.page),
            type : 'GET',
            success: function(data) {
                _.each(data, function(post) {
                    that.posts.add(new Post(post));
                });
                that.addAll();

                if (data.length < 12) {
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
