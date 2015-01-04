

var gulp    = require('gulp');
var gutil    = require('gulp-util');
var concat  = require('gulp-concat');
var watch  = require('gulp-watch');
var connect = require('gulp-connect');
var livereload = require('gulp-livereload');
var         sass = require('gulp-sass');


var apps = require('./package.json');

gulp.task('wsass', function(){
    console.log('wsass:'+(+new Date));
    gulp.watch(['./public/sass/*'], ['sass']);
})

gulp.task('sass', function () {
    console.log('sass:'+(+new Date));
  gulp.src('./public/sass/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./public/css'))
});

