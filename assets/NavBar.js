var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;

var NavBar = Backbone.View.extend({

    el: '.js-nav',

    events: {
        'click .menu-button-mobile'       : 'toggleDrawerMobile',
        'click .mobile-score'             : 'toggleScoreMobile',
        'click .menu-button'              : 'toggleMenu',
        'click .notification-score-count' : 'toggleScore',
        'blur .menu-button-mobile'        : 'toggleDrawerMobile',
        'blur .mobile-score'              : 'toggleScoreMobile',
        'blur .menu-button'               : 'toggleMenu',
        'blur .notification-score-count'  : 'toggleScore'
    },

    initialize: function() {
        this.isRead = false;

        this.$notificationBox       = $('.notification-box');
        this.$notificationBoxMobile = $('.notification-box-mobile');
        this.$navDropdown           = $('.dropdown');
        this.$dropdownMobile        = $('.dropdown-mobile');
    },

    markAsRead: function() {
        if (!this.isRead && initData.user.notifications.posts.length != 0) {
            var that = this;
            $.ajax({
                url : '/api/user/mark',
                type : 'PUT',
                success : function(data) {
                    that.isRead = true;
                    console.log('Success');
                },
                failure : function(data) {}
            });
        }
    },

    /* Handlers */
    toggleDrawerMobile: function() {
        this.$dropdownMobile.slideToggle('fast');
    },
    toggleScoreMobile: function() {
        this.$notificationBoxMobile.slideToggle('fast');
        this.markAsRead();
    },
    toggleMenu: function() {
        this.$navDropdown.slideToggle('fast');
    },
    toggleScore: function() {
        this.$notificationBox.slideToggle('fast');
        this.markAsRead();
    },
});

$(function() {
    var nav = new NavBar();
});