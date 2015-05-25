var Post = require('../models/Post.js');
var Backbone = require('backbone');

/* Post Collection */
module.exports = Backbone.Collection.extend({
    model: Post,

    initialize: function() {
        this.comparator = function(post) {
            return -post.get('rawDate').getTime();
        };
    }
});