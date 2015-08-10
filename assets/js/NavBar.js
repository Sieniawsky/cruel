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
        'blur .menu-button-mobile'        : 'closeDrawerMobile',
        'blur .mobile-score'              : 'closeScoreMobile',
        'blur .menu-button'               : 'closeMenu',
        'blur .notification-score-count'  : 'closeScore',

        'click .js-close'         : 'hideModal',
        'click .js-link-messages' : 'handleLink',
        'click .js-link-post'     : 'handleLink',
        'click .js-link-user'     : 'handleLink',

        'click .js-login'        : 'showLoginModal',
        'click .js-login-close'  : 'hideLoginModal'
    },

    initialize: function() {
        this.isRead = false;

        this.$notificationBox       = $('.notification-box');
        this.$notificationBoxMobile = $('.notification-box-mobile');
        this.$navDropdown           = $('.dropdown');
        this.$dropdownMobile        = $('.dropdown-mobile');
        this.$modal = $('.overlay');
        this.$loginModal = $('.overlay-login');
        this.$body = $('body');
    },

    showLoginModal: function() {
        this.$body.addClass('modal-scroll-lock');
        this.$loginModal.show();
    },

    hideLoginModal: function() {
        this.$body.removeClass('modal-scroll-lock');
        this.$loginModal.hide();
    },

    showModal: function() {
        this.$body.addClass('modal-scroll-lock');
        this.$modal.show();
    },

    hideModal: function() {
        this.$body.removeClass('modal-scroll-lock');
        this.$modal.hide();
    },

    handleLink: function(e) {
        e.preventDefault();
        if (this.isLoggedIn()) {
            window.location = e.currentTarget.href;
        }
    },

    isLoggedIn: function() {
        if (typeof initData !== 'undefined' &&
            typeof initData.user !== 'undefined' &&
            typeof initData.user._id !== 'undefined') {
            return true;
        } else {
            this.showModal();
            return false;
        }
    },

    markAsRead: function() {
        if (!this.isRead && initData.user.notifications.notifications !== 0) {
            $('.js-new-score').fadeOut('fast');
            var that = this;
            $.ajax({
                url : '/api/user/notifications/clear',
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
        if (this.isLoggedIn()) {
            this.$notificationBoxMobile.slideToggle('fast');
            this.markAsRead();
        }
    },

    toggleMenu: function() {
        this.$navDropdown.slideToggle('fast');
    },

    toggleScore: function() {
        if (this.isLoggedIn()) {
            this.$notificationBox.slideToggle('fast');
            this.markAsRead();
        }
    },

    closeDrawerMobile: function() {
        this.$dropdownMobile.slideUp('fast');
    },

    closeScoreMobile: function() {
        this.$notificationBoxMobile.slideUp('fast');
    },

    closeMenu: function() {
        this.$navDropdown.slideUp('fast');
    },

    closeScore: function() {
        this.$notificationBox.slideUp('fast');
    }
});

$(function() {
    nav = new NavBar();
});