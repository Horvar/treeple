const path = require('path')

const componentList = [
    'index',
    'tour-detail'
]

const entryList = componentList.reduce((entries, componentName) => {
    entries[componentName] = path.join(__dirname, `./src/pages/${componentName}/index.js`);
    return entries;
}, {});

module.exports = {componentList, entryList};