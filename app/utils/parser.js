var _       = require('lodash');
var request = require('request');
var url     = require('url');
var oembed  = require('./oembed');
var config  = require('../../server').get('config');

var format = function(input, next) {
    parseURL(input, next);
};

var parseURL = function(input, next) {
    var html;
    if (typeof input == 'undefined' || input == null || input == '')
        throw new Error('Invalid URL');
    var options = {
        url                : input,
        method             : 'HEAD',
        followAllRedirects : true
    };
    request(options, function(err, response, body) {
        if (err) return console.error(err);
        var longURL = response.request.href;
        var parsed  = url.parse(longURL);
        if (_.contains(config.oEmbedProviders, parsed.host)) {
            oembed(longURL, next);
        } else {
            next('');
        }
    });
};

module.exports = {
    format : format
};
