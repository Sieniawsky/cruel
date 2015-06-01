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
    
});