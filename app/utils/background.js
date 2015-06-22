var _    = require('lodash');
var fs   = require('fs');
var path = require('path');

/* Returns the file name of a random
   backgrounds image for use during rendering */
module.exports = function() {
    var files = fs.readdirSync(path.join(__dirname, '../../public/images/backgrounds'));
    /* Filter our dot files */
    var filtered = _.filter(files, function(file) {
        return file.charAt(0) !== '.';
    });
    return filtered[Math.floor(Math.random() * (filtered.length + 1))];
};
