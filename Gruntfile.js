module.exports = function(grunt) {
	"use strict";
	
	var bgSrc = ["src/background/*.ts"];
	var popupSrc = ["src/popup/*.ts"];
	
	grunt.initConfig({
		ts: {
			bg: {
				src: bgSrc,
				out: "<%= buildDir %>/background/background.js",
			},
			popup: {
				src: popupSrc,
				out: "<%= buildDir %>/popup/popup.js"
			}
		},
		copy: {
			all: {
				files: [
					{
						expand: true,
						src: ["manifest.json", "content/*", "pages/*", "popup/popup.html"],
						cwd: "src/",
						dest: "<%= buildDir %>/"
					},
					{
						expand: true,
						src: "images/*",
						dest: "<%= buildDir %>/"
					}
				]
			}
		}
	});
	
	grunt.loadNpmTasks("grunt-ts");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.registerTask("default", ["dev"]);
	
	function runAllTasks() {
		grunt.task.run(["ts:bg", "ts:popup", "copy:all"]);
	}
	
	grunt.registerTask('dev', 'Build dev', function() {
		grunt.config("buildDir", "build/dev");
		runAllTasks();
	});
	grunt.registerTask('release', 'Build dev', function() {
		grunt.config("buildDir", "build/release");
		runAllTasks();
	});
};