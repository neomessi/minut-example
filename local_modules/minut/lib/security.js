/**
 * users collection:
 * ~*~ should create mongoose model/typescript type
 * {
 *      _id,
 * 
 *      // these are only if they create account:     
 *      ?userName: "",
 *      ?passWord: "", // md5 encrypted
 *      ?dateCredentialed: null,
 * 
 *      info: {}, // anything here will be exposed as consumer.currentUserInfo, here is where you can put name, email, etc., and also any application-defined security roles (isAdmin, etc.) *
 *      curPermitId: null,
 *      permits: [
 *          {
 *              permitId: ,
 *              touched: null,
 *          }
 *      ]
 * } 
 * 
 */
const ObjectId = require('mongodb').ObjectId;

const securityCookieName = 'permitId';

const getCookieExpDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 90); // ~*~ config
    return date;
}

module.exports = function(mongodb, cookies) {
    this.mongodb = mongodb;
    this.cookies = cookies;

    this.getCurrentUserPermitId = () => this.cookies.get(securityCookieName, { signed: true });

    this.provideCurrentUser = () => {
        let usingPermitId = this.getCurrentUserPermitId();
        
        if ( !usingPermitId) {            
            usingPermitId = new ObjectId();
            const collection = this.mongodb.collection("users").insertOne( { curPermitId: usingPermitId, info: {} } );
        }
        this.cookies.set(securityCookieName, usingPermitId, { signed: true, /*overwrite: true,*/ expires: getCookieExpDate() });

        return new Promise((resolve) => {
            resolve( this.mongodb.collection("users").findOne( { curPermitId: ObjectId(usingPermitId) } ) ); //~*~ , { info: 1}
        });
    }    
}
