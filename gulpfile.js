var gulp = require("gulp");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var watchify = require("watchify");
var tsify = require("tsify");
var gutil = require("gulp-util");
var sourcemaps = require('gulp-sourcemaps');

// 自定义 browserify 选项
var watchedBrowserify = watchify(browserify({
	basedir: '.',
	debug: true,
	entries: ['src/index.ts'],
	cache: {},
	packageCache: {}
}).plugin(tsify, {
	target: "ES5", 			// 适配低版本浏览器
	module: "CommonJS", 	// 关键：输出 CommonJS 模块，兼容 Browserify
	//strict: true, 			// 开启严格模式，提前发现类型错误
	esModuleInterop: true, 	// 兼容 ES Module 和 CommonJS 的互操作
	skipLibCheck: true, 	// 跳过第三方库的类型检查，加快编译速度
	forceConsistentCasingInFileNames: true, 
							// 强制文件名大小写一致
	sourceMap: true 		// 生成源映射，方便调试
}));

function bundle() {
	return watchedBrowserify
		.bundle()
		.on('error', function (err) {
			// 更健壮的错误处理：打印错误并确保 watch 任务不会停止
			gutil.log(gutil.colors.red('Browserify编译错误:'), err.message);
			this.emit('end'); 							// 确保任务流结束，watch 模式可以继续
		})
		.pipe(source('bundle.js')) 						// 将输出转换为 vinyl 文件流，并指定文件名为 bundle.js
		.pipe(buffer()) 								// 将流转换为 buffer，以便后续的 Gulp 插件（如 uglify, sourcemaps）可以处理
		.pipe(sourcemaps.init({ loadMaps: true })) 		// 从 browserify 生成的源映射初始化 sourcemaps
		.pipe(sourcemaps.write('./')) 					// 将源映射写入到相同目录（./dist/）
		.pipe(gulp.dest("dist"));
}

gulp.task("default", bundle);

// 监听文件变化，变化时重新执行 bundle 任务
watchedBrowserify.on("update", bundle);
// 使用 gutil.log 来输出 watchify 的日志信息
watchedBrowserify.on("log", gutil.log);