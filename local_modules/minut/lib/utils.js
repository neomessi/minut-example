const form = require('formidable')();

exports.parseRequest = (req) => {
    const [ fpath, qstr ] = req.url.split('?');
    const cleanfpath = fpath.replace(/(^\/.*?)\/?$/, "$1" ); // chop off trailing slash (if have route alias and pass params, like something/?num=123)
    
    const qmap = {};
    if ( qstr ) {
        const qarr = qstr.split(/\?|&/);
        qarr.forEach((e) => {
            const [ key, val ] = e.split('=')
            qmap[key] = val
        })
    }
    return [cleanfpath, qmap];
}

exports.parseForm = (req) => new Promise(( resolve ) => {
        form.parse(req, (err, fields, files) => {
            resolve( fields );
        });
    });

exports.consumerFuncs = {
    /**
     * 
     * @param {object} obj represents Mongo document
     * @param {object} fields form fields (key/value pairs)
     * @param {array} fillable indicates which form fields (keys) to populate in object (simliar to Laravel)
     * @param {boolean} convertFields if true, will change form field names first_name or FirstName to firstName
     */
     fillObject: ( obj, fields, fillable, convertFields=false ) => {
        Object.entries( fields )
            .filter( ([key]) => {
                // ~*~ check convertFields
                return fillable.indexOf(key) >= 0
            })
            .map( ([key, val]) => { obj[key] = val; } )  // .forEach( ([key, val]) => { obj[key] = val; } )
    }
}