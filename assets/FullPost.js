var _ = require('lodash');
var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;

var Post = require('./models/Post');

var FullPost = Backbone.View.extend({

    el: '.js-post',

    template: _.template($('#post-detail-template').html()),

    events: {
        'click .js-like': 'handleLike'
    },

    initialize: function() {
        _.bindAll(this, 'render');
        this.model.bind('change', this.render);
        this.render();
    },

    handleLike: function() {
        console.log('called');
        if (!this.model.get('liked')) {
            this.like();
        } else {
            this.unlike();
        }
    },

    like: function() {
        if (typeof initData.user !== 'undefined'
            && typeof initData.user._id !== 'undefined'
            && initData.user._id !== null) {

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
        }
    },

    unlike: function() {
        if (typeof initData.user !== 'undefined'
            && typeof initData.user._id !== 'undefined'
            && initData.user._id !== null) {

            var that = this;
            $.ajax({
                url : '/api/unlike/' + this.model.get('_id'),
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
        }
    },

    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
    }

});

$(function() {
    var post = new Post(initData.post);
    var postView = new FullPost({model: post});
});