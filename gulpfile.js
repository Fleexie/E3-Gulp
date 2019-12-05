const gulp = require("gulp");
const sass = require("gulp-sass");
const browserSync = require('browser-sync');
const sourcemaps = require("gulp-sourcemaps");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const terser = require("gulp-terser");
const rename = require("gulp-rename");
const imageResize = require("gulp-image-resize");

function styles() {

    return(
        gulp.src("css/*.scss")
            .pipe(sourcemaps.init())
            .pipe(sass())
            .pipe(postcss([autoprefixer(), cssnano()]))
            .pipe(sourcemaps.write("."))
            .pipe(gulp.dest("css"))
            .pipe(browserSync.stream())
    );
    
}
function js() {
    return(
      gulp.src(["js/*.js", "!js/*.min.js"])
          .pipe(terser())
          .pipe(rename({
              suffix: ".min"
          }))
          .pipe(gulp.dest("js"))
    );
}

function imageResizes() {
    return(
        gulp.src(["images/*", "!images/*.min.*"])
            .pipe(imageResize({
                width : 100,
                height : 100,
                crop : true,
                upscale : false,
                imageMagick : true
            }))
            .pipe(rename({
                suffix: ".min"
            }))
            .pipe(gulp.dest("images"))
    );
}

function watch(){
    gulp.watch("css/*.scss", styles);
    gulp.watch(["js/*.js", "!js/*.min.js"], js);
    gulp.watch("*.html").on("change", browserSync.reload);

    browserSync.init({
        server: {
            baseDir: './'
        }
    });
}

const build = gulp.parallel(styles, js);

const size = require('gulp-size');
const notify = require('gulp-notify');

gulp.task('default', () => {
    const s = size();

    return gulp.src(['*.html','.css/*.scss'])
        .pipe(s)
        .pipe(gulp.dest('dist'))
        .pipe(notify({
            onLast: true,
            message: () => `Total size ${s.prettySize}`
        }));
});


exports.styles = styles;
exports.js = js;
exports.imageResizes = imageResizes;
exports.watch = watch;
exports.build = build;
