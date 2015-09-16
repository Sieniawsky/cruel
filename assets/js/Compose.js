var $         = require('jquery');
var _         = require('lodash');
var Backbone  = require('backbone');
var valid     = require('valid-url');
Backbone.$    = $;

var Compose = Backbone.View.extend({
    el: '.js-compose',

    events: {
        'input .js-image': 'updatePreview'
    },

    initialize: function() {
        var that = this;
        this.$composeErrors = $('.js-compose-errors');
        document.getElementById("file_input").onchange = function() {
            var files = document.getElementById("file_input").files;
            var file = files[0];
            console.log(file);
            if (file === null) {
                console.log('No file selected');
            } else if (file.size > 19000000) {
                // display error
                this.$composeErrors.empty();
                this.$composeErrors.append('<div class="form-message-error">Files must be less than 19 Megabytes</div>');
                $('#upload_url').val('');
                $('.preview-container').hide();
            } else {
                $('.js-image').val('');
                $('#preview').attr('src', '/images/loading.gif');
                $('.preview-container').show();
                that.get_signed_request(file);
            }
        };
        this.render();
    },

    updatePreview: function() {
        var url = $('.js-image').val();
        if (valid.isUri(url)) {
            $('.preview-container').show();
            $('#upload_url').val('');
            $('#preview').attr('src', url);
        }
    },

    get_signed_request: function(file) {
        var that = this;
        $.ajax({
            url: '/sign_s3?file_name=' + file.name + '&file_type=' + file.type,
            type: 'GET',
            success: function(data) {
                var parsed = JSON.parse(data);
                that.upload_file(file, parsed.signed_request, parsed.url);
            },
            failure: function(data) {
                console.log('Could not get signed URL');
            }
        });
    },

    upload_file: function(file, signed_request, url) {
        var xhr = new XMLHttpRequest();
        xhr.open("PUT", signed_request);
        xhr.setRequestHeader('x-amz-acl', 'public-read');
        xhr.onload = function() {
            if (xhr.status === 200) {
                document.getElementById("preview").src = url;
                document.getElementById("upload_url").value = url;
            }
        };
        xhr.onerror = function() {
            console.log("Could not upload file.");
        };
        xhr.send(file);
    },

    render: function() {}
});

$(function() {
    var compose = new Compose();
});