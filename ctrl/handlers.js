/**
 * All functions in here will get called with consumer objects - they shouldn't return anything, just call consumer functions
 */

// const something = require('./lib/something')

module.exports = {

    customHandler: (consumer) => {
        // consumer.swapData("username", consumer.params.url.name ? consumer.params.url.name : "Sir");
        consumer.swapData("username", consumer.currentUserInfo.name ? consumer.currentUserInfo.name : "Sir");
    },

    squareHandler: (consumer) => {
        consumer.swapData("num", consumer.params.url.num ? consumer.params.url.num : 0);

        const unit = consumer.params.url.unit ? consumer.params.url.unit : 'things';
        consumer.swapData("unit", "{ unit: \"" + unit + "\" }");
    },

}