const fs = require('fs');

const files = fs.readdirSync(__dirname);
const middleware_files = files.filter((f) => {
    return f !== 'index.js';
});

let model = {};

middleware_files.forEach(item => {
    const childModel = require('./' + item);
    model = Object.assign(model, childModel);
});

module.exports = model;