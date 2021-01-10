const path = require('path');
module.exports = {
    mode: 'development',
    entry: {
        script: './src/script.js',
        chords: './src/chords.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
}