/* Location model */
var mongoose = require('mongoose');

var locationSchema = mongoose.Schema({
    name    : String,
    city    : String,
    country : String
});

module.exports = mongoose.model('Location', locationSchema);