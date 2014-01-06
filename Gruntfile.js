module.exports = function(grunt) {
	"use strict";
	
	var bgSrc = ["src/background/*.ts"];
	
	grunt.initConfig({
		ts: {
			devBg: {
				src: bgSrc,
				out: "build/dev/background.js",
			},
			relaseBg: {
				src: bgSrc,
				out: "build/release/background.js"
			}
		}
	});
	
	grunt.loadNpmTasks("grunt-ts");
	grunt.registerTask("default", ["ts:devBg"]);
};