/**
 * All functions in here will be passed a Consumer object and a mongodb object.
 * 
 * Within a handler:
 *  GET requests shouldn't return anything.
 *  POST requests (you have to have a handler for post, otherwise will error):
 *      to update the current user, just set fields directlry:
 *          consumer.currentUserInfo.email = "a@b.com"
 *      and they will be automatically saved for you.
 *      
 *      Set consumer.nextUrl (if not will just redirect back to page)
 * 
 *  If you need to make updates to other collections, use the mongodb object passed in and return a promise ~*~TBD
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

    userInfoHandler: (consumer, mdb) => {        
        if ( consumer.method === 'POST') {            
            consumer.currentUserInfo.name = consumer.params.form.userName;
            consumer.currentUserInfo.email = consumer.params.form.email;
            
            /*            
            return new Promise(resolve => {                                
                // example that would be for other collections:
                resolve( mdb.collection("users").updateOne(
                        { curPermitId: ObjectId("5f8cae240c89e900772c48fb") },
                        { $set: { "info" : consumer.currentUserInfo } }
                    )
                ); //, { info: 1}
            })
            */           

            consumer.nextUrl = "/userinfo/?ok=1"; // consumer.nextUrl = "/start";
        }
        else {
            consumer.swapData("message", consumer.params.url.ok ? "Updated sucessfully!" : "");
            consumer.swapData("userName", consumer.currentUserInfo.name ? consumer.currentUserInfo.name : "");
            consumer.swapData("email", consumer.currentUserInfo.name ? consumer.currentUserInfo.email : "");
        }
    },

}