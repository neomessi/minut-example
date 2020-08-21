/**
 * All functions in here will get called with consumer objects:
 */

// const something = require('./lib/something')

module.exports = {

    customHandler: (consumer) => {        
        return consumer.swapData("username", consumer.params.url.name);        
    },

}