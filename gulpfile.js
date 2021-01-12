const {src, dest, watch, parallel, series} = require("gulp");
const scss = require("gulp-sass");
const autoprefixer  = require("gulp-autoprefixer");
const syncbrow = require("browser-sync").create();
const imgmin = require("gulp-imagemin");
const fs = require("fs");
const ttf2woff = require("gulp-ttf2woff");
const ttf2woff2 = require("gulp-ttf2woff2");
const fileinclude = require("gulp-file-include");

const htmlmin = require("gulp-htmlmin");
const webphtml = require("gulp-webp-html");
// const webpCss = require("gulp-webp-css");
const toWebp = require("gulp-webp");

// ! Creating folders and files
function folders (){
    return src("*.*", {read: false}) 
    .pipe(dest("./dist/scss/"))
    .pipe(dest("./dist/js/"))
    .pipe(dest("./dist/js/draft/"))
    .pipe(dest("./dist/img/"))
    .pipe(dest("./dist/fonts/"))
};
function files (){
    folders();
    setTimeout (() => {
        fs.writeFile("project/index.html", "!", function (err) {
            if (err) {
                throw err;
            }
            console.log("File creation finished.");
        });
        fs.writeFile("project/scss/style.scss", "", function (err) {
            if (err) {
                throw err;
            }
            console.log("File creation finished.");
        });
        fs.writeFile("project/js/draft/common.js", "", function (err) {
            if (err) {
                throw err;
            }
            console.log("File creation finished.");
        });
    },500);
};

// ! Development
// *  Конвертация scss в css
function stylesConvert (){
    return src("app/scss/style.scss")
        .pipe(scss(
        {
            outputStyle: "compressed"
        }
    ))
    .pipe(autoprefixer(
        {
            cascade: true
        }
    ))
    .pipe(dest("app/css"));
};
// * Watcher
function watchFiles (){
    watch("app/scss/**/*.scss", stylesConvert);
    watch("app/img", compressedImg);
    watch("app/pages/**/*.html", includeFile);
    watch("app/fonts/*.ttf", series(convertFonts, fontsStyle));

    watch("app/*.html").on("change", syncbrow.reload);
    watch("app/css/*.css").on("change", syncbrow.reload);
    watch("app/js/*.js").on("change", syncbrow.reload);
    watch("app/pages/**/*.html").on("change", syncbrow.reload);
};
// * Browser-sync
function browserSync (){
    syncbrow.init({
        server: {
            baseDir: "app",
            open: "local"
        }
    });
};
// * Convert imades to webp
function convertImgs (){
    return src("app/img/*.jpg")
    .pipe(toWebp())
    .pipe(dest("app/img"))
};

// * Сonvert TTF fonts
exports.cFonts = series(convertFonts, fontsStyle);

// * converting ttf in WOFF and WOFF2
function convertFonts (){
    src(['app/fonts/**.ttf'])
    .pipe(ttf2woff())
    .pipe(dest('app/fonts/'));
    return src(['app/fonts/**.ttf'])
    .pipe(ttf2woff2())
    .pipe(dest('app/fonts/'))
};

// * Font-face for fonts
const cb = () => {};

let srcFonts = "app/scss/_fonts.scss";
let appFonts = "app/fonts";

function fontsStyle (){
    let file_content = fs.readFileSync(srcFonts);

    fs.writeFile(srcFonts, "", cb);
    fs.readdir(appFonts, function (err, items) {
        if (items) {
            let c_fontname;
            for (let i = 0; i < items.length; i++) {
                let fontname = items[i].split(".");
                fontname = fontname[0];
                if (c_fontname != fontname) {
                    fs.appendFile(
                        srcFonts,
                        '@include font-face("' +
                            fontname +
                            '", "' +
                            fontname +
                            '", 400);',
                        cb
                    );
                }
                c_fontname = fontname;
            }
        }
    });
};

// * HTML parts. File-include
const includeFile = function (){
    return src("app/pages/*.html")
    .pipe(
        fileinclude({
        prefix: "@@",
        basepath: "@file"
    })
    )
    .pipe(dest("app"))
}



// scss в css
exports.stylesConvert = stylesConvert;
// Watcher
exports.watchFiles = watchFiles;
// Browser-sync
exports.browserSync = browserSync;
// Compressed Images
exports.compressedImg = compressedImg;
// Creating folders and files
exports.struct = files;
//  Fonts
exports.fontStyle = fontsStyle;
exports.convertFonts = convertFonts;
// File-include, HTML parts
exports.includeFile = includeFile;
// * Convert imades to webp
exports.convertImgs = convertImgs;


exports.default = parallel(includeFile, stylesConvert, browserSync, watchFiles, convertImgs);



// ! Build
function moveHtml (){
    return src("app/*.html")
    .pipe(webphtml())
    .pipe(htmlmin(
        { collapseWhitespace: true,
          removeComments: true
        }
    ))
    .pipe(dest("dist"))
};
function moveCss (){
    return src("app/css/*.css")
    // .pipe(webpCss())
    .pipe(dest("dist/css"))
};
function moveFonts (){
    return src("app/fonts/**")
    .pipe(dest("dist/fonts"))
};
function moveJs (){
    return src("app/js/*.js")
    .pipe(dest("dist/js"))
};
// * Image Compressed
function compressedImg (){
    return src("app/img/**")
    .pipe(imgmin())
    .pipe(dest("dist/img"))
};

exports.moveHtml = moveHtml;
exports.moveCss = moveCss;
exports.moveJs = moveJs;
exports.compressedImg = compressedImg;
exports.moveFonts = moveFonts

exports.build = series(moveHtml, moveCss, moveJs, moveFonts, compressedImg);