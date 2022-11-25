const path = require('path')
const webpack = require('webpack')

const CopyWebpackPlugin = require('copy-webpack-plugin')

const insertHtml = require('./insertHtml')

const {componentList, entryList} = require('./componentList.js')

module.exports = {
    mode: 'development',

    devtool: 'eval-cheap-module-source-map',

    // Настройка dev server
    devServer: {
        port: 8080,
        hot: true,
        static: ['./src', './dist'],
        compress: true
    },

    // HMR без этого не работает (?)
    target: 'web',

    // Регистрация entry points
    entry: entryList,

    // Подгрузка лоадеров (js и scss)
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(scss|sass)$/,
                use: [
                    {
                        loader: 'style-loader',
                        options: {
                            injectType: 'styleTag'
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            url: false,
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    [
                                        'autoprefixer',
                                        {
                                            // Options
                                        }
                                    ]
                                ]
                            }
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            },
            {
                test: /\.pug$/,
                use: [
                    {
                        loader: 'pug-loader'
                    }
                ]
            },
            {
                test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'assets/font/'
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg|webp)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'assets/img/',
                            esModule: false,
                            limit: false
                        }
                    }
                ]
            },
        ]
    },

    plugins:
    // Подключение pages
        insertHtml(componentList, 'dev', 'pug')
            .concat(
                // Копия assets без css папки
                new CopyWebpackPlugin({
                    patterns: [
                        {
                            from: 'src/assets', to: 'assets',
                            globOptions: {
                                ignore: ['**/css']
                            }
                        }
                    ]
                }),
                new webpack.ProvidePlugin({
                    $: 'jquery',
                    jQuery: 'jquery'
                }),
            )
}