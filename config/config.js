var _ = require('lodash');

module.exports = function(isProd) {
    var common = {
        image_url : 'https://pbs.twimg.com/profile_images/512279743241019392/sU297Cak.jpeg',
        page_size : 12
    };
    var dev = {
        host   : 'localhost:3000',
        socket : 'mongodb://localhost:27017/cruel'
    };
    var prod = {
        host   : 'bobbybottleservice.com',
        socket : 'mongodb://swaglord69:myballs@ds047722.mongolab.com:47722/heroku_k2lqlzp8'
    };

    var bundle = {};

    if (isProd) {
        bundle = _.extend(common, prod);
    } else {
        bundle = _.extend(common, dev);
    }

    return bundle;
};