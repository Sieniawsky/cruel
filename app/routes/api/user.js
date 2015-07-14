/* Routes for posts */
var _      = require('lodash');
var User   = require('../../models/user');
var remap  = require('../../utils/remap');

module.exports = function(app, passport) {
    app.put('/api/user/notifications/clear', function(req, res) {
        if (typeof req.user._id != 'undefined' && req.user._id != null) {
            User.update({_id: req.user._id},
                {'$set': {
                    postScoreNotifications    : [],
                    commentScoreNotifications : [],
                    commentNotifications      : []
                }}, function(err, update) {
                if (err) return console.error(err);
                res.send({outcome: true});
            });
        } else {
            res.send({outcome: false});
        }
    });
};