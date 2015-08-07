var _          = require('lodash');
var glob       = require('glob');
var path       = require('path');
var gulp       = require('gulp');
var server     = require('gulp-develop-server');
var plumber    = require('gulp-plumber');
var livereload = require('gulp-livereload');
var gutil      = require('gulp-util');
var jshint     = require('gulp-jshint');
var less       = require('gulp-less');
var minify     = require('gulp-minify-css');
var autoprefix = require('gulp-autoprefixer');
var browserify = require('browserify');
var source     = require('vinyl-source-stream');

var port = 35729;

gulp.task('default', ['go']);

gulp.task('server:start', function() {
    server.listen({path: 'server.js'}, livereload.listen);
});
gulp.task('serve', ['server:start', 'lint'], function() {
    var restart = function(file) {
        server.changed(function(err) {
            if (!err) livereload.changed(file.path);
        });
    };

    gulp.watch(['server.js', 'app/**/*.js', 'config/**/*.js']).on('change', restart);
});

gulp.task('lint', function() {
    gutil.log('Running lint on source');
    return gulp.src(['app/**/*.js', 'config/**/*.js'])
        .pipe(plumber())
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .on('end', function() {
            gutil.log('Lint complete');
        });
});

gulp.task('lint-assets', function() {
    gutil.log('Running lint on assets');
    return gulp.src(['assets/js/**/*.js'])
        .pipe(plumber())
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .on('end', function() {
            gutil.log('Lint complete');
        });
});

gulp.task('html', function() {
    return gulp.src('views/**/*.html')
        .pipe(livereload())
        .on('end', function() {
            gutil.log('Views refreshed');
        })
});

gulp.task('less', function() {
    gutil.log('Building CSS');
    return gulp.src('./assets/less/**/*.less')
        .pipe(plumber())
        .pipe(less({
            paths: [path.join(__dirname, 'less', 'includes')]
        }))
        .pipe(autoprefix({
            browsers : ['last 2 versions'],
            cascade  : false
        }))
        .pipe(gutil.env.type === 'prod' ? minify() : gutil.noop())
        .pipe(gulp.dest('./public/css'))
        .pipe(gutil.env.type !== 'prod' ? livereload() : gutil.noop())
        .on('end', function() {
            gutil.log('CSS build complete');
        });
});

gulp.task('scripts', ['lint-assets'], function() {
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
        .pipe(livereload())
        .on('end', function() {
            gutil.log('JS build complete');
        });
});

gulp.task('build', ['less', 'scripts']);
gulp.task('build-prod', ['less --type prod', 'scripts']);

gulp.task('watch', function() {
    gulp.watch('views/**/*.html', ['html']);
    gulp.watch('assets/js/**/*,js', ['scripts']);
    gulp.watch('assets/less/**/*.less', ['less']);
});

gulp.task('go', ['build', 'serve', 'watch']);
