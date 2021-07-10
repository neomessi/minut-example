/**
 * All functions in here will be passed a Consumer object and a mongodb object.
 * 
 * Within a handler:
 *  GET requests shouldn't return anything.
 *  POST requests (you have to have a handler for post, otherwise will error):
 *      to update the current user, can just set fields directlry:
 *          consumer.currentUserInfo.email = "a@b.com"
 *      and call consumer.security.saveCurrentUserInfo(consumer);
 *      (there are also other ways of doing this - see example below)
 *      
 *      Set consumer.nextUrl (if not will just redirect back to page)
 * 
 *  If you need to make updates to other collections, use the mongodb object passed in and return a promise
 * 
 *  can make async (post handlers) and await whatever you want, or return nothing.
 */

// const something = require('./lib/something')

module.exports = {

    customHandler: (consumer, mdb) => {
        consumer.swapData("userName", consumer.currentUserName ? consumer.currentUserName : "Sir");
    },

    squareHandler: (consumer, mdb) => {
        consumer.swapData("userName", consumer.currentUserName ? consumer.currentUserName : "");
        consumer.swapData("num", consumer.params.url.num ? consumer.params.url.num : 0);

        const unit = consumer.params.url.unit ? consumer.params.url.unit : 'things';
        consumer.swapData("unit", "{ unit: \"" + unit + "\" }");
    },

    userInfoHandler: (consumer, mdb) => {
        consumer.swapData("userName", consumer.currentUserName ? consumer.currentUserName : "");
        consumer.swapData("message", consumer.params.url.ok ? "Updated sucessfully!" : "");
        consumer.swapData("fullName", consumer.currentUserInfo.fullName ? consumer.currentUserInfo.fullName : "");
        consumer.swapData("email", consumer.currentUserInfo.email ? consumer.currentUserInfo.email : "");
    },

    userInfoPostHandler: async (consumer, mdb) => {
        consumer.swapData("userName", consumer.currentUserName ? consumer.currentUserName : "");

        // Four ways to save current user info:

        // 1) overwriting consumer.currentUserInfo with new object:
        // const infoCopy = { ...consumer.currentUserInfo };
        // infoCopy.fullName = consumer.params.form.fullName;
        // infoCopy.email = consumer.params.form.email;
        // await consumer.security.setCurrentUserInfo(infoCopy);

        // 2) setting consumer.currentUserInfo fields manually and saving:
        // consumer.currentUserInfo.fullName = consumer.params.form.fullName;
        // consumer.currentUserInfo.email = consumer.params.form.email;
        // await consumer.security.saveCurrentUserInfo(consumer);

        // 3) using convenience function for copying form fields in consumer object:
        await consumer.security.saveFormFieldsToCurrentUserInfo( consumer, ["email", "fullName"] );

        // 4) usning the utils function (this is really intended saving other collections than user):
        // consumer.utils.fillObject( consumer.currentUserInfo, consumer.params.form, ["email", "fullName"] );
        // await consumer.security.setCurrentUserInfo(consumer.currentUserInfo);

        // Additional example that would be for saving other collections:
        /*
        return new Promise(resolve => {
            resolve( mdb.collection("users").updateOne(
                    { permitId: ObjectId("5f8cae240c89e900772c48fb") },
                    { $set: { "info" : consumer.currentUserInfo } }
                )
            ); //, { info: 1}
        })
        */
        consumer.nextUrl = "/userinfo/?ok=1";
    },

    loginHandler: async (consumer, mdb) => {
        if ( consumer.method == 'POST') {
            await consumer.security.login(consumer.params.form.userName, consumer.params.form.password);
            consumer.nextUrl = "/userinfo";
        }
   },

    logoutHandler: async (consumer, mdb) => {
         await consumer.security.logout();
    },

    registrationHandler: async (consumer, mdb) => {
        if ( consumer.method == 'POST') {
            const result = await consumer.security.register(consumer.params.form.userName, consumer.params.form.password);
            console.log(`registrationHandlerResult: ${result}`);
            consumer.nextUrl = "/userinfo/?ok=2"; // 2=registered successfully
        }
    }

}