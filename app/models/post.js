/* Post model */
var mongoose = require('mongoose');

var postSchema = mongoose.Schema({
    title       : String,
    url         : String,
    description : String,
    date        : String,
    _user       : mongoose.Schema.Types.ObjectId 
});

module.exports = mongoose.model('Post', postSchema);