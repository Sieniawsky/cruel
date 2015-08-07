var _          = require('lodash');
var glob       = require('glob');
var path       = require('path');
var gulp       = require('gulp');
var nodemon    = require('gulp-nodemon');
//var server     = require('tiny-lr')();
var plumber    = require('gulp-plumber');
var livereload = require('gulp-livereload');
var gutil      = require('gulp-util');
var jshint     = require('gulp-jshint');
var less       = require('gulp-less');
var minify     = require('gulp-minify-css');
var autoprefix = require('gulp-autoprefixer');
var rename     = require('gulp-rename');
var browserify = require('browserify');
var source     = require('vinyl-source-stream');

var port = 35729;

gulp.task('default', ['go']);

gulp.task('serve', function() {
    nodemon({
        script : 'server.js',
        ext    : 'html js less',
        ignore : ['public/css/**/*.css', 'public/js/bundles/**/*.js']
    })
});

gulp.task('lint', function() {
    gutil.log('Running lint');
    return gulp.src(['app/**/*.js', 'config/**/*.js', 'assets/js/**/*.js'])
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
        .pipe(gulp.dest('./public/css'))
        .pipe(livereload())
        .on('end', function() {
            gutil.log('CSS build complete');
        });
});

gulp.task('less-prod', function() {
    gutil.log('Building production css');
    return gulp.src('assets/less/**/*.less')
        .pipe(plumber())
        .pipe(less({
            paths: [path.join(__dirname, 'less', 'includes')]
        }))
        .pipe(autoprefix({
            browsers : ['last 2 versions'],
            cascade  : false
        }))
        .pipe(minify())
        .pipe(rename(function(path) {
            path.basename += '-min';
        }))
        .pipe(gulp.dest('public/css'))
        .on('end', function() {
            gutil.log('Production CSS build complete');
        });
});

gulp.task('scripts', function() {
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

gulp.task('build', ['less', 'scripts', 'lint']);

gulp.task('lr', function() {
    livereload.listen();
});

gulp.task('watch', function() {
    gulp.watch('views/**/*.html', ['html']);
    gulp.watch('assets/js/**/*,js', ['lint', 'scripts']);
    gulp.watch('assets/less/**/*.less', ['less']);
});

gulp.task('develop', ['build', 'lr', 'serve', 'watch']);

gulp.task('go', ['develop']);
