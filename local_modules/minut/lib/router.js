const fs = require('fs')
const utils = require('./utils')
const consumer = require('./consumer')

module.exports = function( globals, routes ) {
    this.globals = globals;
    this.routes = routes,

    this.route = (bundler, req, res) => {

        const [ fpath, qmap ] = utils.parseRequest(req);
        const request = new consumer.Request('GET', qmap); // ~*~ set request method

        let ifound = -1;
        this.routes.some( (r, i ) => {
            if ( r.url === fpath) {
                ifound = i;
                return true;
            }
        });

        let resource = fpath;
        if ( ifound >= 0 ) {
            resource = this.routes[ifound].page;
        }

        const resourceExt = resource.split('.').pop();

        // html files don't have static dist - they are generated dynamically
        const resourceDir = resourceExt === 'html' ? this.globals.htmlSrcDir : this.globals.distDir;

        // response
        const encoding = resourceExt === 'html' ? 'utf8' : null; // need utf8 for string matching (data swapping)

        try {
            const data = fs.readFileSync([resourceDir, resource].join('/'), encoding);

            let subdata = resourceExt === 'html' ? bundler.autoSwapBundles(data) : data;

            subdata = ifound >= 0 && this.routes[ifound].handler ? this.routes[ifound].handler( {...request, ...new consumer.Response(subdata)} ) : subdata;

            res.writeHead(200, getHeaderData(resourceExt)).end(subdata);

        }catch (e) {
            res.writeHead(404).end();
        }
    }
}

const getHeaderData = (ext) => {
    const eternity = 31536000;
    let hd = {};
    
    //~*~ isApi?
    switch (ext) {
        case 'css':
            // note when dev tools open, bootstrap will make an extra request to bootstrap.min.css.map (won't show in network tab)
            hd = { 'Content-Type': 'text/css', 'Cache-Control': 'max-age=' + eternity }
            break;

        case 'js':
            hd = {'Content-Type': 'text/javascript', 'Cache-Control': 'max-age=' + eternity }
            break;            

        case 'html':
            hd = { 'Content-Type': 'text/html' }
            break;

        // should set cache for images? (favicon.ico, etc)
        
    }
    return hd;
}
