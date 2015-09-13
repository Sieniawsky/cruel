var _      = require('lodash');
var mailer = require('nodemailer');

var from = 'hello@cruel.co';
var pass = '4kjj==311';

var outgoing = function(target, subject, body, next) {
    var transport = mailer.createTransport({
        service : 'Gmail',
        auth    : {
            user : from,
            pass : pass
        }
    });

    var options = {
        from    : from,
        to      : target,
        subject : subject,
        text    : body
    };

    transport.sendMail(options, function(err, res) {
        if (err) return console.error(err);
        return next();
    });
};

var welcome = function(user, next) {
    var subject = 'Welcome to Cruel!';
    var body = 'Talk to me duggy';
    var data = {};
    var template = _.template(body);
    outgoing(user.email, subject, template(data), next);
};

var contact = function(email, body, next) {
    var subject = 'CONTACT EMAIL FROM: ' + email;
    var body = 'From: <%= email %>\nBody: <%= body %>';
    var data = {
        email: email,
        body: body
    };
    var template = _.template(body);
    outgoing('hello@cruel.co', subject, template(data), next);
};

module.exports = {
    welcome : welcome,
    contact : contact
};
