/* Routes for posts */
var _      = require('lodash');
var User   = require('../../models/user');
var remap  = require('../../utils/remap');

module.exports = function(app, passport) {
    app.put('/api/user/mark/:id', function(req, res) {
        if (req.params.id.equals(req.user._id)) {
            
        }
    });
};