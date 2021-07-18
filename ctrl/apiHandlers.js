module.exports = {
    test1: ( consumer ) => `{ "testing": ${ consumer.currentUserInfo.favNum || 0 } } `,

    savePrefs: async ( consumer ) => {
        console.log( consumer );

        consumer.currentUserInfo.favNum = consumer.request.params.form.favNum;
        await consumer.security.setCurrentUserInfo(consumer.currentUserInfo);
        return '{ "result": "success" }';
    },

}