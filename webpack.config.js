const path = require('path');
module.exports = {
    mode: 'development',
    entry: {
        script: './src/script.js',
        chords: './src/chords.js',
        progressions: './src/progressions.js',
     //   scales: './src/scales.js'
    },
    devServer: {
        contentBase: './dist'
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
}