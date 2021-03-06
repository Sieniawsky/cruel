var _ = require('lodash');

module.exports = function(isProd) {
    var bundle = {};
    var common = {
        image_url       : 'https://s3.amazonaws.com/cruelco/placeholder.png',
        s3_base         : 'https://s3.amazonaws.com/cruelco/',
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
            soundcloud  : 'https://soundcloud.com/oembed?format=json&maxheight=81&url='
        }
    };
    var dev = {
        hosts  : [
            'localhost:3000'
        ],
        image_proxy: 'http://localhost:3000/proxy?url=',
        socket : 'mongodb://localhost:27017/cruel'
    };
    var prod = {
        hosts  : [
            'cruel.co',
            'www.cruel.co'
        ],
        image_proxy: 'https://cruel.co/proxy?url=',
        socket : 'mongodb://xxx'
    };

    if (isProd) {
        bundle = _.extend(common, prod);
    } else {
        bundle = _.extend(common, dev);
    }

    return bundle;
};
