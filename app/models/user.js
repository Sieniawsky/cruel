/* User model */
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    username             : String,
    email                : String,
    password             : String,
    date                 : Date,
    score                : {type : Number, default : 0},
    _location            : mongoose.Schema.Types.ObjectId,
    _locationName        : String,
    scoreNotifications   : [],
    commentNotifications : []
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
