var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    devServer: {
        port: 8080
    },
    devtool: "source-map",
    output: {
        filename: 'bundle.js',
        publicPath: '/'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            filename: "./index.html"
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    "babel-loader"
                ]
            },
            {
                test: /\.html$/,
                use: [
                    "html-loader"
                ]
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.glsl$/,
                use: [
                    'webpack-glsl-loader'
                ]
            },
            {
                test: /\.ply$/,
                use: [
                    'raw-loader'
                ]
            },
            {
                test: /\.obj$/,
                use: [
                    'raw-loader'
                ]
            }
        ]
    }
};
