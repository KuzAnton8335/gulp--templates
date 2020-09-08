const gulp = require("gulp"); // Подключаем gulp
const browserSync = require("browser-sync").create(); // Подключение browser-sync
const watch = require("gulp-watch"); //  подкючаем gulp-watch

const sass = require("gulp-sass"); // подключение gulp-sass
const autoprefixer = require("gulp-autoprefixer"); // подключение gulp-autoprefixer
const sourcemaps = require("gulp-sourcemaps"); // подключение gulp-sourcemaps

const notify = require("gulp-notify"); // подключение gulp-notify
const plumber = require("gulp-plumber"); //  подключение gulp-plumber

const fileinclude = require("gulp-file-include"); //подключение gulp-file-include

//task сборка html файлов из шаблона
gulp.task("html", function (callback) {
  return gulp
    .src("./app/html/*.html")
    .pipe(
      plumber({
        errorHandler: notify.onError(function (err) {
          return {
            title: "HTML include",
            sound: false,
            message: err.message,
          };
        }),
      })
    )
    .pipe(fileinclude({ prefix: "@@" }))
    .pipe(gulp.dest("./app/"));
  callback();
});

// task для компиляции scss в css
gulp.task("scss", function (callback) {
  return gulp
    .src("./app/scss/main.scss")

    .pipe(
      plumber({
        errorHandler: notify.onError(function (err) {
          return {
            title: "Styles",
            sound: false,
            message: err.message,
          };
        }),
      })
    )

    .pipe(sourcemaps.init()) // включение gulp-sourcemaps (для слежения кода в chrome)
    .pipe(sass())
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 4 version"],
      }) // установка задачи для gulp-autoprefixer
    )
    .pipe(sourcemaps.write()) // запись gulp-sourcemaps
    .pipe(gulp.dest("./app/css/"));

  callback();
});

// task слежения за файлами
gulp.task("watch", function () {
  // слежение за html and css и автообновление в браузере
  watch(
    ["./app/*.html", "./app/css/**/*.css"],
    gulp.parallel(browserSync.reload)
  );

  // слежение за scss файлами
  // watch("./app/scss/**/*.scss", gulp.parallel("scss"));

  watch("./app/scss/**/*.scss", function () {
    setTimeout(gulp.parallel("scss"), 1000);
  });

  //слежение за html и сборка страниц из шаблона
  watch("./app/html/**/*.html", gulp.parallel("html"));
});

// задача для старта сервера из папки app
gulp.task("server", function () {
  browserSync.init({
    server: {
      baseDir: "./app/",
    },
  });
});

// default task слежения за файлами и запуска в браузере.
gulp.task("default", gulp.parallel("server", "watch", "scss", "html"));
