var _ = require('lodash');
module.exports = function(obj) {
    if (_.isNull(obj) || _.isUndefined(obj) || _.isEmpty(obj)) {
        return false;
    } else {
        return true;
    }
};
