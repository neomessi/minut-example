const Cookies = require('cookies')
const FileSync = require('lowdb/adapters/FileSync')
const fs = require('fs');
const https = require("https")
const low = require('lowdb')

const Bundler = require('./lib/bundler')
const Router = require('./lib/router')
const Security = require('./lib/security')

const options = {
    key: fs.readFileSync('localserver.key'),
    cert: fs.readFileSync('localserver.cert')
  };

module.exports = function(rootDir, routes, mongodb) {

    this.globals = {
        rootDir: rootDir,
        htmlSrcDir: [rootDir, "gui/web/src/html"].join('/'),
        distDir: [rootDir, "gui/web/dist"].join('/'),
        mongodb: mongodb,
        getCurrentUserPromise: () => this.currentUserPromise,
    };
    
    this.router = new Router(this.globals, routes),
    
    this.initDb = () => {
        var adapter = new FileSync(this.globals.rootDir + '/gui/web/dist/js/manifest.json')
        this.db = low(adapter);
        this.bundler = new Bundler(this.db);
    };

    this.initDb();

    this.initCurrentUserPromise = (cookies) => {
        const security = new Security(this.globals.mongodb, cookies);
        this.currentUserPromise = security.provideCurrentUser();
    }

    this.run = () => {
        const port = process.env.PORT || 9876
        const server = https.createServer(options, (req, res) => {
            
            const cookies = new Cookies(req, res, { keys: [process.env.COOKIE_SIGNATURE_PHRASE] });
            this.initCurrentUserPromise(cookies);

            if ( process.env.NODE_ENV !== 'production' ) {
                console.log('DEV mode: checking bundles @' + new Date().toString());
                this.initDb();
            }
            
            this.router.route(this.bundler, req, res);
        });

        server.listen(port, () => console.log(`Listening on port ${port}...`))
    }    

}

// this.logger = () { if ( dev || !suppressOutput ) }
