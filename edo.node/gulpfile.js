var gulp = require("gulp");
var typescript = require("gulp-typescript");
var nodemon = require("gulp-nodemon");
var tslint = require("gulp-tslint");
var runSequence = require("run-sequence");
var rimraf = require("rimraf");
var sourcemaps = require("gulp-sourcemaps");

var tsProject = typescript.createProject("tsconfig.json");

gulp.task("clean:build", function(callback) {
    rimraf("./build", callback);
});

gulp.task("compile:typescript", function() {
    var tsResult = tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(typescript(tsProject));

    return tsResult.js
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("build"));
});

gulp.task("tslint", function() {
    return gulp.src("app/**/*.ts")
        .pipe(tslint({
            formatter: "verbose"
        }))
        .pipe(tslint.report({
            emitError: false
        }));
});

gulp.task("copy:bat", function() {
    return gulp.src("app/**/*.bat").pipe(gulp.dest("build"));
});

gulp.task("copy:pug", function() {
    return gulp.src("app/**/*.pug").pipe(gulp.dest("build"));
});

gulp.task("copy:script", function() {
    return gulp.src("app/**/*.js").pipe(gulp.dest("build"));
});

gulp.task("copy", ["copy:bat", "copy:pug", "copy:script"]);

gulp.task("build", function(callback) {
    runSequence("clean:build", "tslint", "compile:typescript", "copy", callback);
});

gulp.task("watch", ["build"], function() {
    return nodemon({
        ext: "ts pug js json bat",
        script: "build/server.js",
        watch: ["app/*"],
        tasks: ["build"]
    });
});