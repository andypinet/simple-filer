const path = require('path');

module.exports = {
    entry: './src/demo.js',
    output: {
        filename: 'bundle.next.js',
        path: path.resolve(__dirname, 'example/public/javascripts')
    }
};