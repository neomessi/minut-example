/**
 * All functions in here must return an object:
 *
 * {
 *   requirement: <required condition>,
 *   redirect: <url if required condition not met> (optional)
 * }
 * 
 * If passed url param on failure will redirect to there, else will just send a 403
 * Pass in routes.js like this:
 *      guard with redirect:
 *      { url: '/sensitive', page: 'sensitive.html', guard: guards.customGuard.bind(null, '/login') },
 * 
 *      guard without redirect - will simply return 403:
 *      { url: '/sensitive', page: 'sensitive.html', guard: guards.customGuard.bind(null, '') },
 * 
 * All guards receive these params (url is defined above in routes.js):
 * (url, currentUserInfo, currentUserName)
 * 
 * currentUserName is only defined if registered
 */

// const something = require('./lib/something')

module.exports = {

    customGuard: (url, currentUserInfo, currentUserName) => {
        return {
            requirement: currentUserInfo && currentUserInfo.fullName,
            redirect: url
        }
    },

    loggedInGuard: (url, currentUserInfo, currentUserName) => {
        return {
            requirement: currentUserName,
            redirect: url
        }
    },

    registrationGuard: (url, currentUserInfo, currentUserName) => {
        return {
            requirement: !currentUserName,
            redirect: url
        }
    },

}