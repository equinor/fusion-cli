var gulp = require('gulp');
var ts = require('gulp-typescript');
var install = require('gulp-install');
var merge = require('merge2');


var buildProjectWithLibs = function (name) {
    gulp.src(["./tasks/" + name + "/package.json"]).pipe(install());

    var libResult = gulp.src('./tasks/libs/*.ts')
        .pipe(ts());

    var tsProject = ts.createProject("./tasks/" + name + "/tsconfig.json");

    var taskResult = tsProject.src()
        .pipe(tsProject());

    return merge(
        libResult.js.pipe(gulp.dest('./tasks/' + name + '/built/libs')),
        taskResult.js.pipe(gulp.dest('./tasks/' + name + '/built'))
    );
        
}

gulp.task('fusion-framework', () => {
    return buildProjectWithLibs("fusion-framework");
});

gulp.task('fusion-app', () => {
    return buildProjectWithLibs("fusion-app");
});

gulp.task('fusion-tile', () => {
    return buildProjectWithLibs("fusion-tile");
});

gulp.task('fusion-cli', () => {
    return buildProjectWithLibs("fusion-cli");
});

gulp.task('build',  gulp.series('fusion-framework', 'fusion-app', 'fusion-tile', 'fusion-cli'));