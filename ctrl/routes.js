/**
 * Only have to define route if:
 *      url != page
 *      have a handler for route - mainly if need to do data swapping (~`data:x`~)
 *      want to protect page
 *  
 * Need to define a route for every page in /gui/web/src/html.
 * 
 * If the browser url is a file with .html extension, if doesn't find a route will look in /gui/web/dist/html for it.
 * In other words:
 *      /gui/web/dist/html --> static* html files (public access) *NOTE: will still do autoswapping bundles
 *      /gui/web/src/html --> html files that: have special mapping/need preprocessing/have restricted access
 * 
 * ~*~TODO: routes that start with /api/ will automatically set the response type to text/json // { url: '/api/info' },
 */
const handlers = require('./handlers')
const guards = require('./guards')

module.exports = [    
    { url: '/', page: 'index.html' },
    { url: '/login', page: 'login.html' },
    { url: '/start', page: 'start.html', handler: handlers.customHandler },
    { url: '/sensitive', page: 'sensitive.html', guard: guards.customGuard.bind(null, '/login') },
    { url: '/square', page: 'square.html', handler: handlers.squareHandler },
];