/**
 * This is for user of framework
 * methods on these objects will be passed to route handlers:
 *  handler( {...new consumer.Request(), ...new consumer.Response(x)}
 */

module.exports = {
    Request: function(method, params) {
        this.method = method;
        this.params = { url: params, form: {} };        
    },

    Response: function(body) {
        this.body = body;
        this.swapData = (key, val) => {
            const re = new RegExp("~`data:"+key+"`~", "g");
            this.body = this.body.replace(re, val);
        }
    }
}