/**
 * This is for user of framework
 * methods on these objects will be passed to route handlers:
 *  handler( request, response, currentUserInfo )
 * 
 * currentUserInfo has all the fields in the collection users.info.
 * Note: the users _id field is purposely omitted - that is never exposed (or even used by app),
 * instead a tempory "permit id" is used to get user data (which is temporary) -
 * but all of that is handled for you by framework (the permit id is stored in an encrypted cookie)
 *
 * ~*~ should this be outside of lib?
 * 
 * ~*~ have baseConsumer that webConsumer and apiConsumer export
 */

module.exports = {

    Request: function(method, params) {
        this.method = method;
        this.params = { url: params, form: { /* supplied later */ } };
    },

    Response: function(body) {
        this.body = body;
        this.swapData = (key, val) => {
            const re = new RegExp("~`data:"+key+"`~", "g");
            this.body = this.body.replace(re, val);
        }
    },

}