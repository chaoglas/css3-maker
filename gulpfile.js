var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var htmlmin = require('gulp-htmlmin'), //html压缩
    imagemin = require('gulp-imagemin'),//图片压缩
    pngcrush = require('imagemin-pngcrush'),
    minifycss = require('gulp-minify-css'),//css压缩
    jshint = require('gulp-jshint'),//js检测
    uglify = require('gulp-uglify'),//js压缩
    concat = require('gulp-concat'),//文件合并
    rename = require('gulp-rename'),//文件更名
    notify = require('gulp-notify');//提示信息

// 监视文件改动并重新载入
gulp.task('serve', function() {
  browserSync({
    server: {
      baseDir: './'
    }
  });

  gulp.watch(['css3-editor/*.html','css3-editor/js/*.js','css3-editor/css/*.css'], reload);
});

// 压缩html
gulp.task('html', function() {
  return gulp.src('css3-editor/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./dest'))
    .pipe(notify({ message: 'html task ok' }));
 
});

// 合并、压缩、重命名css
gulp.task('css', function() {
  return gulp.src('css3-editor/css/*.css')
    .pipe(concat('main.css'))
    .pipe(gulp.dest('dest/css'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(gulp.dest('dest/css'))
    .pipe(notify({ message: 'css task ok' }));
});

// 压缩图片
gulp.task('img', function() {
  return gulp.src('css3-editor/img/*')
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngcrush()]
    }))
    .pipe(gulp.dest('./dest/img/'))
    .pipe(notify({ message: 'img task ok' }));
});

// 检查js
gulp.task('lint', function() {
  return gulp.src('css3-editor/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(notify({ message: 'lint task ok' }));
});
 
// 合并、压缩js文件
gulp.task('js', function() {
  return gulp.src('css3-editor/js/*.js')
    .pipe(concat('all.js'))
    .pipe(gulp.dest('dest/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('dest/js'))
    .pipe(notify({ message: 'js task ok' }));
});

gulp.task('default', ['css','js', 'img'], function() {});