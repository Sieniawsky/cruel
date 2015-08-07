var _       = require('lodash');
var async   = require('async');
var request = require('request');
var url     = require('url');
var oembed  = require('./oembed');
var config  = require('../../server').get('config');

var urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;

var format = function(input, next) {
    var map = {};
    var urls = input.match(urlRegex);
    async.each(urls, function(item, callback) {
        parseURL(item, function(formatted) {
            map[item] = formatted;
            callback();
        });
    }, function(err) {
        if (err) return console.error(err);
        _.each(map, function(n, key) {
            input = input.replace(key, map[key]);
        });
        next(input);
    });
};

var parseURL = function(input, next) {
    var html;
    if (typeof input == 'undefined' || input == null || input == '')
        throw new Error('Invalid URL');
    var parsed = url.parse(input);
    if (_.contains(config.oEmbedProviders, parsed.host)) {
        oembed(input, next);
    } else {
        next('<a href="' + input + '" target="_blank">' + input + '</a>');
    }
};

module.exports = {
    format : format
};
