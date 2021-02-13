/**
 * users collection:
 * ~*~ create mongoose model/typescript type
 * {
 *      // user id, not exposed (permit id is used instead)
 *      _id,
 * 
 *      // these are only if they create account:
 *      ?userName: "",
 *      ?password: "", // md5 encrypted
 *      ?dateCredentialed: null,
 * 
 *      // anything in info will be exposed as consumer.currentUserInfo, here is where you can put name, email, etc.
 *      // and also any application-defined security roles (isAdmin, etc.) *
 *      // ~*~  custom merge function can be passed in to handle how info is merged when guest logs in
 *      //      (default to dismissing guest info and just pulling registered info)
 *      info: {},
 * 
 *      permitId: ObjectId,
 * 
 *      // for multiple logins on different browsers/devices
 *      // acts as login history [*when logout pull issuance]
 *      // ~*~ possible idea is to have issuance-specific info, like what page of results they're on, etc.
 *      permitIssuances: [
 *          {
 *              issuanceId: ObjectId,
 *              touched: null, ~*~created
 *          }
 *      ]
 * } 
 * 
 * extra security measures:
 * if don't pass iid or not recreate pid?
 */
const ObjectId = require('mongodb').ObjectId;

const securityCookieName = 'pid'; // permit id
const securityCookieIndexName = 'iid'; // permit issuance id

const getCookieExpDate = () => {
    // ~*~ pid should not expire(?), just iid

    const date = new Date();
    // ~*~ and also for logging in as user - that expiration will be session
    // date.setDate(date.getDate() + 90); // ~*~ config
    date.setMinutes(date.getMinutes() + 2); // ~*~ testing

    return date;
}

const getNewUserData = (newPermitId, newPermitIssuanceId) => {
    return {
        permitId: newPermitId,
        permitIssuances: [{ issuanceId: newPermitIssuanceId, touched: new Date() }],
        info: {},                                
    }
}

const getCurrentUserPermitId = (cookies) => cookies.get(securityCookieName, { signed: true });

const getCurrentUserPermitIndex = (cookies) => cookies.get(securityCookieIndexName, { signed: true });

const sendCookies = (cookies, pid, iid) => {
    usingPermitId = pid || new ObjectId();
    usingPermitIndex = iid || new ObjectId();
    cookies.set(securityCookieName, usingPermitId, { signed: true, overwrite: true, expires: getCookieExpDate() })
           .set(securityCookieIndexName, usingPermitIndex, { signed: true, overwrite: true, expires: getCookieExpDate() })
}

module.exports = function(mongodb, cookies) {
    this.mongodb = mongodb;
    this.cookies = cookies;

    // all consumerFuncs return promise
    this.consumerFuncs = {

        login: (un, pw) => {
            // ~*~ have to call merge function
            // ~*~ md5 unhash pw
            return this.mongodb.collection("users").findOne( { userName: un, password: pw } )
            .then((user) => {
                if (!user) {
                    throw "invalid";
                }
                return user;                
            })
            .then((validuser) => {
                // push new instance
                const iid = new ObjectId();
                
                this.mongodb.collection("users").updateOne(
                    { permitId: ObjectId(validuser.permitId) },
                    { $push: { permitIssuances: { issuanceId: iid, touched: new Date() } } }
                );
                sendCookies(this.cookies, validuser.permitId, iid);
            })
            .catch((msg) => {
                console.log("INVALID login"); // ~*~ do something?
            })
        },

        logout: () => {
            console.log("security logout...");
            // ~*~ pull iid
            return new Promise((resolve)=>{
                setTimeout(()=> {
                    sendCookies(this.cookies);
                    resolve(true);
                }, 1000 ); // ~*~
            });
        },

        // logoutAll: () => { } // ~*~ clear pid

        register: (un, pw) => {
            const pid = getCurrentUserPermitId(this.cookies);
            
            return this.mongodb.collection("users").findOne(
                { userName: un }
            ).then((result) => {
                if ( result) {
                    throw "exists";
                }
            }).then(() => {            
                // ~*~ md5 hash pw
                this.mongodb.collection("users").updateOne(
                    { permitId: ObjectId(pid) },
                    { $set: { userName: un, password: pw} }
            )}).then(() => {
                return "success";
            }).catch((err) => {
                return err;
            });

            // ~*~ should return recovery phrase
        },

        // getCurrentUserName: () => {
        //     let usingPermitId = getCurrentUserPermitId(this.cookies);
        //     return this.mongodb.collection("users").findOne( { permitId: ObjectId(usingPermitId) }, { userName: 1 }); // ~*~ grr why doesn't it only return userName?
        // }

        // login(un, pw)

        // ~*~ should this be in separate file? CurrentUser.js? getUserName, getInfo, saveInfo
        saveCurrentUserInfo: ( info ) => {
            let pid = getCurrentUserPermitId(this.cookies);

            return this.mongodb.collection("users").updateOne(
                        { permitId: ObjectId(pid) },
                        { $set: { "info" : info } })

                        // ~*~ below didn't work for some reason                              
                        // if ( result.matchedCount == 1 ) {
                        //     console.log("update success!");
                        // }else{
                        //     throw "update FAILED!"
                        // }
        },

    }

    this.provideCurrentUser = () => {
        let usingPermitId = getCurrentUserPermitId(this.cookies);
        let usingPermitIndex = getCurrentUserPermitIndex(this.cookies);        

        return this.mongodb.collection("users").findOne( { permitId: ObjectId(usingPermitId) })
            .then((user) => {
                if (!user) {
                    throw "missing";
                }
                return user;

            }).catch((reason) => {
                console.log(reason);
                switch (reason) {
                    case "missing":
                        usingPermitId = new ObjectId();
                        usingPermitIndex = new ObjectId();
                        
                        // return this.mongodb.collection("users").insertOne( {
                        //             permitId: usingPermitId,
                        //             permitIssuances: [{ issuanceId: usingPermitIndex, touched: new Date() }],
                        //             info: {},                                
                        //     }).then(()=> {
                        //         // could just return struct
                        //         return this.mongodb.collection("users").findOne( { permitId: ObjectId(usingPermitId) })
                        //     });

                        const newUserData = getNewUserData(usingPermitId, usingPermitIndex);
                        this.mongodb.collection("users").insertOne(newUserData); // no need to wait around                        
                        return newUserData;

                    case "expired":
                        // cookies cleared by browser if expired, goes into "missing" above                        

                }
            }).finally(()=>{
                // creates cookie if new, updates expiration for existing
                sendCookies(this.cookies, usingPermitId, usingPermitIndex);
            });
    }
}
