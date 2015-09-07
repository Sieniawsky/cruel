var $ = require('jquery');
var _ = require('lodash');
var Backbone = require('backbone');
Backbone.$ = $;

var Welcome = Backbone.View.extend({

    el : '.js-welcome-page',

    events : {
        'click .js-welcome-login' : 'showLoginModal',
        'click .js-share'         : 'share'
    },

    initialize: function() {
        this.nav = nav || {};
    },

    showLoginModal: function() {
        this.nav.showLoginModal();
    },

    share: function() {
        FB.ui({
            method : 'share',
            href   : 'https://cruel.co' + this.model.get('postURL')
        }, function(response) {});
    },

    render: function() {}
});

/* Start it up */
$(function() {
    var welcome = new Welcome();
});
