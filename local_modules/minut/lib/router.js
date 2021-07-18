const apiConsumer = require('./consumers/apiConsumer')
const webConsumer = require('./consumers/webConsumer')
const processApiRoute = require('./routers/apiRouter')
const processWebRoute = require('./routers/webRouter')
const utils = require('./utils')

module.exports = function( globals, routes ) {
    this.globals = globals;
    this.routes = routes,

    this.route = (req, res, bundler, security) => {

        const [ fpath, qmap ] = utils.parseRequest(req);

        const isApi = fpath.split("/")[1].match(/^api$/);
        
        const usingConsumer = isApi ? apiConsumer : webConsumer;
        const consumerRequest = new usingConsumer.Request( req.method, qmap, {} );

        const formDataPromise = utils.parseForm(req);
        
        // check route existence
        let ifound = -1;
        this.routes.some( (r, i ) => {
            if ( r.url === fpath) {
                ifound = i;
                return true;
            }
        });

        const usingRoute = ifound >= 0 ? this.routes[ifound] : {};

        if ( isApi ) {
            processApiRoute(
                res,
                usingRoute,
                this.globals,
                "",
                security,
                formDataPromise,
                consumerRequest,
            );
        }
        else {
            processWebRoute(
                bundler,
                res,
                usingRoute,
                this.globals,
                fpath,
                security,
                formDataPromise,
                consumerRequest,
            );
        }

    }
}