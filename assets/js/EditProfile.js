var $ = require('jquery');
var _ = require('lodash');
var Backbone = require('backbone');
Backbone.$ = $;

var EditProfile = Backbone.View.extend({

    el: '.js-edit-profile',

    events: {
        'input .js-image': 'updatePreview'
    },

    initialize: function() {
        this.$imageUrl = $('.js-image');
        this.$uploadImage = $('#upload_url');
        this.$preview = $('#preview');
        this.$previewContainer = $('.preview-container');
        this.$description = $('.js-description');

        var that = this;
        document.getElementById("file_input").onchange = function() {
            var files = document.getElementById("file_input").files;
            var file = files[0];
            if (file === null) {
                console.log('No file selected');
            } else {
                that.$imageUrl.val('');
                that.$preview.attr('src', '/images/loading.gif');
                that.$previewContainer.show();
                that.get_signed_request(file);
            }
        };
        this.render();
    },

    updatePreview: function() {
        var url = this.$imageUrl.val();
        if (valid.isUri(url)) {
            this.$previewContainer.show();
            this.$uploadImage.val('');
            this.$preview.attr('src', url);
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
        var that = this;
        var xhr = new XMLHttpRequest();
        xhr.open("PUT", signed_request);
        xhr.setRequestHeader('x-amz-acl', 'public-read');
        xhr.onload = function() {
            if (xhr.status === 200) {
                that.$preview.src = url;
                that.$uploadImage.value = url;
            }
        };
        xhr.onerror = function() {
            console.log("Could not upload file.");
        };
        xhr.send(file);
    },

    render: function() {
        this.$imageUrl.val(initData.user.imageUrl);
        this.$description.val(initData.user.description);    
    }
});

$(function() {
    var editProfile = new EditProfile();
});