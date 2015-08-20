/* Post model */
var mongoose = require('mongoose');
var config   = require('../../server').get('config');

var postSchema = mongoose.Schema({
    title         : String,
    url           : {type : String, default : config.image_url},
    description   : {type : String, default : ''},
    formatted     : {type : String, default : ''},
    date          : Date,
    _user         : mongoose.Schema.Types.ObjectId,
    _username     : String,
    likers        : {type : [mongoose.Schema.Types.ObjectId], default : []},
    score         : {type : Number, default : 0},
    _location     : mongoose.Schema.Types.ObjectId,
    _locationName : String,
    comments      : [],
    type          : {type : String, default : 'image'},
    deleted       : {type : Boolean, default : false}
});

module.exports = mongoose.model('Post', postSchema);