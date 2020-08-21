const http = require("http");
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const Bundler = require('./lib/bundler')
const Router = require('./lib/router')

function App (rootDir, routes) {
    this.globals = {
        rootDir: rootDir,
        htmlSrcDir: [rootDir, "gui/web/src/html"].join('/'),
        distDir: [rootDir, "gui/web/dist"].join('/'),
    };
    
    this.router = new Router(this.globals, routes),
    
    this.initDb = () => {
        var adapter = new FileSync(this.globals.rootDir + '/gui/web/dist/js/manifest.json')
        this.db = low(adapter);
        this.bundler = new Bundler(this.db);
    };
    // this.logger = function() { }
}

module.exports = (rootDir, mode, routes) => {
    const app = new App(rootDir, routes);
    app.initDb();
    
    const port = process.env.PORT || 9876
    const server = http.createServer((req, res) => {

        if ( mode && mode == 'dev') {
            console.log('DEV mode: checking bundles @' + new Date().toString());
            app.initDb();
        }    
        // const routeDir = [rootDir, "ctrl"].join('/');

        // autoSwapBundle() - bundle key same as file path
        // autoSwapVars() - swap ~`data:x`~ with queryparams
        // look for additional bundles, file swaps, vars
    
        app.router.route(app.bundler, req, res);
    });

    server.listen(port, () => console.log(`Listening on port ${port}...`))
}

// app.logger = () { if ( dev || !suppressOutput ) }