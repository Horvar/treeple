const HtmlWebpackPlugin = require('html-webpack-plugin')

const htmlTemplate = (name, mode, preprocessor) => {
    let inserter = preprocessor ? preprocessor : 'html'

    return new HtmlWebpackPlugin({
        template: `./src/pages/${name}/tmpl.${inserter}`,
        inject: true,
        chunks: [`${name}`],
        filename: name === 'index' || mode === 'prod' ? `${name}.html` : `${name}`,
        minify: mode !== 'dev'
    })
}

function inserterHtml(pages = [], mode ='', preprocessor ='') {
    const res = []

    pages.forEach(page => {
        res.push(htmlTemplate(page, mode, preprocessor))
    })

    return res
}

module.exports = inserterHtml
