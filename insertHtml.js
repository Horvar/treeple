const HtmlWebpackPlugin = require('html-webpack-plugin')

const htmlTemplate = (name, mode, preprocessor) => {
    let ext = preprocessor ? preprocessor : 'html'

    return new HtmlWebpackPlugin({
        template: `./src/pages/${name}/tmpl.${ext}`,
        inject: true,
        chunks: [`${name}`],
        filename: name === 'index' || mode === 'prod' ? `${name}.html` : `${name}.html`,
        minify: mode !== 'dev'
    })
}

function insertHtml(pages = [], mode ='', preprocessor ='') {
    const res = []

    pages.forEach(page => {
        res.push(htmlTemplate(page, mode, preprocessor))
    })

    return res
}

module.exports = insertHtml