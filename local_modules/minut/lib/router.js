const fs = require('fs')
//?? const { serialize } = require('v8');

const consumer = require('./consumer');
const utils = require('./utils')

module.exports = function( globals, routes ) {
    this.globals = globals;
    this.routes = routes,

    this.route = (req, res, bundler, security) => {

        const [ fpath, qmap ] = utils.parseRequest(req);        

        const formDataPromise = utils.parseForm(req);
        
        // check route existence
        let ifound = -1;
        this.routes.some( (r, i ) => {
            if ( r.url === fpath) {
                ifound = i;
                return true;
            }
        });

        // API route - return data/handle form post return result
        if ( fpath.split("/")[1].match(/^api$/) ) {
            
            if ( ifound == -1 ) {
                res.writeHead(404).end();
                // return
            }

            // ~*~ apiRouter.route()
            const data = this.routes[ifound].handler(); // ~*~ pass args, guard

            res.writeHead(200, { 'Content-Type': 'application/json' }).end( data );            
            return;
        }

        // continue with regular route
        const request = new consumer.Request( req.method, qmap, {} );

        let resource = fpath;
        if ( ifound >= 0 ) {
            resource = this.routes[ifound].page;
        }

        const resourceExt = resource.split('.').pop();
        const isHtml = /html/.test(resourceExt);

        let resourceDir = this.globals.distDir;
        if ( isHtml ) {
            resourceDir = ifound >= 0 ? this.globals.htmlSrcDir : this.globals.distDir + '/html';
        }

        // response
        const encoding = isHtml ? 'utf8' : null; // need utf8 for string matching (data swapping)

        try {
            const data = fs.readFileSync([resourceDir, resource].join('/'), encoding);
            
            let subdata = isHtml ? bundler.autoSwapBundles(data) : data;

            if ( ifound >= 0 ) {
                const response = new consumer.Response(subdata);                


                // ~*~ from here on could be baseRouter
                let currentUserPermitId = 0;
                
                // finish route in current user context
                security.provideCurrentUser()
                    .then( currentUser => {
                        console.log(currentUser);

                        currentUserPermitId = currentUser.permitId;                        
                        const cuinfo = currentUser.info ? currentUser.info : {};
                        
                        // check guards
                        if ( this.routes[ifound].guard ) {
                            const [allow, redir] = this.routes[ifound].guard(cuinfo, currentUser.userName);
                            if ( !allow ) {
                                if ( redir) {
                                    res.writeHead(302, { Location: redir } ).end();
                                }
                                res.writeHead(403).end();    
                            }
                        }

                        const cnsmr = {
                            ...request,
                            ...response,
                            currentUserInfo: { ...cuinfo },
                            currentUserName: currentUser.userName,
                            security: {...security.consumerFuncs}
                        };
                        
                        // ~*~ for api routes: json = this.routes[ifound].handler( cnsmr, this.globals.mongodb )

                        if ( req.method === 'POST') {
                            formDataPromise                            
                                .then( (formdata) => { // avoided "pyramid of doom", but have to take just one step of doom
                                    request.params.form = formdata;
                                    // ~*~ csrf check (npm)                                

                                    // if no handler will be caught and return 500 (should have handler defined for POST)
                                    const p = this.routes[ifound].handler( cnsmr, this.globals.mongodb );

                                    Promise.resolve(p).then(() => {
                                        if ( cnsmr.nextUrl ) { // maybe for GETs as well?
                                            res.writeHead(302, { Location: cnsmr.nextUrl } ).end();
                                        }
                                        else {
                                            res.writeHead(302, { Location: fpath } ).end();
                                        }

                                    });

                                });
                        }
                        // GET
                        else {
                            const p = this.routes[ifound].handler ? this.routes[ifound].handler( cnsmr, this.globals.mongodb ) : null;
                            // have to wait even though handlers don't return anything in case handler function is await-ing anything
                            Promise.resolve(p).finally(()=> {        
                                var errmsg = getSomethingUnswappedError(response.body);                                
                                if ( errmsg ) {
                                    res.writeHead(500).end(errmsg);
                                }
                                res.writeHead(200, getHeaderData(resourceExt)).end( response.body );
                            });
                        }

                    }).catch(msg => {
                        console.log(msg);
                        res.writeHead(500).end();
                    });
            }
            else {
                // no route found, just returns data. If html file, will have already run autoSwapBundles
                if ( isHtml ) {
                    var errmsg = getSomethingUnswappedError(subdata);
                    if ( errmsg ) {
                        res.writeHead(500).end(errmsg);
                    }
                }
                res.writeHead(200, getHeaderData(resourceExt)).end(subdata);
            }

        }catch (e) {
            // fs.readFileSync exception
            res.writeHead(404).end();
        }
    }
}

const getHeaderData = (ext) => {
    const eternity = 31536000;
    let hd = {};

    switch (ext) {
        case 'css':
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

const getSomethingUnswappedError = (body) => {
    var a = /~`(bundle|data):(\w+)/.exec(body);
    if ( a ) {
        switch (a[1]) {
            case "bundle":
                return `Bundle "${a[2]}" could not be swapped out. You may need to add it to webpack.config.js.`;
            case "data":
                return `Data "${a[2]}" could not be swapped out. Your handler may need to be updated.`;
        }
    }
    return "";
}
