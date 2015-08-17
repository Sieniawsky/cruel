/* User model */
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var config   = require('../../server').get('config');

var userSchema = mongoose.Schema({
    username                  : String,
    email                     : String,
    password                  : String,
    date                      : Date,
    imageUrl                  : {type : String, default : config.image_url},
    description               : {type : String, default : ''},
    score                     : {type : Number, default : 0},
    weekScore                 : {type : Number, default : 0},
    monthScore                : {type : Number, default : 0},
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
