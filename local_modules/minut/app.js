const http = require("http");
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const Bundler = require('./lib/bundler')
const Router = require('./lib/router')

module.exports = function(rootDir, routes) {
    
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

    this.initDb();
    
    this.run = (mode) => {
        const port = process.env.PORT || 9876
        const server = http.createServer( (req, res) => {

            if ( mode && mode == 'dev') {
                console.log('DEV mode: checking bundles @' + new Date().toString());
                this.initDb();
            }           
            
            this.router.route(this.bundler, req, res);            
        });

        server.listen(port, () => console.log(`Listening on port ${port}...`))
    }
}

// this.logger = () { if ( dev || !suppressOutput ) }
