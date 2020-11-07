const path = require('path');
const WebpackConfigurator = require('./local_modules/minut/lib/ui/webpackConfigurator')  // ~*~ will change to node_modules

const path2jsSrc = path.join(__dirname, 'gui/web/src/script');

module.exports = new WebpackConfigurator({
  //    main: './src/index.js',
  start: path.join(path2jsSrc, 'start.js'),
  //   test: './src/test.js',
  tstest: path.join(path2jsSrc, 'tstest.ts'), 
});