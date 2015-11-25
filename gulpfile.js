var gulp = require('gulp');
var minifyCss = require('gulp-minify-css');
var concatCss = require('gulp-concat-css');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var batch = require('gulp-batch');
var browserSync = require('browser-sync');


gulp.task('default', function() {

  browserSync.init({
        // server: {
        //     baseDir: "./"
        // }

        //Change to localhost address
        proxy: "localhost:80/melstar/layout.html"
    });
  
  watch('css/project/*.scss', batch(function (events, done) {
        gulp.start('sass', done);
    }));
  watch('css/cache/sassOutput/*.css', batch(function (events, done) {
        gulp.start('concat', done);
    }));
  watch('css/cache/conOutput/*.css', batch(function (events, done) {
        gulp.start('minify', done);

    }));

  watch('*.html', batch(function (events, done) {
      console.log('#=>html');
      return gulp.src('*.html')
             .pipe(browserSync.reload({stream:true}));
    }));
});

//Step 1: compile sass
gulp.task('sass', function () {
  gulp.src('css/project/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('css/cache/sassOutput'));
    console.log('#=>sass');
});

//Step 2: concat CSS files
gulp.task('concat', function () {
  console.log('#=>concat');
  return gulp.src('css/cache/sassOutput/*.css')
  // return gulp.src(['css/cache/sassOutput/*.css','css/bootstrap/*.css'])
    .pipe(concatCss("style.css"))
    .pipe(gulp.dest('css/cache/conOutput/'));
});

//Step 3: minify CSS file and reload browser
gulp.task('minify', function() {
  console.log('#=>minify');
  return gulp.src('css/cache/conOutput/*.css')
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(gulp.dest('css/final/'))
    .pipe(browserSync.reload({stream:true}));
});