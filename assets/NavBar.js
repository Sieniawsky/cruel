var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;

var NavBar = Backbone.View.extend({

    el: '.js-nav',

    events: {
        'click #mobile-drawer' : 'toggleDrawerMobile',
        'click .mobile-score'  : 'toggleScoreMobile',
        'click .nav-menu'      : 'toggleMenu',
        'click .nav-score'     : 'toggleScore',
        'blur #mobile-drawer'  : 'closeDrawerMobile',
        'blur .mobile-score'   : 'closeScoreMobile',
        'blur .nav-menu'       : 'closeMenu',
        'blur .nav-score'      : 'closeScore'
    },

    initialize: function() {
        this.$notificationBox       = $('.notification-box');
        this.$notificationBoxMobile = $('.notification-box-mobile');
        this.$navDropdown           = $('.nav-dropdown');
        this.$dropdownMobile        = $('.dropdown-mobile');
    },

    /* Handlers */
    toggleDrawerMobile : function() {
        console.log('mobile drawer');
        this.$dropdownMobile.slideToggle('fast');
    },
    toggleScoreMobile  : function() {
        console.log('mobile score');
        this.$notificationBoxMobile.slideToggle('fast');
    },
    toggleMenu         : function() {this.$navDropdown.slideToggle('fast');},
    toggleScore        : function() {this.$notificationBox.slideToggle('fast');},

    closeDrawerMobile  : function() {this.$dropdownMobile.slideDown('fast');},
    closeScoreMobile   : function() {this.$notificationBoxMobile.slideDown('fast');},
    closeMenu          : function() {this.$navDropdown.slideUp('fast');},
    closeScore         : function() {this.$notificationBox.slideUp('fast');}
});

$(function() {
    var nav = new NavBar();
});