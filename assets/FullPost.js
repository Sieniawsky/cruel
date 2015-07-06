var _ = require('lodash');
var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;

var Post = require('./models/Post');

var FullPost = Backbone.View.extend({

    el: '.js-post',

    template: _.template($('#post-detail-template').html()),

    events: {
        'click .js-like'         : 'handleLike',
        'submit #js-form'        : 'handleComment',
        'change .js-sort'        : 'sort',
        'click .js-comment-like' : 'handleCommentLike'
    },

    initialize: function() {

        this.postTemplate    = _.template($('#post-detail-template').html());
        this.commentTemplate = _.template($('#post-comment-template').html());

        this.nav       = nav || {};
        this.$post     = $('.js-post-body');
        this.$comments = $('.js-comments');
        this.$comment  = $('.js-comment-text');
        this.$form     = $('#js-form');
        this.$sort     = $('.js-sort');

        this.sortNew();
        _.bindAll(this, 'render');
        this.model.bind('change', this.render);

        this.render();
    },

    handleCommentLike: function(e) {
        var comment = _.find(this.model.get('comments'), function(comment) {
            return comment._id == e.currentTarget.name;
        });
        if (comment.liked) {
            this.commentUnlike(comment);
        } else {
            this.commentLike(comment);
        }
    },

    sort: function() {
        var sort = this.$sort.val();
        this['sort' + sort];
        this.render();
    },

    sortNew: function() {
        this.model.set('comments', _.sortBy(this.model.get('comments'), function(comment) {
            return -comment.date;
        }));
    },

    sortTop: function() {
        this.model.set('comments', _.sortBy(this.model.get('comments'), 'score'));
    },

    handleLike: function() {
        if (!this.model.get('liked')) {
            this.like();
        } else {
            this.unlike();
        }
    },

    handleComment: function(e) {
        var that = this;
        $.ajax({
            url  : '/api/comment/' + this.model.get('_id'),
            type : 'POST',
            data : {
                comment : this.$comment.val()
            },
            success : function(data) {
                console.log(data);
                that.model.fetch();
            },
            failure : function(data) {
                console.log(data);
            }
        });
        e.preventDefault();
        this.$form.trigger('reset');
    },

    like: function() {
        if (typeof initData.user !== 'undefined'
            && typeof initData.user._id !== 'undefined'
            && initData.user._id !== null) {

            var that = this;
            $.ajax({
                url  : '/api/like/' + this.model.get('_id'),
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
            this.nav.showModal();
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
        } else {
            this.nav.showModal();
        }
    },

    commentLike: function(comment) {
        if (typeof initData.user !== 'undefined'
            && typeof initData.user._id !== 'undefined'
            && initData.user._id !== null) {

            var that = this;
            $.ajax({
                url  : '/api/comment/like/' + comment._id,
                type : 'POST',
                data : {
                    comment : comment,
                    post    : this.model.attributes,
                    user    : initData.user
                },
                success : function(data) {
                    that.model.fetch();
                },
                failure : function(data) {}
            });
        } else {
            this.nav.showModal();
        }
    },

    commentUnlike: function(comment) {
        if (typeof initData.user !== 'undefined'
            && typeof initData.user._id !== 'undefined'
            && initData.user._id !== null) {

            var that = this;
            $.ajax({
                url : '/api/comment/unlike/' + comment._id,
                type : 'POST',
                data : {
                    comment : comment,
                    post    : this.model.attributes,
                    user    : initData.user
                },
                success : function(data) {
                    that.model.fetch();
                },
                failure : function(data) {}
            });
        } else {
            this.nav.showModal();
        }
    },

    render: function() {
        var that = this;
        this.$post.empty();
        this.$post.html(this.postTemplate(this.model.toJSON()));
        this.$comments.empty();
        _.forEach(this.model.get('comments'), function(comment) {
            that.$comments.append(that.commentTemplate(comment));
        });
    }

});

$(function() {
    var post = new Post(initData.post);
    var postView = new FullPost({model: post});
});