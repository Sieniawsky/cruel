/* Gulpfile for the Cruel project */
var _          = require('lodash');
var glob       = require('glob');
var path       = require('path');
var gulp       = require('gulp');
var gls        = require('gulp-live-server');
var gutil      = require('gulp-util');
var jshint     = require('gulp-jshint');
var uglify     = require('gulp-uglify');
var less       = require('gulp-less');
var minify     = require('gulp-minify-css');
var autoprefix = require('gulp-autoprefixer');
var rename     = require('gulp-rename');
var browserify = require('browserify');
var source     = require('vinyl-source-stream');

/* The default task is the watch task */
gulp.task('default', ['watch']);

/* The watch task used during development */
gulp.task('watch', ['jshint', 'build-css', 'build-js'], function() {
    var server = gls.new('server.js');
    server.start();

    gulp.watch('.views/**/*.html', function() {
        server.notify.apply(server);
    });
    gulp.watch('./assets/less/**/*.less', ['build-css'], function() {
        server.notify.apply(server);
    });
    gulp.watch('./assets/js/**/*.js', ['jshint', 'build-js'], function() {
        server.notify.apply(server);
    });
    gulp.watch('./app/**/*.js', function() {
        server.start.bind(server);
    });
    gutil.log('Watching for snitches and fakes');
});

/* ************************************************** */
/*                     Build tasks                    */
/* ************************************************** */

/* Task that run the jshint linter */
gulp.task('jshint', function() {
    gutil.log('Running jshint');
    return gulp.src('./assets/js/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .on('end', function() {
            gutil.log('jshint complete');
        });
});

/* Task that compiles all less files */
gulp.task('build-css', function() {
    gutil.log('Building CSS');
    return gulp.src('./assets/less/**/*.less')
        .pipe(less({
            paths: [path.join(__dirname, 'less', 'includes')]
        }))
        .pipe(autoprefix({
            browsers : ['last 2 versions'],
            cascade  : false
        }))
        .pipe(gutil.env.type === 'production' ? minify() : gutil.noop())
        .pipe(rename(function(path) {
            path.basename += '-min';
        }))
        .pipe(gulp.dest('./public/css'))
        .on('end', function() {
            gutil.log('CSS build complete');
        });
});

/* Task that browserifies and uglifies all js */
gulp.task('build-js', function() {
    var sourceFiles = _.map(glob.sync('assets/js/*.js'), function(file) {
        return file;
    });

    var destFiles = _.map(sourceFiles, function(file) {
        return file.replace('assets/js', 'public/js/bundles');
    });

    gutil.log('Building JS');
    return browserify({entries: sourceFiles})
        .plugin('factor-bundle', {outputs: destFiles})
        .bundle()
        .pipe(source('common.js'))
        .pipe(gulp.dest('public/js/bundles'))
        .on('end', function() {
            gutil.log('JS build complete');
        });
});

/* Task that builds a production version of the application */
gulp.task('build', ['jshint', 'build-css --type production', 'build-js']);
