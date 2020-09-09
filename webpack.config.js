const path = require('path');
// const WebpackShellPlugin = require('webpack-shell-plugin');
const ManifestPlugin = require('webpack-manifest-plugin')
const NotifierPlugin = require('webpack-notifier');
const { NONAME } = require('dns');

const path2jsSrc = path.join(__dirname, 'gui/web/src/script');
const path2jsDist = path.join(__dirname, 'gui/web/dist/js');
const path2fwUI = path.join(__dirname, 'local_modules/minut/lib/ui'); // ~*~ will change

module.exports = {
  mode: 'none', // ~*~
  entry: {
    //    main: './src/index.js',
    start: path.join(path2jsSrc, 'start.js'),
    //   test: './src/test.js',
    tstest: path.join(path2jsSrc, 'tstest.ts'),

    // framewwork
    autoComponentRenderer: path.join(path2fwUI, 'autoComponentRenderer.js'),
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
    // new WebpackShellPlugin({ onBuildEnd: ['node webpack-post-build.js manifest.json'] })
  ]
};