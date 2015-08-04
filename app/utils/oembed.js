var request     = require('request');
var url         = require('url');
var parseString = require('xml2js').parseString;

module.exports = function(url) {
    if (typeof url == 'undefined' || url == null || url == '')
        throw new Error('Invalid URL');
    var oembedURL = 'http://' + url.parse(url).host + '/oembed?url=' + encodeURIComponent(url);
    request({url: oembedURL}, function(err, response, body) {
        if (err) return console.error(err);
        parseString(body, function(err, result) {
            if (err) return console.error(err);
            return result.oembed.html[0];
        });
    });
};
