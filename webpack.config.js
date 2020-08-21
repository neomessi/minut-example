const path = require('path');
// const WebpackShellPlugin = require('webpack-shell-plugin');
const ManifestPlugin = require('webpack-manifest-plugin')
const NotifierPlugin = require('webpack-notifier');
const { NONAME } = require('dns');

const path2jsSrc = path.join(__dirname, 'gui/web/src/script');
const path2jsDist = path.join(__dirname, 'gui/web/dist/js');

module.exports = {
  mode: 'none', // ~*~
  entry: {
    //    main: './src/index.js',
    start: path.join(path2jsSrc, 'start.js'),
    //   test: './src/test.js',
    tstest: path.join(path2jsSrc, 'tstest.ts'),
  },
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
      }
    ]
  },
  plugins: [
    new ManifestPlugin(),
    new NotifierPlugin(),
    // new WebpackShellPlugin({ onBuildEnd: ['node webpack-post-build.js manifest.json'] })
  ]
};