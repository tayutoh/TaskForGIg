//----------------------------------------
//プラグイン読込
//----------------------------------------
var gulp = require('gulp');
var sass = require('gulp-sass'); //sassのコンパイル
var csscomb = require('gulp-csscomb'); //cssの整形
var runSequence = require('run-sequence'); //gulpタスクの実行順序を指定
var browserSync = require('browser-sync').create(); //確認環境構築
var connectSSI = require ('connect-ssi') //browserSyncでssiを使うためのプラグイン
var autoprefixer = require('gulp-autoprefixer'); //ベンダープレフィックスの管理
var plumber = require('gulp-plumber'); //エラー時にタスクを終了させないためのプラグイン
var pug = require('gulp-pug'); //pug（旧jade）のコンパイル
var data = require('gulp-data'); //jsonを扱うためのプラグイン
var prettify = require('gulp-prettify'); //htmlの整形
var fs = require('fs'); // fsモジュールを準備
var changed = require('gulp-changed'); // 更新ファイル検知

//----------------------------------------
//pug
//----------------------------------------
var seriesPathSrcHtml = [
  './_resource/**/*.pug',
	'./_resource/**/**/*.pug',
	'!./_resource/_**/*.pug'
];


// 更新分だけコンパイル
gulp.task('pug_indiv', function buildHTML() {
  return gulp.src(seriesPathSrcHtml)
  .pipe(plumber())
  .pipe(changed(
    'html',
    {
      extension: '.html'
    }
  ))
  .pipe(pug({
    pretty: true,
    basedir: '_resource/'
  }))
  // .pipe(prettify({indent_size: 0}))
  .pipe(gulp.dest('html'))
  .pipe(browserSync.stream());
});

// 全pugファイルコンパイル
gulp.task('pug_all', function buildHTML() {
  return gulp.src(seriesPathSrcHtml)
  .pipe(plumber())
  .pipe(pug({
    pretty: true,
    basedir: '_resource/'
  }))
  // .pipe(prettify({indent_size: 0}))
    .pipe(gulp.dest('html'))
  .pipe(browserSync.stream());
});

//----------------------------------------
//sass
//----------------------------------------
gulp.task('sass', function() {
  return gulp.src([
    '_resource/**/*.scss',
	'_resource/**/**/*.scss',
	'_resource/**/**/**/*.scss',
	'!_resource/**/_*.scss'
  ])
  .pipe(sass({outputStyle: 'compact'}).on('error', sass.logError))
  .pipe(autoprefixer({
    // IEは9以上、Androidは4以上、iOS Safariは8以上
    // その他は最新2バージョンで必要なベンダープレフィックスを付与する設定
    browsers: ["last 2 versions", "ie >= 9", "Android >= 4","ios_saf >= 8"],
    cascade: false
  }))
  .pipe(gulp.dest('html'))
  .pipe(browserSync.stream());
});




//----------------------------------------
//copy
//----------------------------------------
gulp.task('copy', function() {
  return gulp.src([
    '_resource/**/*',
    '!_resource/**/*.scss',
    '!_resource/_*/',
    '!_resource/**/*.pug',
    '!_resource/**/_*/',
    '!_resource/css/_*/',
  ])
  .pipe(gulp.dest('html'))
  .pipe(csscomb())
  .pipe(browserSync.stream());
});


//----------------------------------------
//watch
//----------------------------------------
gulp.task('watch', function() {
  browserSync.init({
    server: {
      baseDir: "html",
    },
    port: 1044,
    middleware: [
      connectSSI({
        baseDir: __dirname + "/html",
        ext: ".html"
      })
    ]
  });

  gulp.watch(['_resource/**/*.scss'], ['sass']);
  gulp.watch(['_resource/**/*.pug'], ['pug_indiv']);
  gulp.watch(['_resource/_pug/*.pug', '_resource/**/_pug/*.pug'], ['pug_all']);
   gulp.watch([
    '_resource/**/*',
    '!_resource/**/*.scss',
    '!_resource/**/*.pug'
    ], ['copy']);
});

gulp.task('default', function(callback) {
  runSequence(['pug_all', 'sass', 'watch'], 'copy', callback);
});
