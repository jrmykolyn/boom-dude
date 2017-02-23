module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: './dist/',
        publicPath: './dist/'
    },
    module: {
        loaders: [
            {
                test: '/\.js$/',
                loader: 'file-loader'
            },
            {
                test: /\.(html|css)$/,
                loader: 'file-loader',
                query: {
                    name: '[name].[ext]'
                }
            }
        ]
    },
    plugins: []
}