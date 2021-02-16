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

exports.parseForm = (req) => {    
    let body = '';
    return new Promise(( res) => {

        // ~*~ use https://www.npmjs.com/package/formidable

        req.on('data', chunk => {
            // console.log( "chunk: " + chunk.toString() );
            // body += chunk.toString();

            const fstr = {};
            chunk.toString().split("&").forEach(e => {
                const [k, v] = e.split("=");
                fstr[k] = decodeURIComponent(v); // ~*~sanitize
            });                        
            res(fstr);
        });

    });

    // req.on('end', () => {        
    //     console.log(body);
    //     return body;
    // });
}
