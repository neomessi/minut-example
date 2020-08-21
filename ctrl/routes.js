/**
 * Only have to define route if:
 *      url != page     
 *      have a handler for route - mainly if need to do data swapping (~`data:x`~)
 *  
 * Don't need to define route if url == page (and no handler function)
 */
const handlers = require('./handlers')

module.exports = [    
    { url: '/', page: 'index.html', },
    { url: '/start', page: 'start.html', handler: handlers.customHandler },
];