const gulp = require("gulp");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const terser = require("gulp-terser");
const rename = require("gulp-rename");
const imageResize = require("gulp-image-resize");
const imgmin = require("gulp-imagemin");

function styles() {

    return(
        gulp.src("css/*.scss")
            .pipe(sourcemaps.init())
            .pipe(sass())
            .pipe(postcss([autoprefixer(), cssnano()]))
            .pipe(sourcemaps.write("."))
            .pipe(gulp.dest("css"))
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
        gulp.src(["images/*.png", "images/*.jpg"])
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

function imagemin() {
    return(
        gulp.src(["images/*", "!images/*.min"])
            .pipe(imgmin())
            .pipe(rename({
                suffix: ".min"
            }))
            .pipe(gulp.dest("dist/images"))
    );
}

function watch(){
    gulp.watch("css/*.scss", styles);
    gulp.watch(["js/*.js", "!js/*.min.js"], js)
}

const build = gulp.parallel(styles, js);

exports.styles = styles;
exports.js = js;
exports.imageResizes = imageResizes;
exports.imagemin = imagemin;
exports.watch = watch;
exports.build = build;
