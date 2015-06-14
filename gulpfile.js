'use strict';

var gulp = require('gulp');
var mocha = require('gulp-mocha');
var notify = require('gulp-notify');
var eslint = require('gulp-eslint');
var console = require('better-console');
var plumber = require('gulp-plumber');
var istanbul = require('gulp-istanbul');
var notifier = require('node-notifier');
var coveralls = require('gulp-coveralls');
var error = function(task) {
  return notify.onError({
    message: '<%= error.message %>',
    title: task + ' error',
    icon: null
  });
};

gulp.task('default', ['clear', 'lint', 'test']);

gulp.task('watch', function() {
  gulp.watch(['lib/**/*.js', 'test/**/*.js'], ['default']);
});

gulp.task('clear', function() {
  console.clear();
});

gulp.task('test', function() {
  return gulp.src('test/**/*.js', {read: false})
    .pipe(plumber({errorHandler: error('test')}))
    .pipe(mocha());
});

gulp.task('lint', function() {
  return gulp.src(['lib/**/*.js', 'test/**/*.js'])
    .pipe(plumber({errorHandler: error('lint')}))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('coverage', function (callback) {
  console.clear();
  gulp.src('lib/**/*.js')
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .on('finish', function () {
      gulp.src(['test/*.js'])
        .pipe(mocha())
        .pipe(istanbul.writeReports())
        .pipe(istanbul.enforceThresholds({ thresholds: { global: 100 } }))
        .on('end', callback);
    });
});

gulp.task('coveralls', ['lint', 'test', 'coverage'], function() {
  return gulp.src('coverage/lcov.info').pipe(coveralls());
});
