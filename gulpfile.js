var gulp = require('gulp');
var lr = require('gulp-livereload');
var express = require('express');
var app = express();
var sass = require('gulp-sass');
var embedlr = require('gulp-embedlr');

gulp.task('sass', function() {
    return gulp.src('style.scss')
        .pipe(sass())
        .pipe(gulp.dest('dist/'))
        .pipe(lr());
});

gulp.task('scripts', function() {
    return gulp.src(['*.js', '!gulpfile.js'])
        .pipe(gulp.dest('dist/'))
        .pipe(lr());
});

gulp.task('html', function() {
    return gulp.src('index.html')
        .pipe(embedlr({
            port: 7777
        }))
        .pipe(gulp.dest('dist/'))
        .pipe(lr());
});

gulp.task('build', ['sass', 'html', 'scripts']);

gulp.task('watch', function() {
    gulp.watch('index.html', ['html']);
    gulp.watch('*.js', ['scripts']);
    gulp.watch('style.scss', ['sass']);
});

gulp.task('serve', function() {
    lr.listen(7777);

    app.use(express.static('dist/'));
    app.listen(3333, function() {
        console.log('server is running on port 3333');
    });
});

gulp.task('default', ['serve', 'build', 'watch']);