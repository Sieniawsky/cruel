/* User model */
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var defaults = require('../../config/default');

var userSchema = mongoose.Schema({
    username                  : String,
    email                     : String,
    password                  : String,
    date                      : Date,
    imageUrl                  : {type : String, default : defaults.default_url},
    description               : {type : String, default : ''},
    locationRank              : {type : Number, default : 0},
    globalRank                : {type : Number, default : 0},
    score                     : {type : Number, default : 0},
    _location                 : mongoose.Schema.Types.ObjectId,
    _locationName             : String,
    postScoreNotifications    : [],
    commentScoreNotifications : [],
    commentNotifications      : []
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
