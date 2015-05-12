/* User model */
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    username : String,
    email    : String,
    password : String
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
    bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);