var _       = require('lodash');
var url     = require('url');
var request = require('request');
var config  = require('../../server').get('config');

module.exports = function(input, next) {
    if (typeof input === 'undefined' || input === null || input === '')
        throw new Error('Invalid URL');
    var parsed   = url.parse(input);
    var parts    = parsed.host.split('.');
    var provider = parts.length == 3 ? parts[1] : parts[0];
    var oEmbedURL = config.oEmbedFormats[provider] + encodeURIComponent(input);
    request({url: oEmbedURL}, function(err, response, body) {
        if (err) return console.error(err);
        next('<div class="video-wrapper">' + JSON.parse(body).html + '</div>');
    });
};
