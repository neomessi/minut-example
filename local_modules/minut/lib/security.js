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

module.exports = function(mongodb, cookies) {
    this.mongodb = mongodb;
    this.cookies = cookies;

    // ~*~ should move this outside of export ("private") and pass in mongodb - or just do new Promise() in provideCurrentUser
    this._getUserInfo = async (pid) => {        
        const doc = await this.mongodb.collection("users").findOne( { curPermitId: ObjectId(pid) } ); //~*~ , { info: 1}        
        return doc;
    }

    this.provideCurrentUser = () => {
        let usingPermitId = this.cookies.get(securityCookieName, { signed: true });
        
        if ( !usingPermitId) {            
            usingPermitId = new ObjectId();
            const collection = this.mongodb.collection("users").insertOne( { curPermitId: usingPermitId, info: {} } );
            this.cookies.set(securityCookieName, usingPermitId, { signed: true });            
        }

        return this._getUserInfo(usingPermitId);
    }    
}

