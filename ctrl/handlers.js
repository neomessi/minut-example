/**
 * All functions in here will be passed a Consumer object and a mongodb object.
 * 
 * Within a handler:
 *  GET requests shouldn't return anything.
 *  POST requests (you have to have a handler for post, otherwise will error):
 *      to update the current user, just set fields directlry:
 *          consumer.currentUserInfo.email = "a@b.com"
 *      and call consumer.security.saveCurrentUserInfo(consumer.currentUserInfo);
 *      
 *      Set consumer.nextUrl (if not will just redirect back to page)
 * 
 *  If you need to make updates to other collections, use the mongodb object passed in and return a promise
 * 
 *  can make async and await whatever you want, or return nothing.
 */

// const something = require('./lib/something')

module.exports = {

    customHandler: (consumer) => {
        // consumer.swapData("username", consumer.params.url.name ? consumer.params.url.name : "Sir");
        consumer.swapData("username", consumer.currentUserInfo.name ? consumer.currentUserInfo.name : "Sir");
    },

    squareHandler: (consumer) => {
        consumer.swapData("userName", consumer.currentUserName ? consumer.currentUserName : "");
        consumer.swapData("num", consumer.params.url.num ? consumer.params.url.num : 0);

        const unit = consumer.params.url.unit ? consumer.params.url.unit : 'things';
        consumer.swapData("unit", "{ unit: \"" + unit + "\" }");
    },

    userInfoHandler: async (consumer, mdb) => {
        if ( consumer.method === 'POST') {
            consumer.currentUserInfo.fullName = consumer.params.form.fullName;
            consumer.currentUserInfo.email = consumer.params.form.email;

            await consumer.security.saveCurrentUserInfo(consumer.currentUserInfo);
            consumer.nextUrl = "/userinfo/?ok=1";

            /*
            return new Promise(resolve => {
                // example that would be for other collections:
                resolve( mdb.collection("users").updateOne(
                        { permitId: ObjectId("5f8cae240c89e900772c48fb") },
                        { $set: { "info" : consumer.currentUserInfo } }
                    )
                ); //, { info: 1}
            })
            */
        }
        else {
            consumer.swapData("message", consumer.params.url.ok ? "Updated sucessfully!" : "");
            consumer.swapData("userName", consumer.currentUserName ? consumer.currentUserName : "");
            consumer.swapData("fullName", consumer.currentUserInfo.fullName ? consumer.currentUserInfo.fullName : "");
            consumer.swapData("email", consumer.currentUserInfo.email ? consumer.currentUserInfo.email : "");
        }
        
    },

    loginHandler: async (consumer) => {
        if ( consumer.method == 'POST') {
            await consumer.security.login(consumer.params.form.userName, consumer.params.form.password);
            consumer.nextUrl = "/userinfo";
        }
   },

    logoutHandler: async (consumer) => {
         await consumer.security.logout();
    },

    registrationHandler: async (consumer) => {
        if ( consumer.method == 'POST') {
            const result = await consumer.security.register(consumer.params.form.userName, consumer.params.form.password);
            console.log(`registrationHandlerResult: ${result}`);
            consumer.nextUrl = "/userinfo/?ok=2"; // 2=registered successfully
        }
    }

}