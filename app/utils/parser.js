var _       = require('lodash');
var request = require('request');
var url     = require('url');
var oembed  = require('./oembed');
var config  = require('../../server').get('config');

module.exports = {
    format
};

var format = function(input) {
    return parseURL(input);
};

var parseURL = function(url) {
    var html;
    if (typeof url == 'undefined' || url == null || url == '')
        throw new Error('Invalid URL');
    var options = {
        url                : url,
        method             : 'HEAD',
        followAllRedirects : true
    };
    request(options, function(err, response, body) {
        if (err) return console.error(err);
        var longURL = response.request.href;
        var parsed  = url.parse(longURL);
        if (_.contains(config.oEmbedProviders, parsed.host)) {
            html = oembed(longURL);
        } else {
            html = '';
        }
        return html;
    });
};
