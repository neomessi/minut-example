module.exports = {
    test1: () => {
        // setTimeout(() => {
        return '{ "testing": "123" } ';
        // }, 2000
        //);
    },

    savePrefs: () => {
        console.log("in savePrefs handler");
        // return new Promise( resolve => { resolve('{ "result": "success" } ') } );
        // return "ok";
        return '{ "result": "success" }';
    },

}