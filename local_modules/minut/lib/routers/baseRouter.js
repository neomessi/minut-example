/**
 * 
 */

 const utils = require('../utils');

module.exports = function (
    getHeaderData,
    res,
    route,
    globals,
    fpath,
    security,
    formDataPromise,
    consumerRequest,
    consumerResponse,
    ) {

    let currentUserPermitId = 0;
                
    // finish route in current user context
    security.provideCurrentUser()
        .then( currentUser => {
            console.log(currentUser);

            currentUserPermitId = currentUser.permitId;                        
            const cuinfo = currentUser.info ? currentUser.info : {};
            
            const cnsmr = {
                currentUserInfo: { ...cuinfo },
                currentUserName: currentUser.userName,
                request: { ...consumerRequest },
                response: { ...consumerResponse },
                security: {...security.consumerFuncs},
                utils: {...utils.consumerFuncs}
            };


            // check guards
            if ( route.guard ) {
                const { requirement, redirect } = route.guard(cnsmr, globals.mongodb);
                if ( !requirement ) {
                    if ( redirect ) {
                        res.writeHead(302, { Location: redirect } ).end();
                    }
                    res.writeHead(403).end();    
                }
            }

            let p = null;

            if ( /post/i.test(consumerRequest.method ) ) {
                formDataPromise.then( (formdata) => { // avoided "pyramid of doom", but have to take just one step of doom

                    consumerRequest.params.form = formdata;

                    // if no handler will be caught and return 500 (should have handler defined for POST)

                    try {
                        p = getHandler(route.handler, "post")( cnsmr, globals.mongodb );
                    } catch(e) {
                        globals.handleErrorResponse(formatError('POST', e), fpath, consumerResponse);
                        res.writeHead(500).end(consumerResponse.body);
                        return;
                    }

                    Promise.resolve(p).then(( data ) => {                        
                        if ( cnsmr.nextUrl ) { // maybe for GETs as well?
                            res.writeHead(302, { Location: cnsmr.nextUrl } ).end();
                        }
                        else if ( fpath ) {
                            res.writeHead(302, { Location: fpath } ).end();
                        }
                        else {
                            // API route
                            res.writeHead(200, getHeaderData()).end( data );
                        }

                    });

                });
            }
            // GET
            else {

                try {
                    p = route.handler ? getHandler(route.handler, "get")( cnsmr, globals.mongodb ) : null;
                } catch(e) {
                    globals.handleErrorResponse(formatError('GET', e), fpath, consumerResponse);
                    res.writeHead(500).end(consumerResponse.body);
                    return;
                }

                // have to wait even though handlers don't return anything in case handler function is await-ing anything
                Promise.resolve(p).then(( data ) => {            

                    if ( consumerResponse.body ) {
                        const errmsg = getSomethingUnswappedError(consumerResponse.body);
                        if ( errmsg ) {
                            globals.handleErrorResponse(formatError('GET', errmsg), fpath, consumerResponse);
                            res.writeHead(500).end(consumerResponse.body);
                            return;
                        }
                        res.writeHead(200, getHeaderData()).end( consumerResponse.body );
                    }
                    else {
                        // API route
                        res.writeHead(200, getHeaderData()).end( data );
                    }

                });
            }

        }).catch(msg => {
            console.log(msg);
            res.writeHead(500).end();
        });
}

const getHandler = ( x, key ) => typeof x === "function" ? x : x[key];

const formatError = ( method, e ) => `${method} error:<br/>${e.stack || e}`;

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