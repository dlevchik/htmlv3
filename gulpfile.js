// ================================
//    My first working gulp setup
// ================================

const gulp = require('gulp');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync').create();

function browsersync(done) {
    browserSync.init({ 
        server: "", 
        online: true 
    });
	done();
}

function styles(done){
	console.log('processing styles...');
	return gulp.src('./css/**.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(sass())
		.pipe(postcss([autoprefixer()]))
		.pipe(gulp.dest('./css'))
		.pipe(browserSync.stream());
	done();
}

function process(){
	gulp.watch("./css/**.scss", styles).on('change', browserSync.reload);
	gulp.watch("*.js").on('change', browserSync.reload);
	gulp.watch("*.html").on('change', browserSync.reload);
}

exports.browsersync = browsersync;
exports.styles = styles;
exports.default = gulp.series(browsersync, styles, process);