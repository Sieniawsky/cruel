var $ = require('jquery');
var _ = require('lodash');
var Backbone = require('backbone');
Backbone.$ = $;

var Post           = require('./models/Post.js');
var PostCollection = require('./collections/PostCollection.js');

/* Post View */
var PostView = Backbone.View.extend({

    tagName: 'div',

    template: _.template($('#post-template').html()),

    events: {
        'click .js-like': 'like'
    },

    initialize: function() {
        _.bindAll(this, 'render');
        this.model.bind('change', this.render);
    },

    like: function() {
        console.log('Like has been clicked');
        if (typeof initData.user._id !== "undefined" && initData.user._id !== null) {
            var that = this;
            $.ajax({
                url : '/api/like/' + this.model.get('_id'),
                type : 'POST',
                data : {
                    post : this.model.attributes,
                    user : initData.user
                },
                success : function(data) {
                    that.model.fetch();
                },
                failure : function(data) {}
            });
        } else {
            // Prompt user to login
        }
    },

    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});

var FeedView = Backbone.View.extend({

    el: '.js-app',

    events: {
        'click .js-new': function(){this.load('new')},
        'click .js-top': function(){this.load('top')},
        'click .js-hot': function(){this.load('hot')}
    },

    initialize: function() {
        this.$feed = $('.js-feed');
        this.triggerPoint = 100;
        this.page = 0;
        this.isLoading = false;
        this.hasMore = true;
        this.completed_template = _.template($('#completed-template').html());

        // Sorting options
        this.sort = 'new';

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

    load: function(sort) {
        this.sort = sort;
        this.posts.fetch({reset: true, sort: this.sort});
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
        var last = this.posts.at(this.posts.length - 1).get('_id');
        var that = this;
        $.ajax({
            url: '/api/feed/' + this.sort + '/' + last,
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

/* Start it up */
$(function() {
    var feed = new FeedView();
});
