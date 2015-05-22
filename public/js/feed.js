/* Experiment with Backbone */
$(function() {

    /* Post Model */
    var Post = Backbone.Model.extend({
        default: {
            done: false
        },

        initialize: function() {}
    });

    /* Post Collection */
    var PostList = Backbone.Collection.extend({
        model: Post
    });

    /* Post View */
    var PostView = Backbone.View.extend({

        tagName: 'div',

        template: _.template($('#post-template').html()),

        events: {
            'click .js-like': 'like'
        },

        initialize: function() {},

        like: function() {
            console.log('Like has been clicked');
            if (typeof initData.user._id !== "undefined" && initData.user._id !== null) {
                $.ajax({
                    url : '/post/like',
                    type : 'POST',
                    data : {
                        post : this.model.attributes,
                        user : initData.user
                    },
                    success : function(data) {},
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

    /* Application View */
    var FeedView = Backbone.View.extend({

        el: '.js-app',

        initialize: function() {
            this.$feed = $('.js-feed');
            this.triggerPoint = 100;
            this.page = 0;
            this.isLoading = false;
            this.hasMore = true;

            this.completed_template = _.template($('#completed-template').html());

            _.bindAll(this, 'checkScroll');
            $(window).scroll(this.checkScroll);

            this.posts = new PostList();
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
            var last = this.posts.at(this.posts.length - 1).get('_id');
            var that = this;
            $.ajax({
                url: '/' + this.page + '/' + last,
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

    var feed = new FeedView();
});