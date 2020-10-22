const fs = require('fs')
const utils = require('./utils')
const consumer = require('./consumer')

const ObjectId = require('mongodb').ObjectId; // ~*~NOT here

module.exports = function( globals, routes ) {
    this.globals = globals;
    this.routes = routes,

    this.route = (bundler, req, res) => {

        const [ fpath, qmap ] = utils.parseRequest(req);

        // ~*~ if /api route, skip all this

        const formDataPromise = utils.parseForm(req);
        
        const request = new consumer.Request( req.method, qmap, {} );

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

        let resourceDir = this.globals.distDir;
        if ( resourceExt === 'html' ) {
            resourceDir = ifound >= 0 ? this.globals.htmlSrcDir : this.globals.distDir + '/html';
        }

        // response
        const encoding = resourceExt === 'html' ? 'utf8' : null; // need utf8 for string matching (data swapping)

        try {
            const data = fs.readFileSync([resourceDir, resource].join('/'), encoding);

            let subdata = resourceExt === 'html' ? bundler.autoSwapBundles(data) : data;

            if ( ifound >= 0 ) {
                const response = new consumer.Response(subdata);
                let currentUserCurPermitId = 0;

                // finish route in current user context
                this.globals.getCurrentUserPromise()
                    .then( currentUser => {
                        currentUserCurPermitId = currentUser.curPermitId;
                        const cuinfo = currentUser.info ? currentUser.info : {};
                        return cuinfo;
                    }).then ( cuinfo => {

                        // check guards
                        if ( this.routes[ifound].guard ) {
                            const [allow, redir] = this.routes[ifound].guard(cuinfo);
                            if ( !allow ) {
                                if ( redir) {
                                    res.writeHead(302, { Location: redir } ).end();
                                }
                                res.writeHead(403).end();    
                            }
                        }

                        if ( req.method === 'POST') {

                         formDataPromise
                            // avoided "pyramid of doom", but have to take just one step of doom
                            .then( (formdata) => {                            
                                
                                request.params.form = formdata;

                                // ~*~ if no handler - "Wait a minut... no handler defined for POST"
                                const cnsmr = {...request, ...response, currentUserInfo: { ...cuinfo } };
                                
                                // const cnsmrcopy = { ...cnsmr }; ~*~ use lodash.isequal to conditionally update
                                
                                this.routes[ifound].handler( cnsmr, this.globals.mongodb )
                                                                
                                this.globals.mongodb.collection("users").updateOne(
                                    { curPermitId: ObjectId(currentUserCurPermitId) },
                                    { $set: { "info" : cnsmr.currentUserInfo } }
                                ).then( result => {                                    
                                    // if ( result.matchedCount === 1 && result.modifiedCount === 1 ) {
                                    //     console.log("update success!");                                        
                                    // }else{
                                    //     console.log("update FAILED!"); // ~*~throw
                                    // }

                                    if ( cnsmr.nextUrl ) {
                                        res.writeHead(302, { Location: cnsmr.nextUrl } ).end();
                                    }
                                    else {
                                        res.writeHead(302, { Location: fpath } ).end();
                                    }

                                /*
                                this.routes[ifound].handler( {...request, ...response, currentUserInfo: { ...cuinfo } }, this.globals.mongodb )
                                    .then( result => {
                                        console.log(result);                                        
                                        // modifiedCount: 1,
                                        // upsertedId: null,
                                        // upsertedCount: 0,
                                        // matchedCount: 1
                                        subdata = response.body;
                                        res.writeHead(200, getHeaderData(resourceExt)).end(subdata);
                                    })
                                */
                                });
                            });

                        }
                        else {
                            this.routes[ifound].handler ? this.routes[ifound].handler( {...request, ...response, currentUserInfo: { ...cuinfo } } ) : subdata;
                            subdata = response.body;
                            res.writeHead(200, getHeaderData(resourceExt)).end(subdata);

                        }
                        
                    }).catch(e => {
                        console.log(e);
                    }); // catch 500                   

            }
            else {
                res.writeHead(200, getHeaderData(resourceExt)).end(subdata);
            }

        }catch (e) {
            console.log(e);
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
