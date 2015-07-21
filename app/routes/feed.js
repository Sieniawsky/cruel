/* Routes for the index feed of the application */
var _        = require('lodash');
var Post     = require('../models/post');
var User     = require('../models/user');
var remap    = require('../utils/remap');
var app      = require('../../server');
var bg       = require('../utils/background');

module.exports = function(app, passport) {
    /* Index feed page */
    app.get('/', function(req, res) {
        res.render('feed', {
            initData : JSON.stringify({
                user : remap.userRemap(req.user)
            }),
            user       : remap.userRemap(req.user),
            locations  : app.get('locations'),
            background : bg(),
            partials   : {
                feedPostTemplate : 'partials/feed-post-template',
                feedScripts      : 'partials/feed-scripts'
            }
        });
    });

    /* Pretty feed URLs */
    app.get('/:locationName/:sort(hot|new|top|week|month)/:page(\\d+)', function(req, res) {
        res.render('feed', {
            initData      : JSON.stringify({
                user      : remap.userRemap(req.user),
                locations : app.get('locations'),
                options   : {
                    locationName : req.params.locationName,
                    sort         : req.params.sort,
                    page         : parseInt(req.params.page)
                }
            }),
            user       : remap.userRemap(req.user),
            locations  : app.get('locations'),
            background : bg(),
            partials   : {
                feedPostTemplate : 'partials/feed-post-template',
                feedScripts      : 'partials/feed-scripts'
            }
        });
    });
};