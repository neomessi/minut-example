const Cookies = require('cookies')
const FileSync = require('lowdb/adapters/FileSync')
const http = require("http")
const low = require('lowdb')

const Bundler = require('./lib/bundler')
const Router = require('./lib/router')
const Security = require('./lib/security')

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
    // this.logger = function() { }

    this.initDb();

    this.initCurrentUserPromise = (cookies) => {
        const security = new Security(this.globals.mongodb, cookies);
        this.currentUserPromise = security.provideCurrentUser();
    }

    this.run = () => {
        const port = process.env.PORT || 9876
        const server = http.createServer( (req, res) => {
            
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

/*
const initMongoDb = () => {
    let mdb = null;

    MongoClient.connect(
        process.env.DB_CON_STR,
        {
            //useNewUrlParser: true,
            useUnifiedTopology: true,
        },
        async (err, client) => {
            // console.log("err: " + err);
            assert.equal(null, err);
            console.log("Connected successfully to server");

            const newUser = { touched: new Date() };
            mdb = client.db(process.env.DB_NAME);
            await mdb.collection("_permits").insertOne(newUser);
            client.close();

            // return  mdb;
    });

    // console.log( "mdb: " + typeof mdb)
    // return  mdb;
}
*/

/*
const testconnection = async() => {
    //test connection
    // const newUser = { touched: new Date() };
    const testdb = await initMongoDb();
    // console.log("testdb: " + typeof testdb)
    // await testdb.collection("_permits").insertOne(newUser);
}
*/