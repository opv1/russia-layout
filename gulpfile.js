const { src, dest, series, watch } = require('gulp')
const ghPages = require('gulp-gh-pages')
const include = require('gulp-file-include')
const sync = require('browser-sync').create()
const del = require('del')
const concat = require('gulp-concat')
const htmlmin = require('gulp-htmlmin')
const sass = require('gulp-dart-sass')
const csso = require('gulp-csso')
const autoprefixer = require('gulp-autoprefixer')
const imagemin = require('gulp-imagemin')
const tildeImporter = require('node-sass-tilde-importer')
const fontmin = require('gulp-fontmin')

function htmlRu() {
  return src('./src/index.html')
    .pipe(
      include({
        prefix: '@@',
      })
    )
    .pipe(
      htmlmin({
        collapseWhitespace: true,
      })
    )
    .pipe(dest('./dist'))
}

function htmlEn() {
  return src('./src/en/index.html')
    .pipe(
      include({
        prefix: '@@',
      })
    )
    .pipe(
      htmlmin({
        collapseWhitespace: true,
      })
    )
    .pipe(dest('./dist/en'))
}

function scss() {
  return src('./src/styles/index.scss')
    .pipe(
      sass({
        importer: tildeImporter,
      })
    )
    .pipe(
      autoprefixer({
        overrideBrowserslist: ['last 2 versions'],
      })
    )
    .pipe(csso())
    .pipe(concat('index.css'))
    .pipe(dest('./dist/styles'))
}

function images() {
  return src('./src/assets/images/*')
    .pipe(imagemin())
    .pipe(dest('./dist/assets/images'))
}

function fonts() {
  return src('./src/assets/fonts/*')
    .pipe(fontmin())
    .pipe(dest('./dist/assets/fonts'))
}

function clear() {
  return del('./dist')
}

function serve() {
  sync.init({
    server: './dist',
  })

  watch('./src/parts/**/*.html', series(htmlRu)).on('change', sync.reload)
  watch('./src/en/parts/**/*.html', series(htmlEn)).on('change', sync.reload)
  watch('./src/styles/**/*.scss', series(scss)).on('change', sync.reload)
}

function publish() {
  return src('./dist/**/*').pipe(ghPages())
}

exports.build = series(clear, fonts, images, htmlRu, htmlEn, scss)
exports.serve = series(clear, fonts, images, htmlRu, htmlEn, scss, serve)
exports.deploy = series(publish)
