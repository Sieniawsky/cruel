/* Experiment with Backbone */
$(function() {
    var Post = Backbone.Model.extend({
        default: {
            done: false
        },

        initialize: function() {}
    });

    var PostList = Backbone.Collection.extend({
        model: Post
    });

    var PostView = Backbone.View.extend({
        template: _.template($('#post-template').html()),

        render: function() {
            return this.template(this.model.attributes);
        }
    });

    var PostsView = Backbone.View.extend({
        el: $('.js-posts'),

        initialize: function() {
            _.each(initData.data, function(post) {
                Posts.add(new Post(post));
            });

            this.addAll();
        },

        addOne: function(post) {
            var view = new PostView({model: post});
            $(".js-posts").append(view.render());
        },

        addAll: function() {
            Posts.each(this.addOne);
        },
    });

    var Posts = new PostList;
    var app = new PostsView;
});