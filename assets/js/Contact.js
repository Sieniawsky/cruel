var $ = require('jquery');
var _ = require('lodash');
var Backbone = require('backbone');
Backbone.$ = $;

var Contact = Backbone.View.extend({

    el: '.js-contact',

    events: {
        'click .js-contact-submit': 'handleContactSubmission'
    },

    initialize: function() {
        this.emptyTemplate   = _.template($('#contact-empty-template').html());
        this.successTemplate = _.template($('#contact-success-template').html());
        this.failureTemplate = _.template($('#contact-failure-template').html());
        this.$success        = $('.js-success');
        this.$errors         = $('.js-errors');
        this.$contactForm    = $('.js-contact-form');
        this.$contactEmail   = $('.js-contact-email');
        this.$contactBody    = $('.js-contact-body');
        this.render();
    },

    handleContactSubmission: function(e) {
        var that = this;
        var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        var email = this.$contactEmail.val();
        var body = this.$contactBody.val();
        this.errors.empty();
        if (email && email.length !== 0 && re.test(email) && body && body.length !== 0) {
            // Post to server
            $.ajax({
                url: '/contact',
                type: 'POST',
                data: {
                    email : email,
                    body  : body
                },
                success: function() {
                    $('contact-forms').hide();
                    // Show success template
                    that.$success.append(that.successTemplate());
                },
                failure: function() {
                    // Reset form
                    // Show failure template
                    that.$contactForm.trigger('reset');
                    that.$errors.append(that.failureTemplate());
                }
            });
            e.preventDefault();
        } else {
            // Show error
            this.errors.append(this.emptyTemplate());
            e.preventDefault();
        }
    },

    render: function() {}
});

$(function() {
    var contact = new Contact();
});
