/* This is where it all begins */

var express = require('express');

var app = express();

app.listen(3000, function() {
    console.log('Starting on port 3000');
});