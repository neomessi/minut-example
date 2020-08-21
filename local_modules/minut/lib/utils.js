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
