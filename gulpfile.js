var gulp = require('gulp');

var path = {
  static: './static/',
  src: './src/',
  dist: './dist/',
  firebasePublic: './firebase/public/',
}
const copy = () => {
  return gulp
    .src([
      `${path.static}index.html`,
    ], { base: `${path.static}` })
    .pipe(gulp.dest('./dist/'));
}

const copyAssets = () => {
  return gulp
    .src([
      `${path.src}assets/**/*.*`,
    ], { base: `${path.src}` })
    .pipe(gulp.dest('./dist/'));
}

const copyFirebase = () => {
  return gulp
    .src([
      `${path.dist}/**/*.*`,
    ], { base: `${path.dist}` })
    .pipe(gulp.dest(path.firebasePublic));
}

gulp.task('firebase', gulp.series(copyFirebase,
  function (done) {
    done();
  })
);

gulp.task('default', gulp.series(copy, gulp.parallel([copyAssets]),
  function (done) {
    done();
  })
);
