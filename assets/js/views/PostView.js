var $ = require('jquery');
var _ = require('lodash');
var Backbone = require('backbone');
Backbone.$ = $;

/* View for a Post */
module.exports = Backbone.View.extend({

    tagName: 'div',

    template: _.template($('#post-template').html()),

    events: {
        'click .js-like': 'handleLike'
    },

    initialize: function() {
        this.nav = nav || {};

        _.bindAll(this, 'render');
        this.model.bind('change', this.render);
    },

    handleLike: function() {
        if (this.model.get('_user') !== initData.user._id) {
            if (!this.model.get('liked')) {
                this.like();
            } else {
                this.unlike();
            }
        }
    },

    like: function() {
        if (typeof initData.user._id !== "undefined" &&
            initData.user._id !== null &&
            !this.model.get('liked')) {

            var that = this;
            $.ajax({
                url : '/api/post/like/' + this.model.get('_id'),
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
        if (typeof initData.user._id !== "undefined" &&
            initData.user._id !== null &&
            this.model.get('liked')) {

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

    simpleRender: function() {
        return this.template(this.model.toJSON());
    },

    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});