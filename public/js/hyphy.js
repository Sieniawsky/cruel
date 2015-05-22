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

        template: _.template($('#post-template').html()),

        events: {
            'click .js-like': 'like'
        },

        initialize: function() {
            this.tagName = 'div';
            this._ensureElement();
        },

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

    /* Posts/Application View */
    var AppView = Backbone.View.extend({

        initialize: function() {

            this.el$ = $('.js-app');
            this._ensureElement();

            this.$feed = $('.js-feed');

            _.each(initData.data, function(post) {
                Posts.add(new Post(post));
            });

            this.addAll();
        },

        addOne: function(post) {
            console.log('addone is called');
            var view = new PostView({model: post});
            this.$feed.append(view.render().el);
        },

        addAll: function() {
            //this.$el.html('');
            Posts.each(this.addOne, this);
        },
    });

    var Posts = new PostList;
    var app = new AppView;
});