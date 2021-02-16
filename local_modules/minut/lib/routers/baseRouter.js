/**
 * 
 */

module.exports = function (
    res,
    globals,
    consumerRequest,
    consumerResponse,
    formDataPromise,
    getHeaderData,
    route,    
    security,    
    fpath ) {

    let currentUserPermitId = 0;
                
    // finish route in current user context
    security.provideCurrentUser()
        .then( currentUser => {
            console.log(currentUser);

            currentUserPermitId = currentUser.permitId;                        
            const cuinfo = currentUser.info ? currentUser.info : {};
            
            // check guards
            if ( route.guard ) {
                const [allow, redir] = route.guard(cuinfo, currentUser.userName);
                if ( !allow ) {
                    if ( redir) {
                        res.writeHead(302, { Location: redir } ).end();
                    }
                    res.writeHead(403).end();    
                }
            }

            const cnsmr = {
                ...consumerRequest,
                ...consumerResponse,
                currentUserInfo: { ...cuinfo },
                currentUserName: currentUser.userName,
                security: {...security.consumerFuncs}
            };

            if ( /post/i.test(consumerRequest.method ) ) {
                formDataPromise.then( (formdata) => { // avoided "pyramid of doom", but have to take just one step of doom

                    console.log("**FORM DATA**")
                    console.log(formdata)

                    consumerRequest.params.form = formdata;
                    // ~*~ csrf check (npm)                                

                    // if no handler will be caught and return 500 (should have handler defined for POST)
                    const p = route.handler( cnsmr, globals.mongodb );
                    
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
                const p = route.handler ? route.handler( cnsmr, globals.mongodb ) : null;
                
                // have to wait even though handlers don't return anything in case handler function is await-ing anything
                Promise.resolve(p).then(( data ) => {            

                    if ( consumerResponse.body ) {
                        // ~*~ put back
                        // var errmsg = getSomethingUnswappedError(consumerResponse.body);
                        // if ( errmsg ) {
                        //     res.writeHead(500).end(errmsg);
                        // }                        
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