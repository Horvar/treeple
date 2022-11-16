const path = require('path')
const webpack = require('webpack')

const CopyWebpackPlugin = require('copy-webpack-plugin')
const {CleanWebpackPlugin} = require("clean-webpack-plugin")
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const insertHtml = require('./insertHtml')

const componentList = ['index']

const entryList = componentList.reduce((entries, componentName) => {
    entries[componentName] = path.join(__dirname, `./src/pages/${componentName}/index.js`);
    return entries;
}, {});

module.exports = {
    // Регистрация entry points
    entry: entryList,

    // Объявление output
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].bundle.js'
    },

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
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            },
            {
                test: /\.(scss|sass)$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
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
        insertHtml(componentList, 'prod', 'pug')
            .concat(
                // Копия assets без css папки
                new CopyWebpackPlugin({
                    patterns: [
                        {
                            from: 'src/assets', to: 'assets',
                            globOptions: {
                                ignore: ['**/css', '**/js']
                            }
                        }
                    ]
                }),
                new webpack.ProvidePlugin({
                    $: 'jquery',
                    jQuery: 'jquery'
                }),
                // Очистка dist после каждого build
                new CleanWebpackPlugin(),
                // Разбиение и выноска CSS по отдельным файлам
                new MiniCssExtractPlugin()
            )

}