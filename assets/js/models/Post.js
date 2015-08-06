var _ = require('lodash');
var Backbone = require('backbone');

/* Post Model */
module.exports = Backbone.Model.extend({

    initialize: function() {
        this.url = '/api/post/' + this.get('_id');
        this.set('rawDate', new Date(this.get('rawDate')));
    }
});