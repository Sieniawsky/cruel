/* Score utility module */
var cron = require('cron');

module.exports = function() {
    var User = require('../models/user');

    /* Every Monday at 12:05:00 AM */
    var weekJob  = cron.job('00 5 * * * 1', function() {
        User.update({}, {'$set': {weekScore: 0}}, function(err, changed) {
            if (err) return console.error(err);
            console.log('Week scores reset to zero.');
        });
    });

    /* First day of every month at 12:05:00 AM */
    var monthJob = cron.job('00 5 1 * * *', function() {
        User.update({}, {'$set': {monthScore: 0}}, function(err, changed) {
            if (err) return console.error(err);
            console.log('Month scores reset to zero.');
        });
    });

    weekJob.start();
    monthJob.start();
};
