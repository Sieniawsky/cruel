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

var forgot = function(email, host, token, next) {
    var subject = 'Cruel.co Password Reset',
    var body = 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://<%= host %>/reset/<%= token %>\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
    var data = {
        host: host,
        token: token
    };
    var template = _.template(body);
    outgoing(email, subject, template(data), next);
};

var reset = function(email, next) {
    var subject = 'Cruel.co Successful Password Reset';
    var body = 'Hello,\n\n' +
          'This is a confirmation that the password for your account <%= email %> has just been changed.\n'
    var data = {
        email: email
    };
    var template = _.template(body);
    outgoing(email, subject, template(data), next);
};

module.exports = {
    welcome : welcome,
    contact : contact,
    forgot  : forgot
};
