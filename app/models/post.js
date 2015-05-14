/* Post model */
var mongoose = require('mongoose');
var defaults = require('../../config/default');

var postSchema = mongoose.Schema({
    title       : String,
    url         : { type : String, default : defaults.default_url },
    description : String,
    date        : String,
    _user       : mongoose.Schema.Types.ObjectId
});

module.exports = mongoose.model('Post', postSchema);