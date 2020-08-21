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
            return this.body.replace("~`data:"+key+"`~", val)
        }
    }
}