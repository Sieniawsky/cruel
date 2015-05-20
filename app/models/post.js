/* Post model */
var mongoose = require('mongoose');
var defaults = require('../../config/default');

var postSchema = mongoose.Schema({
    title       : String,
    url         : { type : String, default : defaults.default_url },
    description : { type : String, default : '' },
    date        : String,
    _user       : mongoose.Schema.Types.ObjectId,
    _username   : String
});

module.exports = mongoose.model('Post', postSchema);