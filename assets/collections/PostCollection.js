var Post = require('../models/Post.js');
var Backbone = require('backbone');

/* Post Collection */
module.exports = Backbone.Collection.extend({
    model: Post,

    initialize: function() {
        this.comparator = this.newSort;
    },

    sync: function(method, collection, options) {
        options = options || {};
        this.comparator = this[options.sort + 'Sort'];
        options.url = '/api/feed/' + options.sort;
        Backbone.sync(method, collection, options);
    },

    newSort: function(post) {
        return -post.get('rawDate').getTime();
    },

    topSort: function(post) {
        return -post.get('score');
    },

    hotSort: function(post) {
        return -post.get('hotScore');
    }
});