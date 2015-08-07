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
        this.commentTimeoutTemplate = _.template($('#comment-timeout-template').html());
        this.commentEmptyTemplate = _.template($('#comment-empty-template').html());

        this.nav       = nav || {};
        this.$post     = $('.js-post-body');
        this.$comments = $('.js-comments');
        this.$comment  = $('.js-comment-text');
        this.$form     = $('#js-form');
        this.$sort     = $('.js-sort');
        this.$messages = $('.js-messages');

        this.sortOption = 'top';
        this.$sort.val('top');

        if (this.model.get('type') === 'text') {
            $('.js-image').addClass('post-image-hidden');
            $('post-content').addClass('post-content-full-width');
        }

        _.bindAll(this, 'render');
        this.model.bind('change', this.render);
        this.render();
    },

    initDates: function() {
        var comments = _.map(this.model.get('comments'), function(comment) {
            comment.rawDate = new Date(comment.rawDate);
            return comment;
        });
        this.model.set('comments', comments);
    },

    /* ========== */
    /* Sort Logic */
    /* ========== */

    sort: function() {
        this.sortOption = this.$sort.val();
        this.render();
    },

    newSort: function() {
        var sorted = _.sortBy(this.model.get('comments'), function(comment) {
            return -comment.rawDate.getTime();
        });
        this.model.set({comments: sorted}, {silent: true});
    },

    topSort: function() {
        var sorted = _.sortBy(this.model.get('comments'), function(comment) {
            return -comment.score;
        });
        this.model.set({comments: sorted}, {silent: true});
    },

    handleLike: function() {
        if (!this.model.get('liked')) {
            this.like();
        } else {
            this.unlike();
        }
    },

    /* ================= */
    /* Like Unlike Logic */
    /* ================= */

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

    handleComment: function(e) {

        if (this.$comment.val().length != 0) {
            /* Check if no comments were made by the user within 5 min */
            var checkTime = 1000 * 60 * 5;
            var recentComments = _.filter(this.model.get('comments'), function(comment) {
                var timeDiff = new Date().getTime() - comment.rawDate.getTime();
                var olderThanCheckTime = (new Date().getTime() - comment.rawDate.getTime() < checkTime) ? false : true;
                return (comment._user == initData.user._id && !olderThanCheckTime);
            });

            /* Only POST comment if no comments were made by the user with 5 min */
            if (recentComments.length == 0) {
                var that = this;
                $.ajax({
                    url  : '/api/post/comment',
                    type : 'POST',
                    data : {
                        comment : this.$comment.val(),
                        post    : this.model.attributes
                    },
                    success : function(data) {
                        that.model.fetch();
                    },
                    failure : function(data) {
                        console.log(data);
                    }
                });
                e.preventDefault();
                this.$messages.empty();
                this.$form.trigger('reset');
            } else {
                /* Display an error message to the user */
                e.preventDefault();
                this.$messages.empty();
                this.$messages.append(this.commentTimeoutTemplate());
            }
        } else {
            e.preventDefault();
            this.$messages.empty();
            this.$messages.append(this.commentEmptyTemplate());
        }
    },

    like: function() {
        if (typeof initData.user !== 'undefined'
            && typeof initData.user._id !== 'undefined'
            && initData.user._id !== null) {

            var that = this;
            $.ajax({
                url  : '/api/post/like/' + this.model.get('_id'),
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
                url : '/api/post/unlike/' + this.model.get('_id'),
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
                url  : '/api/post/comment/like/' + comment._id,
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
                url : '/api/post/comment/unlike/' + comment._id,
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
        this.initDates();
        this[this.sortOption + 'Sort']();
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