var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');

var ROOT_PATH = path.resolve(__dirname);
var ENTRY_PATH = path.resolve(ROOT_PATH, 'src/js/index');
var APP_PATH = path.resolve(__dirname, 'src');
var SRC_PATH = path.resolve(ROOT_PATH, 'src');
var JS_PATH = path.resolve(ROOT_PATH, 'src/js');
var TEMPLATE_PATH = path.resolve(ROOT_PATH, 'src/index.html');
var SHADER_PATH = path.resolve(ROOT_PATH, 'src/shaders');
var BUILD_PATH = path.resolve(ROOT_PATH, 'build');

var config = {
    entry: ENTRY_PATH,
    plugins: [
        new HtmlWebpackPlugin({
            inject: 'body',
            template: TEMPLATE_PATH
        }),
        new OpenBrowserPlugin({
            url: 'http://localhost:8080/'
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    output: {
        path: BUILD_PATH,
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['.js', '.jsx', '.glsl']
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    cacheDirectory: true,
                    presets: ['es2015']
                }
            },
            {
                test: /\.jsx?/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.glsl$/,
                exclude: /node_modules/,
                loader: 'webpack-glsl-loader'
            }
        ]
    }
};

module.exports = config;
