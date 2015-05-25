var Backbone = require('backbone');

/* Post Model */
module.exports = Backbone.Model.extend({
    default: {
        done: false
    },

    initialize: function() {
        this.set('rawDate', new Date(this.get('rawDate')));
    }
});