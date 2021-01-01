/**
 * All functions in here must return an array with first element boolean.
 * Second (optional) array element is url to redirect to if false
 *      return[bool, url]
 * 
 * If passed url param on failure will redirect to there, else will just send a 403
 * Pass in routes.js like this:
 *      guard with redirect:
 *      { url: '/sensitive', page: 'sensitive.html', guard: guards.customGuard.bind(null, '/login') },
 * 
 *      guard without redirect - will simply return 403:
 *      { url: '/sensitive', page: 'sensitive.html', guard: guards.customGuard },  
 * 
 */

// const something = require('./lib/something')

module.exports = {

    customGuard: (url, currentUserInfo) => {
        return [currentUserInfo.name, url];        
    },

    registrationGuard: (url, currentUserInfo, currentUserName) => {
        return [!currentUserName, url];        
    },

}