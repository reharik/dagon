/**
 * Created by parallels on 7/27/15.
 */

var gulp = require("gulp");
// Config
var del = require('del');
var babel = require('gulp-babel');

var DEBUG = process.env.NODE_ENV === "development";

gulp.task('clean', function(cb) {
    del(["./compiled"],{force:true}, cb);
});

gulp.task("copy-example",["clean"], function () {
    return gulp.src("example/**")
        .pipe(gulp.dest("./output/example"));
});

gulp.task("copy-tests",["clean"], function () {
    return gulp.src("tests/**")
        .pipe(gulp.dest("./output/tests"));
});

gulp.task("copy-root",["clean"], function () {
    return gulp.src(["package.json", "index.js", "testBootstrap.js", "babelhook.js", 'README.md'],{dot:true})
        .pipe(gulp.dest("output"));
});

gulp.task("compile", ['clean'], function () {
    return gulp.src(["src/**"])
        .pipe(babel())
        .pipe(gulp.dest("./output/src"));
});

/////////////////////////////////////////////////

gulp.task("deploy",['copy-example','copy-tests', "copy-root", "compile"]);