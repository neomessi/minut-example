const path = require('path');
const WebpackConfigurator = require('./local_modules/minut/lib/ui/webpackConfigurator')  // ~*~ will change to node_modules

const path2jsSrc = path.join(__dirname, 'gui/web/src/script');

/*
Components in:
  gui/web/src/script/components/autoImported
  
Are added to _every_ bundle defined here.
This is for convenience for components you use all the time don't have to manually import
   Don't put too many components in there though, that will increase your bundle sizes
*/

module.exports = new WebpackConfigurator({
  autoImportsOnlyRenderer: path.join(path2jsSrc, 'autoImportsOnlyRenderer.js'),
  //    main: './src/index.js',
  start: path.join(path2jsSrc, 'start.js'),
  //   test: './src/test.js',
  squareRenderer: path.join(path2jsSrc, 'squareRenderer.js'),
  tstest: path.join(path2jsSrc, 'tstest.ts'),  
});