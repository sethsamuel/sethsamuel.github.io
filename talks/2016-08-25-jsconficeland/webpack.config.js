"use strict";
var webpack = require('webpack');
var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var _ = require('lodash');

const HOST = process.env.HOST || "0.0.0.0";
const PORT = process.env.PORT || "8888";

var pages = ['index', 'matrix', 'gradient', 'edgefinder', 'particles'];

var plugins = [];
if(process.env.NODE_ENV !== 'production') {
	plugins = plugins.concat([new webpack.NoErrorsPlugin(), new webpack.HotModuleReplacementPlugin()]);
}
plugins = plugins.concat(new CopyWebpackPlugin([{from: 'images/*'}]));
plugins = plugins.concat(_.map(pages, (page) => {
		return new HtmlWebpackPlugin({
			chunks: [`${page}`],
			template: `${page}.pug`,
			filename: `${page}.html`
		});
	})
);


function entryPoint(entry) {
	return ((process.env.NODE_ENV !== 'production') ? [
		`webpack-dev-server/client?http://${HOST}:${PORT}`, // WebpackDevServer host and port
		`webpack/hot/only-dev-server`
		] : [])
		.concat([`./js/${entry}.js`]);
}

module.exports = {
	entry: _.zipObject(pages, _.map(pages, entryPoint)),

	devtool: process.env.WEBPACK_DEVTOOL || 'source-map',
	output: {
		path: path.join(__dirname, 'public'),
		filename: '[name].js'
	},
	resolve: {
		extensions: ['', '.js']
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				loaders: ['babel']
			},
			{
				test: /\.pug$/,
				exclude: /node_modules/,
				loader: 'pug-html-loader'
			},
			{
				test: /\.css$/,
				loader: 'style-loader!css-loader'
			},
			{
				test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
				loader: "file"
			},
			{
				test: /\.(woff|woff2)$/,
				loader: "url?prefix=font/&limit=5000"
			},
			{
				test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
				loader: "url?limit=10000&mimetype=application/octet-stream"
			},
			{
				test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
				loader: "url?limit=10000&mimetype=image/svg+xml"
			},
		]
	},
	devServer: {
		contentBase: "./public",
		noInfo: true, //  --no-info option
		hot: true,
		inline: true,
		port: PORT,
		host: HOST,
		headers: {Pragma: 'no-cache', Expires: 0, 'Cache-Control': 'no-cache, no-store, must-revalidate'}
		},
	plugins
};