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
  * routes that start with /api/ will automatically set the response type to application/json // { url: '/api/info' },
 * api routes don't have page, just url and handler
 */
const apiHandlers = require('./apiHandlers')
const guards = require('./guards')
const handlers = require('./handlers')

module.exports = [    
    { url: '/', page: 'index.html' },
    { url: '/register',
        page: 'register.html',
        handler: handlers.registrationHandler,
        guard: guards.registrationGuard.bind(null, '/userinfo')
    },
    { url: '/login', page: 'login.html', handler: handlers.loginHandler },
    { url: '/logout', page: 'login.html', handler: handlers.logoutHandler },
    { url: '/userinfo', page: 'userinfo.html', handler: handlers.userInfoHandler },
    { url: '/start', page: 'start.html', handler: handlers.customHandler },
    { url: '/sensitive', page: 'sensitive.html', guard: guards.customGuard.bind(null, '') },
    { url: '/square', page: 'square.html', handler: handlers.squareHandler },

    // API routes
    { url: '/api/test1', handler: apiHandlers.test1, guard: guards.loggedInGuard.bind(null, '') },
    { url: '/api/save/prefs', handler: apiHandlers.savePrefs },
];