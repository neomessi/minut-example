/**
 * All functions in here must return an object:
 *
 * {
 *   requirement: <required condition>,
 *   redirect: <url if required condition not met, optional> (use empty string to make optional)
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
 * Most of the time you will just pass along the url defined in route, like this:
 *   redirect: url
 * However you can override with whatever you want.
 * 
 * All guards receive these params (url is defined above in routes.js):
 * (url, consumer, mdb)
 * 
 */

// const something = require('./lib/something')

module.exports = {

    customGuard: (url, consumer, mdb) => {
        return {
            requirement: consumer.currentUserInfo && consumer.currentUserInfo.fullName,
            redirect: url
        }
    },

    loggedInGuard: (url, consumer, mdb) => {
        return {
            requirement: consumer.currentUserName,
            redirect: url
        }
    },

    registrationGuard: (url, consumer, mdb) => {
        return {
            requirement: !consumer.currentUserName,
            redirect: url
        }
    },

}