/**
 *
 */

const fs = require('fs');
const processRoute = require('./baseRouter');
const consumer = require('../consumers/webConsumer');

const getHeaderData = (ext) => {
    const eternity = 31536000;
    let hd = {};

    switch (ext) {
    case 'css':
        hd = { 'Content-Type': 'text/css', 'Cache-Control': `max-age=${eternity}` };
        break;

    case 'js':
        hd = { 'Content-Type': 'text/javascript', 'Cache-Control': `max-age=${eternity}` };
        break;

    case 'html':
        hd = { 'Content-Type': 'text/html' };
        break;
    default:
    // should set cache for images? (favicon.ico, etc)
    }
    return hd;
};

module.exports = function (
    bundler,
    res,
    route,
    globals,
    fpath,
    ...rest
) {
    const haveRoute = Object.keys(route).length > 0;
    let resource = fpath;

    if (haveRoute) {
        resource = route.page;
    }

    const resourceExt = resource.split('.').pop();
    const isHtml = /html/.test(resourceExt);

    let resourceDir = globals.distDir;
    if (isHtml) {
        resourceDir = haveRoute ? globals.htmlSrcDir : `${globals.distDir}/html`;
    }
    const encoding = isHtml ? 'utf8' : null; // need utf8 for string matching (data swapping)

    try {
        const data = fs.readFileSync([resourceDir, resource].join('/'), encoding);

        const subdata = isHtml ? bundler.autoSwapBundles(data) : data;

        if (haveRoute) {
            const consumerResponse = new consumer.Response(subdata);

            processRoute(
                getHeaderData.bind(null, resourceExt),
                res,
                route,
                globals,
                fpath,
                ...rest,
                consumerResponse,
            );
        } else {
            // no route found, just returns data. If html file, will have already run autoSwapBundles
            res.writeHead(200, getHeaderData(resourceExt)).end(subdata);
        }
    } catch (e) {
        // fs.readFileSync exception

        console.log(e);
        res.writeHead(404).end();
    }
};
