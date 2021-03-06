var $ = require('jquery');
var _ = require('lodash');
var Backbone = require('backbone');
Backbone.$ = $;

var Post           = require('./models/Post');
var PostCollection = require('./collections/PostCollection');
var PostView       = require('./views/PostView');
var FeedView       = require('./views/FeedView');

/* Feed for a user's profile page */
var UserFeed = FeedView.extend({

    el: '.js-user',

    events: {
        'change .js-sort'       : 'load',
        'change .js-location'   : 'load',
        'click .js-delete-user' : 'deleteUser'
    },

    initialize: function() {
        /* Call super initialize */
        FeedView.prototype.initialize.apply(this);

        this.profileTemplate = _.template($('#user-profile-template').html());

        this.sort = 'top';
        this.$sort.val('top');
        this.$userProfile = $('.js-user-profile');
        this.user  = initData.selectedUser._id;
        this.url   = this.genURL(this.page);
        this.load();
    },

    load: function() {
        this.sort = this.$sort.val();
        this.page = 1;
        this.hasMore = true;
        this.posts.fetch({
            reset : true,
            url   : this.genURL(1),
            sort  : this.sort
        });
    },

    genURL: function(page) {
        return '/api/feed/user/' + this.user + '/' + this.sort + '/' + page;
    },

    deleteUser: function() {
        var id = initData.selectedUser._id;
        $.ajax({
            url : '/admin/user/' + id,
            type : 'DELETE',
            data : {
                user: initData.selectedUser
            },
            success : function(data) {
                if (data && data.outcome === true) {
                    window.location.href = '/user/' + initData.selectedUser.username;
                }
            },
            failure : function(data) {
                console.log(data);
            }
        });
    },

    render: function() {
        this.$userProfile.html(this.profileTemplate(initData.selectedUser));
    }
});

/* Start it up */
$(function() {
    var feed = new UserFeed();
    feed.render();
});
