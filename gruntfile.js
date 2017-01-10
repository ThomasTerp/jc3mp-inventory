const path = require('path');


module.exports = function(grunt)
{
	grunt.initConfig({
		webpack: {
			server: {
				entry: './ts/main.ts',
				output: {
					filename: 'main.js'
				},
				resolve: {
					extensions: [
						'',
						'.webpack.js',
						'.web.js',
						'.ts',
						'.tsx',
						'.js'
					]
				},
				module: {
					loaders: [
						{
							test: /\.tsx?$/,
							loader: 'ts-loader'
						}
					]
				}
			},
			client: {
				context: __dirname + "/client_package",
				entry: './ts/main.ts',
				output: {
					path: "client_package",
					filename: 'main.js'
				},
				resolve: {
					root: __dirname + "/client_package",
					extensions: [
						'',
						'.webpack.js',
						'.web.js',
						'.ts',
						'.tsx',
						'.js'
					]
				},
				module: {
					loaders: [
						{
							test: /\.tsx?$/,
							loader: 'ts-loader'
						}
					]
				}
			},
			ui: {
				context: __dirname + "/client_package/ui",
				entry: './ts/main.ts',
				output: {
					path: "client_package/ui/js",
					filename: 'index.js'
				},
				resolve: {
					root: __dirname + "/client_package/ui",
					extensions: [
						'',
						'.webpack.js',
						'.web.js',
						'.ts',
						'.tsx',
						'.js'
					]
				},
				module: {
					loaders: [
						{
							test: /\.tsx?$/,
							loader: 'ts-loader'
						}
					]
				}
			}
		}
	});
	
	grunt.loadNpmTasks('grunt-webpack');
	
	grunt.registerTask("default", [
		"webpack:server",
		"webpack:client",
		"webpack:ui"
	]);
	grunt.registerTask("server", [
		"webpack:server"
	]);
	grunt.registerTask("client", [
		"webpack:client"
	]);
	grunt.registerTask("ui", [
		"webpack:ui"
	]);
};
