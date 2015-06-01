var $ = require('jquery');
var _ = require('lodash');
var Backbone = require('backbone');
Backbone.$ = $;

/* View for a Post */
module.exports = Backbone.View.extend({

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