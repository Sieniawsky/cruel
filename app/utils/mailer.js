var _      = require('lodash');
var mailer = require('nodemailer');

var username = 'hello@cruel.co';
var pass = '4kjj==311';

var outgoing = function(target, subject, body, next) {
    var transport = mailer.createTransport({
        service : 'Gmail',
        auth    : {
            user : username,
            pass : pass
        }
    });

    var options = {
        from    : 'Cruel Co <hello@cruel.co>',
        to      : target,
        subject : subject,
        text    : body,
        html    : html
    };

    transport.sendMail(options, function(err, res) {
        if (err) return console.error(err);
        return next();
    });
};

var welcome = function(user, next) {
    var subject = 'Welcome to Cruel! Claim your free sticker pack.';
    var html = '<p>Thanks for joining Cruel! Cruel.co is a web app where you can share and vote on content with other students on your campus. Make sure you check out <a href="https://cruel.co/welcome" target="_blank">this post</a> to see how it works!</p><p>Every week we give away prizes to active users on Cruel.co. As one of our very first users, you\'ve already won a free Cruel sticker pack! Simply respond to this e-mail with your name and address to get your stickers in the mail!</p>';
    var data = {};
    var template = _.template(body);
    outgoing(user.email, subject, template(data), next);
};

var contact = function(email, text, next) {
    var subject = 'CONTACT EMAIL FROM: ' + email;
    var body = 'From: <%= email %>\nBody: <%= text %>';
    var data = {
        email: email,
        text: text
    };
    var template = _.template(body);
    outgoing('hello@cruel.co', subject, template(data), next);
};

var forgot = function(email, host, token, next) {
    var subject = 'Cruel.co Password Reset';
    var body = 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://<%= host %>/reset/<%= token %>\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n';
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
          'This is a confirmation that the password for your account <%= email %> has just been changed.\n';
    var data = {
        email: email
    };
    var template = _.template(body);
    outgoing(email, subject, template(data), next);
};

module.exports = {
    welcome     : welcome,
    contact     : contact,
    forgot      : forgot,
    newPassword : reset
};
