var request     = require('request');
var url         = require('url');
var parseString = require('xml2js').parseString;

module.exports = function(input, next) {
    if (typeof input == 'undefined' || input == null || input == '')
        throw new Error('Invalid URL');
    var oEmbedURL = 'http://' + url.parse(input).host + '/oembed?url=' + encodeURIComponent(input);
    request({url: oEmbedURL}, function(err, response, body) {
        if (err) return console.error(err);
        parseString(body, function(err, result) {
            if (err) return console.error(err);
            next(result.oembed.html[0]);
        });
    });
};
