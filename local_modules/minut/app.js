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

    const distDir = [rootDir, "gui/web/dist"].join('/');
    const htmlSrcDir = [rootDir, "gui/web/src/html"].join('/');

    this.globals = {
        ...{
            rootDir,
            htmlSrcDir,
            distDir,
            mongodb,
        },
        handleErrorResponse: function(errmsg, errpath, consumerResponse) {
            consumerResponse.body = fs.readFileSync([htmlSrcDir, "error.html"].join('/'), "utf8");
            consumerResponse.swapData("error", process.env.NODE_ENV !== 'production' ? errmsg : "Please try back later.");
            if ( /production/i.test(process.env.NODE_ENV) ) {
                mongodb.collection("errors").insertOne({
                    what: errmsg,
                    when: new Date(),
                    where: errpath,
                });
            }
            return consumerResponse.body;
        }
    };

    this.router = new Router(this.globals, routes),
    
    this.initDb = () => {
        var adapter = new FileSync(this.globals.rootDir + '/gui/web/dist/js/manifest.json')
        this.db = low(adapter);
        this.bundler = new Bundler(this.db);
    };

    this.initDb();

    this.initSecurity = (cookies) => {
        this.security = new Security(this.globals.mongodb, cookies);
    }

    this.run = () => {
        const port = process.env.PORT || 9876
        const server = https.createServer(options, (req, res) => {
            
            const cookies = new Cookies(req, res, { keys: [process.env.COOKIE_SIGNATURE_PHRASE] });
            this.initSecurity(cookies);

            if ( process.env.NODE_ENV !== 'production' ) {
                console.log('DEV mode: checking bundles @' + new Date().toString());
                this.initDb();
            }
            
            this.router.route(req, res, this.bundler, this.security);
        });

        server.listen(port, () => console.log(`Listening on port ${port}...`))
    }    

}