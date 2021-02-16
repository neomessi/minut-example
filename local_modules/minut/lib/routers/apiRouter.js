/** API route - return data/handle form post return result
 * 
*/
const processRoute = require('./baseRouter')

module.exports = function (
    res,
    globals,
    consumerRequest,                
    formDataPromise,
    route,    
    security) {
    
    if ( Object.keys(route).length == 0 ) {    
        res.writeHead(404).end();
        return;
    }

    processRoute (
        res,
        globals,
        consumerRequest,
        {},
        formDataPromise,
        getHeaderData,
        route,        
        security,
        "" );
}

const getHeaderData = () => {
    return { 'Content-Type': 'application/json' }
};