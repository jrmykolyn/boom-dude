// --------------------------------------------------
// IMPORT PLUGINS
// --------------------------------------------------
var ExtractTextPlugin = require( 'extract-text-webpack-plugin' );


// --------------------------------------------------
// CONFIG.
// --------------------------------------------------
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
                test: /\.(html)$/,
                loader: 'file-loader',
                query: {
                    name: '[name].[ext]'
                }
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract( {
                    use: 'css-loader!sass-loader',
                    fallback: 'style-loader'
                } )
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin( 'styles.css' )
    ]
}