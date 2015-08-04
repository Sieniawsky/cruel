var _    = require('lodash');
var fs   = require('fs');
var path = require('path');

/* Returns the file name of a random
   backgrounds image for use during rendering */
module.exports = function() {
    var backgrounds = require('../../assets/background.json').images;
    return backgrounds[Math.floor(Math.random() * backgrounds.length)];
};
