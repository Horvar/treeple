const path = require('path')
const webpack = require('webpack')

const CopyWebpackPlugin = require('copy-webpack-plugin')

const inserterHtml = require('./inserterHtml')

const pages = ['index']

module.exports = {
    // Регистрация entry points
    entry: {
        index: path.resolve(__dirname, './src/pages/index/index.js')
    },
    
    mode: 'development',

    devtool: 'eval-cheap-module-source-map',

    // Настройка dev server
    devServer: {
        static: ['./src', './dist'],
        port: 8080,
        hot: true
    },

    // HMR без этого не работает (?)
    target: 'web',

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
        inserterHtml(pages, 'dev', 'pug')
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