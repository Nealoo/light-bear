const path = require("path");
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: "development",
    entry: {
        "js/bundle" : "./src/js/index.js"
    },
    output: {
        path: path.resolve(__dirname, "public"),
        filename: "[name].js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["babel-preset-env"]
                    }
                }
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                  // fallback to style-loader in development
                //   process.env.NODE_ENV !== 'production'
                //     ? 'style-loader'
                //     : MiniCssExtractPlugin.loader,
                MiniCssExtractPlugin.loader,
                //   'style-loader',
                  'css-loader',
                  'sass-loader',
                ],
            },
            {
                test: /\.css$/i,
                use: [
                    'style-loader',
                    'css-loader',
                ],
            },
            {
                test: /\.handlebars$/,
                loader: 'handlebars-loader',
                options: {
                    runtime: path.resolve(__dirname, 'src/js/handlebars-helpers.js'),
                    precompileOptions: {
                        knownHelpersOnly: false,
                    },
                }
            },
        ]
    },
    plugins: [
        new BrowserSyncPlugin({
          // browse to http://localhost:3000/ during development,
          // ./public directory is being served
          host: 'localhost',
          port: 3000,
          server: { baseDir: ['.'] }
        }),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: '[name].css',
            chunkFilename: '[id].css',
          }),
    ],
    resolve: {
        alias: {
            handlebars: path.resolve(__dirname, 'node_modules/handlebars'),
            'fs': path.resolve(__dirname, 'node_modules/file-system/file-system.js'),
            'readline': path.resolve(__dirname, 'node_modules/log-utils/index.js'),
        },
    },
};