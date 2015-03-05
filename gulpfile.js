var gulp = require('gulp');
var gulpif = require('gulp-if');
var sass = require('gulp-sass');
var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var slim = require('gulp-slim');
// var imagemin = require('gulp-imagemin'); // Removed because plugin doesn't work on Windows as a result of long paths
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var path = require('path');

var files = {
  core: {
    js: ['src/core/**/*.coffee', 'src/core/**/*.js']
  },
  client: {
    js: ['src/client/**/*.coffee', 'src/client/**/*.js'],
    css: ['src/client/**/*.scss', 'src/client/**/*.css']
  },
  admin: {
    css: ['src/admin/**/*.scss', 'src/client/**/*.css'],
    js: ['src/admin/**/*.coffee', 'src/admin/**/*.js'],
    templates: ['src/admin/templates/**/*.html', 'src/admin/templates/**/*.slim']
  }
};

gulp.task('clean', function(cb) {
  del(['dist/**'], cb);
});

var compileModuleCss = function(src, dest){
  return gulp.src(src)
    .pipe(gulpif(/[.]scss$/, sass()))
    .pipe(concat(dest))
    .pipe(gulp.dest(path.join('dist')));
};

var compileModuleJs = function(src, dest){
  return gulp.src(src)
    .pipe(gulpif(/[.]coffee$/, coffee()))
    .pipe(concat(dest))
    .pipe(gulp.dest(path.join('dist')));
};

var compileModuleTemplates = function(src){
  return gulp.src('./src/**/*.slim')
    .pipe(gulpif(/[.]slim$/, slim({
      pretty: true,
      options: "attr_list_delims={'(' => ')', '[' => ']'}"
    })))
    .pipe(gulp.dest(path.join('dist')))
}

gulp.task('compile:core:js', function() {
  // Minify and copy all JavaScript (except vendor scripts)
  // with sourcemaps all the way down
  return compileModuleJs(files.core.js, 'core/sapphire-cms.core.js');
    // .pipe(sourcemaps.init())
    // .pipe(coffee())
    // .pipe(uglify())
    // .pipe(concat('all.min.js'))
    // .pipe(sourcemaps.write())
    // .pipe(gulp.dest('dist/js'));
});

gulp.task('compile:client:js', function() {
  return compileModuleJs(files.client.js, 'client/sapphire-cms.client.js');
});

gulp.task('compile:client:css', function(){
  return compileModuleCss(files.client.css, 'client/sapphire-cms.client.css');
})

gulp.task('compile:admin:js', function(){
  return compileModuleJs(files.admin.js, 'admin/sapphire-cms.admin.js');
});

gulp.task('compile:admin:templates', function(){
  return compileModuleTemplates(files.admin.templates)
});

// Copy all static images
gulp.task('images', ['clean'], function() {
  return gulp.src(paths.images)
    //.pipe(imagemin({optimizationLevel: 5})) // Removed because plugin doesn't work on Windows as a result of long paths
    .pipe(gulp.dest('build/img'));
});

gulp.task('compile:all', [
  'compile:core:js', 
  'compile:client:js', 
  'compile:admin:js', 
  'compile:client:css',
  'compile:admin:templates'
])

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(files.core.js, ['compile:core:js']);
  gulp.watch(files.client.js, ['compile:client:js']);
  gulp.watch(files.admin.js, ['compile:admin:js']);
  gulp.watch(files.client.css, ['compile:client:css']);
  gulp.watch(files.admin.templates, ['compile:admin:templates']);
  // gulp.watch(paths.images, ['images']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['watch', 'compile:all']);