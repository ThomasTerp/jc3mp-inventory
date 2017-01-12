const path = require("path");


module.exports = function(grunt)
{
	grunt.initConfig({
		ts: {
			server: {
				src: [
					"src/**/*.ts"
				],
				options: {
					failOnTypeErrors: false,
					sourceMap: false,
				},
				outDir: "./"
			}
		},
		webpack: {
			client: {
				context: __dirname + "/client_package",
				entry: "./src/main.ts",
				output: {
					path: "client_package",
					filename: "main.js"
				},
				resolve: {
					root: __dirname + "/client_package",
					extensions: [
						"",
						".webpack.js",
						".web.js",
						".ts",
						".tsx",
						".js"
					]
				},
				module: {
					loaders: [
						{
							test: /\.tsx?$/,
							loader: "ts-loader"
						}
					]
				}
			},
			ui: {
				context: __dirname + "/client_package/ui",
				entry: "./src/main.ts",
				output: {
					path: "client_package/ui/scripts",
					filename: "index.js"
				},
				resolve: {
					root: __dirname + "/client_package/ui",
					extensions: [
						"",
						".webpack.js",
						".web.js",
						".ts",
						".tsx",
						".js"
					]
				},
				module: {
					loaders: [
						{
							test: /\.tsx?$/,
							loader: "ts-loader"
						}
					]
				}
			}
		}
	});
	
	grunt.loadNpmTasks("grunt-ts");
	grunt.loadNpmTasks("grunt-webpack");
	
	grunt.registerTask("default", [
		"ts:server",
		"webpack:client",
		"webpack:ui"
	]);
	grunt.registerTask("server", [
		"ts:server"
	]);
	grunt.registerTask("client", [
		"webpack:client"
	]);
	grunt.registerTask("ui", [
		"webpack:ui"
	]);
};
