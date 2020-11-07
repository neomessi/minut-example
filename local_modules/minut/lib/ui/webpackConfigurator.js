const path = require('path');
const ManifestPlugin = require('webpack-manifest-plugin')
const NotifierPlugin = require('webpack-notifier');
// const { NONAME } = require('dns');  //~*~?

const path2jsDist = path.join(__dirname, '../../../../gui/web/dist/js');

module.exports = function( entries ) {

    const allEntries = { ...entries, autoComponentRenderer: path.join(__dirname, './autoComponentRenderer.js') };

    return {
    mode: 'none', // ~*~
    entry: allEntries,
    output: {
        filename: '[name].[chunkhash].js',
        path: path2jsDist,
    },
    module: {
        rules: [
        {
            test: /\.ts$/,
            exclude: /(node_modules)/,
            use: {
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-typescript'],
                // plugins: ['@babel/plugin-proposal-object-rest-spread']
            }
            }
        },
        {
            test: /\.jsx?$/, // ~*~ not all js, just Renderers?
            exclude: /(node_modules)/,
            use: {
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-react'],
                plugins: ["wildcard"],
                // plugins: ['@babel/plugin-proposal-object-rest-spread']
                // ?~*~ @babel/core
            }
            }
        },
        ]
    },
    plugins: [
        new ManifestPlugin(),
        new NotifierPlugin(), 
    ]
    };

}