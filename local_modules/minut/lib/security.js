/**
 * users collection:
 * ~*~ create mongoose model
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
 *      // ~*~  TBD: custom merge function can be passed in to handle how info is merged when guest logs in
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
const crypto = require('crypto');

const { ObjectId } = require('mongodb');
const utils = require('./utils');

const securityCookieName = 'pid'; // permit id
const securityCookieIndexName = 'iid'; // permit issuance id

const getCookieExpDate = () => {
    // ~*~ pid should not expire(?), just iid

    const date = new Date();
    // ~*~ and also for logging in as user - that expiration will be session
    date.setDate(date.getDate() + 90); // ~*~ config
    // date.setMinutes(date.getMinutes() + 2); // testing

    return date;
};

const getNewUserData = (newPermitId, newPermitIssuanceId) => (
    {
        permitId: newPermitId,
        permitIssuances: [{ issuanceId: newPermitIssuanceId, touched: new Date() }],
        info: {},
    }
);

const getCurrentUserPermitId = (cookies) => cookies.get(securityCookieName, { signed: true });

const getCurrentUserPermitIndex = (cookies) => cookies.get(securityCookieIndexName, { signed: true });

const sendCookies = (cookies, pid, iid) => {
    const usingPermitId = pid || new ObjectId();
    const usingPermitIndex = iid || new ObjectId();
    cookies.set(securityCookieName, usingPermitId, { signed: true, overwrite: true, expires: getCookieExpDate() })
           .set(securityCookieIndexName, usingPermitIndex, { signed: true, overwrite: true, expires: getCookieExpDate() });
};

const convertPassword = (pwd) => crypto.createHash('md5').update(pwd).digest('hex');

module.exports = function (mongodb, cookies) {
    this.mongodb = mongodb;
    this.cookies = cookies;

    // private but has access to this scope
    const updateCurrentUserInfo = (info) => {
        const pid = getCurrentUserPermitId(this.cookies);

        return this.mongodb.collection('users').updateOne(
            { permitId: ObjectId(pid) },
            { $set: { info } },
        );

        // ~*~ below didn't work for some reason
        // if ( result.matchedCount == 1 ) {
        //     console.log("update success!");
        // }else{
        //     throw "update FAILED!"
        // }
    };

    // all consumerFuncs return promise
    this.consumerFuncs = {

        // ~*~ have to call merge function
        login: (un, pw) => this.mongodb.collection('users').findOne({ userName: un, password: convertPassword(pw) })
            .then((user) => {
                if (!user) {
                    throw new Error('invalid');
                }
                return user;
            })
            .then((validuser) => {
                // push new instance
                const iid = new ObjectId();
                this.mongodb.collection('users').updateOne(
                    { permitId: ObjectId(validuser.permitId) },
                    { $push: { permitIssuances: { issuanceId: iid, touched: new Date() } } },
                );
                sendCookies(this.cookies, validuser.permitId, iid);
            })
            .catch((msg) => {
                throw msg;
            }),

        // ~*~ pull iid
        logout: () => new Promise((resolve) => {
            sendCookies(this.cookies);
            resolve(true);
        }),

        // logoutAll: () => { } // ~*~ clear pid

        // ~*~ should return recovery phrase(?)
        register: (un, pw) => {
            const pid = getCurrentUserPermitId(this.cookies);

            return this.mongodb.collection('users').findOne(
                { userName: un },
            ).then((result) => {
                if (result) {
                    throw new Error('exists');
                }
            }).then(() => {
                this.mongodb.collection('users').updateOne(
                    { permitId: ObjectId(pid) },
                    { $set: { userName: un, password: convertPassword(pw) } },
                );
            })
                .then(() => 'success')
                .catch((err) => {
                    throw err;
                });
        },

        setCurrentUserInfo: (info) => {
            updateCurrentUserInfo(info);
        },

        saveCurrentUserInfo: (cnsmr) => {
            updateCurrentUserInfo(cnsmr.currentUserInfo);
        },

        saveFormFieldsToCurrentUserInfo: (cnsmr, fillable) => {
            utils.consumerFuncs.fillObject(cnsmr.currentUserInfo, cnsmr.request.params.form, fillable);
            updateCurrentUserInfo(cnsmr.currentUserInfo);
        },

    };

    this.provideCurrentUser = () => {
        let usingPermitId = getCurrentUserPermitId(this.cookies);
        let usingPermitIndex = getCurrentUserPermitIndex(this.cookies);
        const newUserData = getNewUserData(usingPermitId, usingPermitIndex);

        // again, this could call user.js function?
        return this.mongodb.collection('users').findOne({ permitId: ObjectId(usingPermitId) })
            .then((user) => {
                if (!user) {
                    throw new Error('missing');
                }
                return user;
            }).catch((reason) => {
                // console.log(reason);
                switch (reason) {
                case 'missing':
                    usingPermitId = new ObjectId();
                    usingPermitIndex = new ObjectId();

                    // return this.mongodb.collection('users').insertOne( {
                    //             permitId: usingPermitId,
                    //             permitIssuances: [{ issuanceId: usingPermitIndex, touched: new Date() }],
                    //             info: {},
                    //     }).then(()=> {
                    //         // could just return struct
                    //         return this.mongodb.collection('users').findOne( { permitId: ObjectId(usingPermitId) })
                    //     });

                    this.mongodb.collection('users').insertOne(newUserData);
                    return newUserData; // no need to wait around

                case 'expired':
                    // cookies cleared by browser if expired, goes into "missing" above
                    break;
                default:
                }
                return null;
            })
            .finally(() => {
                // creates cookie if new, updates expiration for existing
                sendCookies(this.cookies, usingPermitId, usingPermitIndex);
            });
    };
};
