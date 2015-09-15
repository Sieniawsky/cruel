var _      = require('lodash');
var mailer = require('nodemailer');

var username = 'hello@cruel.co';
var pass = '4kjj==311';

var outgoing = function(target, subject, html, next) {
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
    var template = _.template(html);
    outgoing(user.email, subject, template(), next);
};

var contact = function(email, text, next) {
    var subject = 'CONTACT EMAIL FROM: ' + email;
    var html = '<p>From: <%= email %></p><p>Body: <%= text %></p>';
    var data = {
        email: email,
        text: text
    };
    var template = _.template(html);
    outgoing('hello@cruel.co', subject, template(data), next);
};

var forgot = function(email, host, token, next) {
    var subject = 'Cruel.co Password Reset';
    var html = '<p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p><p>Please click on the following link, or paste this into your browser to complete the process:</p><p>http://<%= host %>/reset/<%= token %></p><p>If you did not request this, please ignore this email and your password will remain unchanged.</p>';
    var data = {
        host: host,
        token: token
    };
    var template = _.template(html);
    outgoing(email, subject, template(data), next);
};

var reset = function(email, next) {
    var subject = 'Cruel.co Successful Password Reset';
    var html = '<p>Hello,</p><p>This is a confirmation that the password for your account <%= email %> has just been changed.</p>';
    var data = {
        email: email
    };
    var template = _.template(html);
    outgoing(email, subject, template(data), next);
};

module.exports = {
    welcome     : welcome,
    contact     : contact,
    forgot      : forgot,
    newPassword : reset
};
