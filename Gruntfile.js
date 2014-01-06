module.exports = function(grunt) {
	"use strict";
	
	var bgSrc = ["src/background/*.ts"];
	var popupSrc = ["src/popup/*.ts"];
	
	grunt.initConfig({
		ts: {
			options: {
				sourceMap: false,
				removeComments: true
			},
			background: {
				src: bgSrc,
				out: "build/background/background.js"
			},
			popup: {
				src: popupSrc,
				out: "build/popup/popup.js"
			}
		},
		copy: {
			all: {
				files: [
					{
						expand: true,
						src: ["manifest.json", "content/*", "pages/*", "popup/popup.html"],
						cwd: "src/",
						dest: "build/"
					},
					{
						expand: true,
						src: "images/*",
						dest: "build/"
					}
				]
			}
		}
	});
	
	grunt.loadNpmTasks("grunt-ts");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.registerTask("default", ["ts", "copy"]);
};