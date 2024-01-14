const { src, dest, watch } = require('gulp');
const less = require('gulp-less');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const glob = require('glob');
const clean = require('gulp-clean-css');
const autoprefix = require('autoprefixer');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const minify = require('gulp-minify');

// Konfiguracja pod browser-sync
const config = {
    // Link do strony która ma wyświetlać się lokalnie
    // proxy: "https://demo155-pl.yourtechnicaldomain.com/",

    // Linki do folderu z plikami źródłowymi
    src: "./src",

    // Link do katalogu wynikowego - do niego zapiszą się wszystkie pliki wynikowe css, js
    build: "./build",

    // Linki do assetów
    assets: {
        css: [
            "css/*.css"
        ],
        less: [
            "less/**/*.less"
        ],
        js: [
            "js/**/*.js"
        ]
    },

    concat_css: 'full.css',
    concat_js: 'app.js',
}

// funkcja kompilująca kod less na CSS i łącząca pliki w jeden wspólny plik
function lessCompiler() {
    if ( config.concat_css !== undefined ) {
        return src(config.src + "/" + config.assets.less)
            .pipe(less())
            .pipe(concat(config.concat_css))
            .pipe(dest(config.build + '/css'))
            .pipe(browserSync.stream());
    }
    return src(config.src + "/" + config.assets.less)
            .pipe(less())
            .pipe(dest(config.build + '/css'))
            .pipe(browserSync.stream());
}

// Kompiluje less, minifikuje i autoprefixuje
function lessBuild(string) {
    return src(config.src + "/" + config.assets.less)
        .pipe(less())
        .pipe(sourcemaps.init())
        .pipe(postcss([ autoprefix() ]))
        .pipe(clean({compatibility: '*'}))
        .pipe(dest(config.build + '/css'))
}

// minifikuje css
function cssBuild(string) {
    return src('./assets/' + config.assets.css)
        .pipe(clean({compatibility: '*'}))
        .pipe(dest(config.build + '/css'))
        .pipe(browserSync.stream());
}

// funkcja łącząca pliki js w jeden
function jsConcat() {
    if ( config.concat_js !== undefined ) {
        return src(config.src + "/" + config.assets.js)
            .pipe(concat( config.concat_js ))
            .pipe(dest(config.build + '/js'))
            .pipe(browserSync.stream());
    }
    return src(config.src + "/" + config.assets.js)
        .pipe(dest(config.build + '/js'))
        .pipe(browserSync.stream());
}

// JS builder
function jsbuild() {
    if ( config.concat_js !== undefined ) {
        return src(config.src + "/" + config.assets.js)
            .pipe(concat( config.concat_js ))
            .pipe(minify())
            .pipe(dest(config.build + '/js'))
            .pipe(browserSync.stream());
    }
    return src(config.src + "/" + config.assets.js)
        .pipe(dest(config.build + '/js'))
        .pipe(minify())
        .pipe(browserSync.stream());
}

exports.default = function() {
    // Pierwsze wywołanie funkcji dla less i js.
    lessCompiler();
    jsConcat();

    // Inicjalizacja browser-sync
    browserSync.init({
        // To jest po to żeby mozna było bez problemu otwierać wiele okien przeglądarek
        ghostMode: false,

        // Server - potrzebny do hotsotwania plików lokalnych, wykomentowywujemy przy proxy
        // server: {
        //     baseDir: "./"
        // },
        server: ['./src/html'],

        // rewriteRules: [
        // // wkleja pliki z build/css na koniec <head>
        // // Sprawdza się podczas pracy współdzielonej, lub konkretnym elemencie
        // {
        //     match: /<\/head>/i,
        //     fn: function(req, res, match) {
        //         let localCssAssets = ``

        //         if (req.originalUrl.match( config.reg )) {
        //             for (let index = 0; index < config.assets.css.length; index++) {
        //                 const files = glob.sync(config.assets.css[index], {
        //                     cwd: config.build
        //                 });

        //                 console.log("CSS Files:", files);

        //                 for (const file in files) {
        //                     localCssAssets += '<link rel="stylesheet" type="text/css" href="' + config.build.replace('.','') + "/" + files[file] + '"/>';
        //                 }
        //             }
        //         }

        //         return localCssAssets + match;
        //     }
        // }],

        // snippetOptions: {
        //     rule: {
        //         match: /<\/body>/i,
        //         fn: function (snippet, match) {
        //             let localJSAssets = ``
        //             for (let index = 0; index < config.assets.js.length; index++) {
        //                 const files = glob.sync(config.assets.js[index], {
        //                     cwd: config.build
        //                 });

        //                 console.log("JS Files:", files);

        //                 for (const file in files) {
        //                     localJSAssets += '<script src="' + config.build.replace('.','') + "/" + files[file] + '"></script>';
        //                 }
        //             }

        //             return localJSAssets + snippet + match;
        //         }
        //     }
        // },

        // Hostowanie plików przez serwer, skonfiguruj pod swoją strukturę
        serveStatic: [{
            route: ['/build','/lib', '/assets', '/data'],
            dir: ['./build','./lib', '../assets', './assets_local']
        }],
		watchTask: true
    });

    // Śledzenie zmian w pliku, przy zapisie wywołujemy funkcje podaną w drugim parametrze
    watch('src/less/*less', lessCompiler);
    watch('src/js/*.js', jsConcat);
    
    // Możesz wykomentować jeżeli pracujesz na proxy
    watch('src/html/*.html').on('change', browserSync.reload);
}
// Exporty gulp - wywoływane z konsolo, np. gulp less
exports.less = lessCompiler;
exports.js = jsbuild;
exports.less_build = lessBuild;
exports.css_build = cssBuild;