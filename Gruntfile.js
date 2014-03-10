module.exports = function(grunt) {
	"use strict";

	var bgSrc = ["src/background/*.ts"];
	var popupSrc = ["src/popup/*.ts"];
	var optionSrc = ["src/options/*.ts"];

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
			},
            option: {
                src: optionSrc,
                out: "build/options/options.js"
            }
		},
		copy: {
			all: {
				files: [
					{
						expand: true,
						src: ["manifest.json", "content/*", "pages/*", "popup/popup.html", "options/options.html"],
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
