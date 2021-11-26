/**
 * I'm an example of a vanilla js bundle
 */

// see comment in \minut-example\local_modules\minut\lib\ui\webpackConfigurator.js regarding this import (@babel/preset-env)
// import "regenerator-runtime/runtime"; // for async/await

window.addEventListener('DOMContentLoaded', (event) => {

    // fetch
    document.querySelector("#getFavNum").addEventListener("click", async () => {
        const result = await fetch("/api/test1");
        const obj = await result.json();
        document.querySelector("#favNum").value = obj.testing;
    });

    // post
    document.querySelector("#setFavNum").addEventListener("click", async () => {
        const body = new FormData();
        body.append( "favNum", document.querySelector("#favNum").value );

        const result = await fetch( "/api/save/prefs",
        {
            method: "POST",
            body
        });

        const obj = await result.json();
        console.log( obj.result );
    });

});