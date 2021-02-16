const baseConsumer = require('./baseConsumer.js');

module.exports = {
    ...baseConsumer,

    Response: function(body) {
        this.body = body;
        this.swapData = (key, val) => {
            const re = new RegExp("~`data:"+key+"`~", "g");
            this.body = this.body.replace(re, val);
        }
    },
}