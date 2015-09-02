var $ = require('jquery');
var _ = require('lodash');
var Backbone = require('backbone');
Backbone.$ = $;

var Welcome = Backbone.View.extend({
    el : '.js-welcome-page',
    events : {
        'click .js-welcome-login' : 'showLoginModal'
    },
    initialize : function() {
        this.nav = nav || {};
    },
    showLoginModal : function() {
        this.nav.showLoginModal();
    },
    render : function() {}
});

/* Start it up */
$(function() {
    var welcome = new Welcome();
});
