/* Misc model */
var mongoose = require('mongoose');

var miscSchema = mongoose.Schema({
    weekEndDate  : Date,
    monthEndDate : Date
});

module.exports = mongoose.model('Misc', miscSchema);
