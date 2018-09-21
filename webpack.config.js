var webpack = require('webpack');
var path = require('path');

var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var ROOT_PATH = path.resolve(__dirname);
var ENTRY_PATH = path.resolve(ROOT_PATH, 'src/js/index');
var TEMPLATE_PATH = path.resolve(ROOT_PATH, 'src/index.html');
var SHADER_PATH = path.resolve(ROOT_PATH, 'src/shaders');
var BUILD_PATH = path.resolve(ROOT_PATH, 'build');

var config = {
    entry: ENTRY_PATH,
    devtool: 'source-map',
    plugins: [
        new CopyWebpackPlugin([
            {
                from: './src/images',
                to: './images'
            }
        ]),
        new HtmlWebpackPlugin({
            inject: 'body',
            template: TEMPLATE_PATH
        }),
        new ExtractTextPlugin('css/styles.css'),
        new OpenBrowserPlugin({
            url: 'http://localhost:8080/'
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    output: {
        path: BUILD_PATH,
        filename: 'bundle.js',
        publicPath: '/'
    },
    devServer: {
        historyApiFallback: true
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
                    presets: ['babel-preset-env', 'babel-preset-react', 'babel-preset-stage-2']
                }
            },
            {
                test: /\.jsx?/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.css?$/,
                use: ExtractTextPlugin.extract({
                    use: 'css-loader'
                })
            },
            {
                test: /\.glsl$/,
                exclude: /node_modules/,
                loader: 'webpack-glsl-loader'
            },
            {
                test: /\.png$/,
                exclude: /node_modules/,
                loader: 'file-loader?name=images/[name].[ext]'
            }
        ]
    }
};

module.exports = config;
