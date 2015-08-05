var _ = require('lodash');

module.exports = function(isProd) {
    var bundle = {};
    var common = {
        image_url       : 'https://pbs.twimg.com/profile_images/512279743241019392/sU297Cak.jpeg',
        page_size       : 12,
        oEmbedProviders : [
            'youtube.com',
            'www.youtube.com',
            'vimeo.com',
            'www.vimeo.com',
            'soundcloud.com',
            'www.soundcloud.com'
        ],
        oEmbedFormats   : {
            youtube     : 'https://youtube.com/oembed?format=json&url=',
            vimeo       : 'https://vimeo.com/api/oembed.json?url=',
            soundcloud  : 'https://soundcloud.com/oembed?format=json&maxheight=100&url='
        }
    };
    var dev = {
        hosts  : [
            'localhost:3000'
        ],
        socket : 'mongodb://localhost:27017/cruel'
    };
    var prod = {
        hosts  : [
            'hatchet.io',
            'www.hatchet.io'
        ],
        socket : 'mongodb://swaglord69:myballs@ds047722.mongolab.com:47722/heroku_k2lqlzp8'
    };

    if (isProd) {
        bundle = _.extend(common, prod);
    } else {
        bundle = _.extend(common, dev);
    }

    return bundle;
};
